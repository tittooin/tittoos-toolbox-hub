import { ResolverError, ResolverErrorType } from './types';

export class SecureUrlValidator {
  private static readonly ALLOWED_PROTOCOLS = ['https:'];
  
  /**
   * Validates a URL string for basic structural and static security rules.
   * Rejects malformed URLs, embedded credentials, non-HTTPS protocols,
   * and obvious private IP address spaces.
   * 
   * Note: This does not prevent DNS rebinding. Runtime network resolution 
   * safety must be enforced at the request layer.
   * 
   * @param urlString The raw URL input
   * @returns A parsed URL object if valid
   * @throws ResolverError if validation fails
   */
  public static validate(urlString: string): URL {
    let url: URL;
    
    try {
      url = new URL(urlString);
    } catch (error) {
      throw new ResolverError(ResolverErrorType.INVALID_URL, 'Malformed URL');
    }

    if (!this.ALLOWED_PROTOCOLS.includes(url.protocol)) {
      throw new ResolverError(
        ResolverErrorType.UNSUPPORTED_PROTOCOL, 
        `Unsupported protocol: ${url.protocol}. Only HTTPS is allowed.`
      );
    }

    if (url.username || url.password) {
      throw new ResolverError(ResolverErrorType.UNSAFE_URL, 'Embedded credentials are not allowed');
    }

    if (this.isPrivateIp(url.hostname)) {
      throw new ResolverError(ResolverErrorType.UNSAFE_URL, 'Targeting internal/private network is not allowed');
    }

    return url;
  }

  private static isPrivateIp(hostname: string): boolean {
    if (hostname === 'localhost') return true;
    
    // IPv4 matching
    const ipv4Regex = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
    const ipv4Match = hostname.match(ipv4Regex);
    
    if (ipv4Match) {
      const parts = [
        parseInt(ipv4Match[1], 10),
        parseInt(ipv4Match[2], 10),
        parseInt(ipv4Match[3], 10),
        parseInt(ipv4Match[4], 10)
      ];
      
      // 0.0.0.0/8
      if (parts[0] === 0) return true;
      // 10.0.0.0/8
      if (parts[0] === 10) return true;
      // 127.0.0.0/8
      if (parts[0] === 127) return true;
      // 169.254.0.0/16
      if (parts[0] === 169 && parts[1] === 254) return true;
      // 172.16.0.0/12
      if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
      // 192.168.0.0/16
      if (parts[0] === 192 && parts[1] === 168) return true;
    }

    // Basic IPv6 check
    if (hostname === '[::1]' || hostname === '::1') return true;

    return false;
  }
}
