const ADS_SCRIPT_SRC = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7510164795562884";

function ensurePreconnect(href: string, crossOrigin = true) {
  if (typeof document === 'undefined') return;
  const exists = Array.from(document.querySelectorAll('link[rel="preconnect"]')).some(l => l.getAttribute('href') === href);
  if (!exists) {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    if (crossOrigin) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }
}

function isScriptLoaded(): boolean {
  // Check global and script tag presence
  // @ts-ignore
  if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) return true;
  return !!document.querySelector(`script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]`);
}

export function whenAdsScriptReady(): Promise<void> {
  return new Promise((resolve) => {
    if (isScriptLoaded()) {
      resolve();
      return;
    }
    const handler = () => resolve();
    document.addEventListener('adsbygoogle:loaded', handler, { once: true });
  });
}

export async function loadAdsScript(): Promise<void> {
  if (typeof document === 'undefined') return;
  if (isScriptLoaded()) return;
  // Preconnect to ads origins to minimize handshake time
  ensurePreconnect('https://pagead2.googlesyndication.com');
  ensurePreconnect('https://googleads.g.doubleclick.net');
  const script = document.createElement('script');
  script.async = true;
  script.src = ADS_SCRIPT_SRC;
  script.crossOrigin = 'anonymous';
  script.onload = () => {
    document.dispatchEvent(new Event('adsbygoogle:loaded'));
  };
  document.head.appendChild(script);
}