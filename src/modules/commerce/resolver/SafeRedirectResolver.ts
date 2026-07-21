import { IRedirectResolver } from './IRedirectResolver';
import { SecureUrlValidator } from './SecureUrlValidator';
import { ResolverError, ResolverErrorType } from './types';

export class SafeRedirectResolver implements IRedirectResolver {
  private maxRedirects: number = 5;
  private timeoutMs: number = 3000;

  constructor(maxRedirects = 5, timeoutMs = 3000) {
    this.maxRedirects = maxRedirects;
    this.timeoutMs = timeoutMs;
  }

  public async resolve(urlStr: string): Promise<string> {
    let currentUrl = urlStr;
    let redirectCount = 0;

    while (redirectCount <= this.maxRedirects) {
      // 1. Re-validate URL at each hop (SSRF/Protocol safety check)
      const parsedUrl = SecureUrlValidator.validate(currentUrl);

      // 2. Try HEAD first
      let nextUrl: string | null = null;
      try {
        nextUrl = await this.fetchRedirection(currentUrl, 'HEAD');
      } catch (err) {
        // Fallback to GET on failure/unsupported HEAD
        if (err instanceof ResolverError && err.type === ResolverErrorType.PROVIDER_TIMEOUT) {
          throw err;
        }
        nextUrl = await this.fetchRedirection(currentUrl, 'GET');
      }

      if (!nextUrl) {
        // No redirect, this is the final URL
        return currentUrl;
      }

      // We have a redirect target. Update currentUrl
      currentUrl = nextUrl;
      redirectCount++;
      if (redirectCount > this.maxRedirects) {
        throw new ResolverError(
          ResolverErrorType.REDIRECT_LIMIT_EXCEEDED,
          `Redirection limit of ${this.maxRedirects} hops exceeded`
        );
      }
    }

    throw new ResolverError(
      ResolverErrorType.REDIRECT_LIMIT_EXCEEDED,
      `Redirection limit of ${this.maxRedirects} hops exceeded`
    );
  }

  private async fetchRedirection(urlStr: string, method: 'HEAD' | 'GET'): Promise<string | null> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(urlStr, {
        method,
        redirect: 'manual',
        signal: controller.signal,
        headers: {
          'User-Agent': 'AxevoraBot/1.0',
        },
      });

      clearTimeout(timeout);

      // Redirection statuses: 301, 302, 303, 307, 308
      const status = response.status;
      const isRedirect = status >= 300 && status < 400;

      if (isRedirect) {
        const location = response.headers.get('location');
        if (!location) {
          throw new ResolverError(
            ResolverErrorType.SHORT_LINK_RESOLUTION_FAILED,
            'Redirect response missing Location header'
          );
        }

        // Handle relative redirects
        let absoluteLocation = location;
        if (!location.startsWith('http://') && !location.startsWith('https://')) {
          const base = new URL(urlStr);
          absoluteLocation = new URL(location, base.origin).toString();
        }

        // Immediate validation of redirected target URL (SSRF & Protocols)
        SecureUrlValidator.validate(absoluteLocation);
        return absoluteLocation;
      }

      // Abort body consumption if it was a GET request (we only wanted headers)
      if (method === 'GET') {
        controller.abort();
      }

      return null; // Not a redirect
    } catch (err: any) {
      clearTimeout(timeout);

      if (err.name === 'AbortError') {
        throw new ResolverError(
          ResolverErrorType.PROVIDER_TIMEOUT,
          `Redirection request timed out after ${this.timeoutMs}ms`
        );
      }

      if (err instanceof ResolverError) {
        throw err;
      }

      throw new ResolverError(
        ResolverErrorType.SHORT_LINK_RESOLUTION_FAILED,
        `HTTP request failed: ${err.message || err}`
      );
    }
  }
}
