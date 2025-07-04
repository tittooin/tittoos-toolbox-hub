
import { 
  FileText, Download, Upload, Image, File, Palette, 
  Lock, Key, Calculator, Hash, Clock, QrCode,
  Type, AlignLeft, Languages, Search, Zap, Code,
  BarChart, PieChart, TrendingUp, Globe, Mail,
  Phone, MapPin, CreditCard, Calendar, Timer,
  Ruler, Thermometer, DollarSign, Percent, Scale,
  Binary, FileImage, FileVideo, Music, Archive,
  Bot, Video, Wand2, Sparkles, Brain, Youtube,
  Facebook, Twitter, Linkedin, Scissors, Gauge
} from "lucide-react";

export const categories = [
  { id: "converter", name: "Converters" },
  { id: "generator", name: "Generators" },
  { id: "analyzer", name: "Analyzers" },
  { id: "editor", name: "Editors" },
  { id: "calculator", name: "Calculators" },
  { id: "formatter", name: "Formatters" },
  { id: "ai", name: "AI Tools" },
  { id: "downloader", name: "Downloaders" },
];

export const tools = [
  // Converters
  {
    id: "pdf-converter",
    name: "PDF Converter",
    subheading: "Convert documents seamlessly",
    description: "Convert documents to and from PDF format with ease.",
    category: "converter",
    icon: FileText,
    path: "/tools/pdf-converter"
  },
  {
    id: "image-converter",
    name: "Image Converter",
    subheading: "Transform image formats instantly",
    description: "Convert between different image formats (PNG, JPG, WebP, etc.)",
    category: "converter",
    icon: Image,
    path: "/tools/image-converter"
  },
  {
    id: "video-converter",
    name: "Video Converter",
    subheading: "Professional video conversion",
    description: "Convert video files between different formats and resolutions.",
    category: "converter",
    icon: FileVideo,
    path: "/tools/video-converter"
  },
  {
    id: "audio-converter",
    name: "Audio Converter",
    subheading: "High-quality audio conversion",
    description: "Convert audio files between MP3, WAV, FLAC, and other formats.",
    category: "converter",
    icon: Music,
    path: "/tools/audio-converter"
  },
  {
    id: "unit-converter",
    name: "Unit Converter",
    subheading: "Universal measurement tool",
    description: "Convert between different units of measurement.",
    category: "converter",
    icon: Ruler,
    path: "/tools/unit-converter"
  },
  {
    id: "currency-converter",
    name: "Currency Converter",
    subheading: "Real-time exchange rates",
    description: "Convert between different currencies with real-time rates.",
    category: "converter",
    icon: DollarSign,
    path: "/tools/currency-converter"
  },
  {
    id: "temperature-converter",
    name: "Temperature Converter",
    subheading: "Celsius, Fahrenheit & Kelvin",
    description: "Convert between Celsius, Fahrenheit, and Kelvin.",
    category: "converter",
    icon: Thermometer,
    path: "/tools/temperature-converter"
  },
  {
    id: "base64-converter",
    name: "Base64 Converter",
    subheading: "Encode & decode with ease",
    description: "Encode and decode Base64 strings and files.",
    category: "converter",
    icon: Binary,
    path: "/tools/base64-converter"
  },
  {
    id: "timestamp-converter",
    name: "Timestamp Converter",
    subheading: "Unix to human-readable dates",
    description: "Convert between Unix timestamps and human-readable dates.",
    category: "converter",
    icon: Clock,
    path: "/tools/timestamp-converter"
  },

  // Generators
  {
    id: "password-generator",
    name: "Password Generator",
    subheading: "Create secure passwords",
    description: "Generate strong, secure passwords with customizable options.",
    category: "generator",
    icon: Lock,
    path: "/tools/password-generator"
  },
  {
    id: "qr-generator",
    name: "QR Code Generator",
    subheading: "Quick QR code creation",
    description: "Create QR codes for text, URLs, and other data.",
    category: "generator",
    icon: QrCode,
    path: "/tools/qr-generator"
  },
  {
    id: "uuid-generator",
    name: "UUID Generator",
    subheading: "Unique identifier creation",
    description: "Generate unique identifiers (UUIDs) in various formats.",
    category: "generator",
    icon: Key,
    path: "/tools/uuid-generator"
  },
  {
    id: "lorem-generator",
    name: "Lorem Ipsum Generator",
    subheading: "Placeholder text generator",
    description: "Generate placeholder text for your designs and layouts.",
    category: "generator",
    icon: Type,
    path: "/tools/lorem-generator"
  },
  {
    id: "hash-generator",
    name: "Hash Generator",
    subheading: "MD5, SHA-1, SHA-256 hashes",
    description: "Generate MD5, SHA-1, SHA-256, and other hash values.",
    category: "generator",
    icon: Hash,
    path: "/tools/hash-generator"
  },
  {
    id: "barcode-generator",
    name: "Barcode Generator",
    subheading: "Product & inventory codes",
    description: "Create various types of barcodes for products and inventory.",
    category: "generator",
    icon: BarChart,
    path: "/tools/barcode-generator"
  },

  // Analyzers
  {
    id: "seo-analyzer",
    name: "SEO Analyzer",
    subheading: "Optimize for search engines",
    description: "Analyze web pages for SEO optimization opportunities.",
    category: "analyzer",
    icon: TrendingUp,
    path: "/tools/seo-analyzer"
  },
  {
    id: "website-analyzer",
    name: "Website Analyzer",
    subheading: "Complete site performance insights",
    description: "Get detailed insights about website performance and structure.",
    category: "analyzer",
    icon: Globe,
    path: "/tools/website-analyzer"
  },
  {
    id: "website-speed-checker",
    name: "Website Speed Checker",
    subheading: "Performance testing tool",
    description: "Test website loading speed and get optimization recommendations.",
    category: "analyzer",
    icon: Gauge,
    path: "/tools/website-speed-checker"
  },
  {
    id: "text-analyzer",
    name: "Text Analyzer",
    subheading: "Word count & readability stats",
    description: "Analyze text for word count, readability, and statistics.",
    category: "analyzer",
    icon: AlignLeft,
    path: "/tools/text-analyzer"
  },
  {
    id: "color-analyzer",
    name: "Color Analyzer",
    subheading: "Extract colors from images",
    description: "Analyze color palettes and extract colors from images.",
    category: "analyzer",
    icon: Palette,
    path: "/tools/color-analyzer"
  },
  {
    id: "image-analyzer",
    name: "Image Analyzer",
    subheading: "Detailed image properties",
    description: "Get detailed information about image properties and metadata.",
    category: "analyzer",
    icon: FileImage,
    path: "/tools/image-analyzer"
  },

  // Editors
  {
    id: "text-editor",
    name: "Text Editor",
    subheading: "Rich text editing",
    description: "Simple and powerful online text editor with formatting options.",
    category: "editor",
    icon: Type,
    path: "/tools/text-editor"
  },
  {
    id: "json-editor",
    name: "JSON Editor",
    subheading: "Format & validate JSON",
    description: "Edit, format, and validate JSON data with syntax highlighting.",
    category: "editor",
    icon: Code,
    path: "/tools/json-editor"
  },
  {
    id: "csv-editor",
    name: "CSV Editor",
    subheading: "Spreadsheet-like interface",
    description: "Edit CSV files with an intuitive spreadsheet-like interface.",
    category: "editor",
    icon: BarChart,
    path: "/tools/csv-editor"
  },
  {
    id: "html-editor",
    name: "HTML Editor",
    subheading: "Live preview HTML editing",
    description: "Create and edit HTML with live preview and syntax highlighting.",
    category: "editor",
    icon: Code,
    path: "/tools/html-editor"
  },
  {
    id: "css-editor",
    name: "CSS Editor",
    subheading: "Real-time CSS testing",
    description: "Write and test CSS with real-time preview functionality.",
    category: "editor",
    icon: Palette,
    path: "/tools/css-editor"
  },
  {
    id: "color-picker",
    name: "Color Picker",
    subheading: "Perfect color selection",
    description: "Pick colors from images or use the color wheel to find perfect colors.",
    category: "editor",
    icon: Palette,
    path: "/tools/color-picker"
  },
  {
    id: "markdown-editor",
    name: "Markdown Editor",
    subheading: "Live markdown rendering",
    description: "Write and preview Markdown with live rendering.",
    category: "editor",
    icon: Type,
    path: "/tools/markdown-editor"
  },
  {
    id: "image-background-remover",
    name: "Background Remover",
    subheading: "AI-powered background removal",
    description: "Remove backgrounds from images with high accuracy using AI technology.",
    category: "editor",
    icon: Scissors,
    path: "/tools/image-background-remover"
  },

  // Calculators
  {
    id: "basic-calculator",
    name: "Calculator",
    subheading: "Basic & advanced calculations",
    description: "Perform basic and advanced mathematical calculations.",
    category: "calculator",
    icon: Calculator,
    path: "/tools/calculator"
  },
  {
    id: "percentage-calculator",
    name: "Percentage Calculator",
    subheading: "Calculate percentages easily",
    description: "Calculate percentages, percentage increase, and decrease.",
    category: "calculator",
    icon: Percent,
    path: "/tools/percentage-calculator"
  },
  {
    id: "bmi-calculator",
    name: "BMI Calculator",
    subheading: "Body Mass Index checker",
    description: "Calculate your Body Mass Index and health status.",
    category: "calculator",
    icon: Scale,
    path: "/tools/bmi-calculator"
  },
  {
    id: "loan-calculator",
    name: "Loan Calculator",
    subheading: "Payment & interest calculator",
    description: "Calculate loan payments, interest, and amortization schedules.",
    category: "calculator",
    icon: CreditCard,
    path: "/tools/loan-calculator"
  },
  {
    id: "age-calculator",
    name: "Age Calculator",
    subheading: "Precise age calculation",
    description: "Calculate age in years, months, days, and more.",
    category: "calculator",
    icon: Calendar,
    path: "/tools/age-calculator"
  },

  // Formatters
  {
    id: "json-formatter",
    name: "JSON Formatter",
    subheading: "Format & validate JSON",
    description: "Format, minify, and validate JSON data.",
    category: "formatter",
    icon: Code,
    path: "/tools/json-formatter"
  },
  {
    id: "xml-formatter",
    name: "XML Formatter",
    subheading: "Pretty XML formatting",
    description: "Format and validate XML documents with proper indentation.",
    category: "formatter",
    icon: File,
    path: "/tools/xml-formatter"
  },
  {
    id: "sql-formatter",
    name: "SQL Formatter",
    subheading: "Beautiful SQL queries",
    description: "Format and beautify SQL queries for better readability.",
    category: "formatter",
    icon: BarChart,
    path: "/tools/sql-formatter"
  },
  {
    id: "html-formatter",
    name: "HTML Formatter",
    subheading: "Clean HTML code",
    description: "Format and beautify HTML code with proper indentation.",
    category: "formatter",
    icon: Code,
    path: "/tools/html-formatter"
  },
  {
    id: "css-formatter",
    name: "CSS Formatter",
    subheading: "Organized CSS styling",
    description: "Format and optimize CSS code for better organization.",
    category: "formatter",
    icon: Palette,
    path: "/tools/css-formatter"
  },
  {
    id: "url-encoder",
    name: "URL Encoder/Decoder",
    subheading: "Safe URL transmission",
    description: "Encode and decode URLs for safe transmission.",
    category: "formatter",
    icon: Globe,
    path: "/tools/url-encoder"
  },

  // AI Tools
  {
    id: "text-to-image",
    name: "AI Text to Image",
    subheading: "Generate stunning visuals",
    description: "Generate stunning images from text descriptions using AI.",
    category: "ai",
    icon: Image,
    path: "/tools/text-to-image"
  },
  {
    id: "text-to-video",
    name: "AI Text to Video",
    subheading: "Create videos from text",
    description: "Create videos from text prompts with AI generation.",
    category: "ai",
    icon: Video,
    path: "/tools/text-to-video"
  },
  {
    id: "ai-prompt-assistant",
    name: "AI Prompt Assistant",
    subheading: "Perfect prompt crafting",
    description: "Get help crafting perfect prompts for AI tools and chatbots.",
    category: "ai",
    icon: Bot,
    path: "/tools/ai-prompt-assistant"
  },
  {
    id: "ai-website-generator",
    name: "AI Website Generator",
    subheading: "Complete website creation",
    description: "Generate complete website layouts and content using AI.",
    category: "ai",
    icon: Wand2,
    path: "/tools/ai-website-generator"
  },
  {
    id: "ai-tool-generator",
    name: "AI Tool Generator",
    subheading: "Custom AI utilities",
    description: "Create custom AI-powered tools and utilities on demand.",
    category: "ai",
    icon: Sparkles,
    path: "/tools/ai-tool-generator"
  },

  // Downloaders
  {
    id: "youtube-downloader",
    name: "YouTube Video Downloader",
    subheading: "Download in multiple formats",
    description: "Download YouTube videos in multiple formats and qualities.",
    category: "downloader",
    icon: Youtube,
    path: "/tools/youtube-downloader"
  },
  {
    id: "facebook-downloader",
    name: "Facebook Video Downloader",
    subheading: "Save Facebook videos",
    description: "Download Facebook videos and save them to your device.",
    category: "downloader",
    icon: Facebook,
    path: "/tools/facebook-downloader"
  },
  {
    id: "twitter-downloader",
    name: "X (Twitter) Video Downloader",
    subheading: "Download X videos & GIFs",
    description: "Download videos and GIFs from X (formerly Twitter).",
    category: "downloader",
    icon: Twitter,
    path: "/tools/twitter-downloader"
  },
  {
    id: "linkedin-downloader",
    name: "LinkedIn Video Downloader",
    subheading: "Save LinkedIn content",
    description: "Download LinkedIn videos for offline viewing.",
    category: "downloader",
    icon: Linkedin,
    path: "/tools/linkedin-downloader"
  }
];
