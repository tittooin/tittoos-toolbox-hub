
export const setToolSEO = (title: string, description: string) => {
  document.title = title;
  
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description);
  }
};

export const toolSEOData = {
  'video-converter': {
    title: 'Free Video Converter Online – TittoosTools',
    description: 'Convert videos between MP4, AVI, MOV, WebM formats. Support for HD, 4K quality. No signup required – just upload and convert at TittoosTools.'
  },
  'audio-converter': {
    title: 'Free Audio Converter Online – TittoosTools',
    description: 'Convert audio files between MP3, WAV, FLAC, AAC formats. High quality conversion with no watermark at TittoosTools.'
  },
  'facebook-downloader': {
    title: 'Free Facebook Video Downloader – TittoosTools',
    description: 'Download Facebook videos in HD quality. Fast, free, and secure Facebook video downloader with no signup required at TittoosTools.'
  },
  'twitter-downloader': {
    title: 'Free X (Twitter) Video Downloader – TittoosTools',
    description: 'Download X (Twitter) videos and GIFs instantly. Free Twitter video downloader with HD quality support at TittoosTools.'
  },
  'linkedin-downloader': {
    title: 'Free LinkedIn Video Downloader – TittoosTools',
    description: 'Download LinkedIn videos for offline viewing. Free LinkedIn video downloader with multiple quality options at TittoosTools.'
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
