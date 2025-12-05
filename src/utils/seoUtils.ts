
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
  const el = ensureTag(selector, () => {
    const m = document.createElement('meta');
    if (nameOrProperty.name) m.setAttribute('name', nameOrProperty.name);
    if (nameOrProperty.property) m.setAttribute('property', nameOrProperty.property!);
    return m;
  });
  el.setAttribute('content', content);
};

const setCanonical = (url: string) => {
  const link = ensureTag('link[rel="canonical"]', () => {
    const l = document.createElement('link');
    l.setAttribute('rel', 'canonical');
    return l;
  });
  link.setAttribute('href', url);
};

export const injectJsonLd = (data: Record<string, any>, id = 'jsonld-primary') => {
  // remove previous script with same id to avoid duplicates
  const prev = document.getElementById(id);
  if (prev) prev.remove();
  const script = document.createElement('script');
},
'audio-converter': {
  title: 'Free Audio Converter Online – TittoosTools',
    description: 'Convert audio files between MP3, WAV, FLAC, AAC formats. High quality conversion with no watermark at TittoosTools.'
},

'color-picker': {
  title: 'Free Color Picker Tool Online – TittoosTools',
    description: 'Pick colors from images or use color wheel. Get HEX, RGB, HSL codes instantly. Free color picker tool at TittoosTools.'
},
'text-analyzer': {
  title: 'Free Text Analyzer Online – TittoosTools',
    description: 'Analyze text for word count, character count, readability score. Free text analysis tool with detailed statistics at TittoosTools.'
},
'calculator': {
  title: 'Free Online Calculator – TittoosTools',
    description: 'Advanced online calculator for basic and scientific calculations. Free calculator with memory functions at TittoosTools.'
},
'percentage-calculator': {
  title: 'Free Percentage Calculator Online – TittoosTools',
    description: 'Calculate percentages, percentage increase and decrease. Easy percentage calculator with step-by-step results at TittoosTools.'
},
'json-formatter': {
  title: 'Free JSON Formatter Online – TittoosTools',
    description: 'Format, validate and beautify JSON data. Free JSON formatter with syntax highlighting and error detection at TittoosTools.'
},
'base64-converter': {
  title: 'Free Base64 Encoder/Decoder Online – TittoosTools',
    description: 'Encode and decode Base64 strings and files. Free Base64 converter with file upload support at TittoosTools.'
},
'uuid-generator': {
  title: 'Free UUID Generator Online – TittoosTools',
    description: 'Generate UUID v1, v4 unique identifiers instantly. Free UUID generator with bulk generation at TittoosTools.'
},
'hash-generator': {
  title: 'Free Hash Generator Online – TittoosTools',
    description: 'Generate MD5, SHA1, SHA256 hash values for text and files. Free hash generator and verifier at TittoosTools.'
}
};

// Backward-compatible helper used in some tools
export const setToolSEO = (title: string, description: string) => {
  setSEO({ title, description });
};
