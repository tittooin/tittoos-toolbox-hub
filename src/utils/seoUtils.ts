// SEO Utilities for TittoosTools
export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
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

  if (data.url) {
    const link = ensureTag('link[rel="canonical"]', () => {
      const l = document.createElement('link');
      l.setAttribute('rel', 'canonical');
      return l;
    });
    link.setAttribute('href', data.url);
    setMeta({ property: 'og:url' }, data.url);
  }

  if (data.type) {
    setMeta({ property: 'og:type' }, data.type);
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
