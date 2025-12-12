// SEO Utilities for Axevora
export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
}

const ensureTag = (selector: string, create: () => HTMLElement) => {
  let el = document.querySelector(selector) as HTMLElement | null;
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el as HTMLElement;
};

const setMeta = (nameOrProperty: { name?: string; property?: string }, content: string) => {
  const selector = nameOrProperty.name
    ? `meta[name="${nameOrProperty.name}"]`
    : `meta[property="${nameOrProperty.property}"]`;

  // Update or create
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    if (nameOrProperty.name) el.setAttribute('name', nameOrProperty.name);
    if (nameOrProperty.property) el.setAttribute('property', nameOrProperty.property!);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

export const setSEO = (data: SEOData) => {
  if (data.title) {
    document.title = data.title;
    setMeta({ property: 'og:title' }, data.title);
    setMeta({ name: 'twitter:title' }, data.title);
  }

  if (data.description) {
    setMeta({ name: 'description' }, data.description);
    setMeta({ property: 'og:description' }, data.description);
    setMeta({ name: 'twitter:description' }, data.description);
  }

  if (data.keywords && data.keywords.length > 0) {
    setMeta({ name: 'keywords' }, data.keywords.join(', '));
  }

  if (data.image) {
    setMeta({ property: 'og:image' }, data.image);
    setMeta({ name: 'twitter:image' }, data.image);
  }

  // Canonical URL Logic
  // 1. Prefer passed URL, otherwise build from window.location
  // 2. Force https://axevora.com origin (Avoids localhost/preview URL leaks in index)
  // Canonical URL Logic: NO Trailing Slash (Vercel Clean URLs)
  const origin = "https://axevora.com";
  let path = window.location.pathname.replace(/\/$/, "");
  // Root becomes empty string here, so check
  path = (path === "") ? "/" : path;

  const cleanUrl = `${origin}${path}`;

  // If consumer passed a specific URL (like for paginated content), use it but sanitize
  let finalCanonical = data.url;
  if (!finalCanonical) {
    finalCanonical = cleanUrl;
  } else {
    // If passed URL is separate, still try to clean it if it matches our domain
    try {
      const u = new URL(finalCanonical, origin);
      if (u.hostname === "axevora.com" || u.hostname === "www.axevora.com") {
        finalCanonical = `${origin}${u.pathname.replace(/\/$/, "")}`;
      }
    } catch (e) { }
  }

  if (finalCanonical) {
    const link = ensureTag('link[rel="canonical"]', () => {
      const l = document.createElement('link');
      l.setAttribute('rel', 'canonical');
      return l;
    });
    link.setAttribute('href', finalCanonical);
    setMeta({ property: 'og:url' }, finalCanonical);
  }

  if (data.type) {
    setMeta({ property: 'og:type' }, data.type);
  }

  if (data.noindex) {
    setMeta({ name: 'robots' }, 'noindex');
  } else {
    // Ensure robots is index, follow if not explicitly noindex (or remove noindex if present)
    const el = document.querySelector('meta[name="robots"]');
    if (el) el.setAttribute('content', 'index, follow');
  }
};

export const injectJsonLd = (data: Record<string, any>, id = 'jsonld-primary') => {
  const prev = document.getElementById(id);
  if (prev) prev.remove();

  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
};

// Backward compatibility if needed
export const setToolSEO = (title: string, description: string) => {
  setSEO({ title, description });
};

export const toolSEOData = {
  'video-converter': {
    title: 'Free Video Converter Online – Axevora',
    description: 'Convert videos between MP4, AVI, MOV, WebM formats. Support for HD, 4K quality. No signup required – just upload and convert at Axevora.'
  },
  'audio-converter': {
    title: 'Free Audio Converter Online – Axevora',
    description: 'Convert audio files between MP3, WAV, FLAC, AAC formats. High quality conversion with no watermark at Axevora.'
  },

  'color-picker': {
    title: 'Free Color Picker Tool Online – Axevora',
    description: 'Pick colors from images or use color wheel. Get HEX, RGB, HSL codes instantly. Free color picker tool at Axevora.'
  },
  'text-analyzer': {
    title: 'Free Text Analyzer Online – Axevora',
    description: 'Analyze text for word count, character count, readability score. Free text analysis tool with detailed statistics at Axevora.'
  },
  'calculator': {
    title: 'Free Online Calculator – Axevora',
    description: 'Advanced online calculator for basic and scientific calculations. Free calculator with memory functions at Axevora.'
  },
  'percentage-calculator': {
    title: 'Free Percentage Calculator Online – Axevora',
    description: 'Calculate percentages, percentage increase and decrease. Easy percentage calculator with step-by-step results at Axevora.'
  },
  'json-formatter': {
    title: 'Free JSON Formatter Online – Axevora',
    description: 'Format, validate and beautify JSON data. Free JSON formatter with syntax highlighting and error detection at Axevora.'
  },
  'base64-converter': {
    title: 'Free Base64 Encoder/Decoder Online – Axevora',
    description: 'Encode and decode Base64 strings and files. Free Base64 converter with file upload support at Axevora.'
  },
  'uuid-generator': {
    title: 'Free UUID Generator Online – Axevora',
    description: 'Generate UUID v1, v4 unique identifiers instantly. Free UUID generator with bulk generation at Axevora.'
  },
  'hash-generator': {
    title: 'Free Hash Generator Online – Axevora',
    description: 'Generate MD5, SHA1, SHA256 hash values for text and files. Free hash generator and verifier at Axevora.'
  }
};
