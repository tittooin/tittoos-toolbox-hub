
import { 
  FileText, Download, Upload, Image, File, Palette, 
  Lock, Key, Calculator, Hash, Clock, QrCode,
  Type, AlignLeft, Languages, Search, Zap, Code,
  BarChart, PieChart, TrendingUp, Globe, Mail,
  Phone, MapPin, CreditCard, Calendar, Timer,
  Ruler, Thermometer, DollarSign, Percent, Scale,
  Binary, FileImage, FileVideo, Music, Archive
} from "lucide-react";

export const categories = [
  { id: "converter", name: "Converters" },
  { id: "generator", name: "Generators" },
  { id: "analyzer", name: "Analyzers" },
  { id: "editor", name: "Editors" },
  { id: "calculator", name: "Calculators" },
  { id: "formatter", name: "Formatters" },
];

export const tools = [
  // Converters
  {
    id: "pdf-converter",
    name: "PDF Converter",
    description: "Convert documents to and from PDF format with ease.",
    category: "converter",
    icon: FileText,
    path: "/tools/pdf-converter"
  },
  {
    id: "image-converter",
    name: "Image Converter",
    description: "Convert between different image formats (PNG, JPG, WebP, etc.)",
    category: "converter",
    icon: Image,
    path: "/tools/image-converter"
  },
  {
    id: "video-converter",
    name: "Video Converter",
    description: "Convert video files between different formats and resolutions.",
    category: "converter",
    icon: FileVideo,
    path: "/tools/video-converter"
  },
  {
    id: "audio-converter",
    name: "Audio Converter",
    description: "Convert audio files between MP3, WAV, FLAC, and other formats.",
    category: "converter",
    icon: Music,
    path: "/tools/audio-converter"
  },
  {
    id: "unit-converter",
    name: "Unit Converter",
    description: "Convert between different units of measurement.",
    category: "converter",
    icon: Ruler,
    path: "/tools/unit-converter"
  },
  {
    id: "currency-converter",
    name: "Currency Converter",
    description: "Convert between different currencies with real-time rates.",
    category: "converter",
    icon: DollarSign,
    path: "/tools/currency-converter"
  },
  {
    id: "temperature-converter",
    name: "Temperature Converter",
    description: "Convert between Celsius, Fahrenheit, and Kelvin.",
    category: "converter",
    icon: Thermometer,
    path: "/tools/temperature-converter"
  },
  {
    id: "base64-converter",
    name: "Base64 Converter",
    description: "Encode and decode Base64 strings and files.",
    category: "converter",
    icon: Binary,
    path: "/tools/base64-converter"
  },

  // Generators
  {
    id: "password-generator",
    name: "Password Generator",
    description: "Generate strong, secure passwords with customizable options.",
    category: "generator",
    icon: Lock,
    path: "/tools/password-generator"
  },
  {
    id: "qr-generator",
    name: "QR Code Generator",
    description: "Create QR codes for text, URLs, and other data.",
    category: "generator",
    icon: QrCode,
    path: "/tools/qr-generator"
  },
  {
    id: "uuid-generator",
    name: "UUID Generator",
    description: "Generate unique identifiers (UUIDs) in various formats.",
    category: "generator",
    icon: Key,
    path: "/tools/uuid-generator"
  },
  {
    id: "lorem-generator",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text for your designs and layouts.",
    category: "generator",
    icon: Type,
    path: "/tools/lorem-generator"
  },
  {
    id: "hash-generator",
    name: "Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256, and other hash values.",
    category: "generator",
    icon: Hash,
    path: "/tools/hash-generator"
  },
  {
    id: "barcode-generator",
    name: "Barcode Generator",
    description: "Create various types of barcodes for products and inventory.",
    category: "generator",
    icon: BarChart,
    path: "/tools/barcode-generator"
  },

  // Analyzers
  {
    id: "seo-analyzer",
    name: "SEO Analyzer",
    description: "Analyze web pages for SEO optimization opportunities.",
    category: "analyzer",
    icon: TrendingUp,
    path: "/tools/seo-analyzer"
  },
  {
    id: "website-analyzer",
    name: "Website Analyzer",
    description: "Get detailed insights about website performance and structure.",
    category: "analyzer",
    icon: Globe,
    path: "/tools/website-analyzer"
  },
  {
    id: "text-analyzer",
    name: "Text Analyzer",
    description: "Analyze text for word count, readability, and statistics.",
    category: "analyzer",
    icon: AlignLeft,
    path: "/tools/text-analyzer"
  },
  {
    id: "color-analyzer",
    name: "Color Analyzer",
    description: "Analyze color palettes and extract colors from images.",
    category: "analyzer",
    icon: Palette,
    path: "/tools/color-analyzer"
  },
  {
    id: "image-analyzer",
    name: "Image Analyzer",
    description: "Get detailed information about image properties and metadata.",
    category: "analyzer",
    icon: FileImage,
    path: "/tools/image-analyzer"
  },

  // Editors
  {
    id: "text-editor",
    name: "Text Editor",
    description: "Simple and powerful online text editor with formatting options.",
    category: "editor",
    icon: Type,
    path: "/tools/text-editor"
  },
  {
    id: "json-editor",
    name: "JSON Editor",
    description: "Edit, format, and validate JSON data with syntax highlighting.",
    category: "editor",
    icon: Code,
    path: "/tools/json-editor"
  },
  {
    id: "csv-editor",
    name: "CSV Editor",
    description: "Edit CSV files with an intuitive spreadsheet-like interface.",
    category: "editor",
    icon: BarChart,
    path: "/tools/csv-editor"
  },
  {
    id: "html-editor",
    name: "HTML Editor",
    description: "Create and edit HTML with live preview and syntax highlighting.",
    category: "editor",
    icon: Code,
    path: "/tools/html-editor"
  },
  {
    id: "css-editor",
    name: "CSS Editor",
    description: "Write and test CSS with real-time preview functionality.",
    category: "editor",
    icon: Palette,
    path: "/tools/css-editor"
  },

  // Calculators
  {
    id: "basic-calculator",
    name: "Calculator",
    description: "Perform basic and advanced mathematical calculations.",
    category: "calculator",
    icon: Calculator,
    path: "/tools/calculator"
  },
  {
    id: "percentage-calculator",
    name: "Percentage Calculator",
    description: "Calculate percentages, percentage increase, and decrease.",
    category: "calculator",
    icon: Percent,
    path: "/tools/percentage-calculator"
  },
  {
    id: "bmi-calculator",
    name: "BMI Calculator",
    description: "Calculate your Body Mass Index and health status.",
    category: "calculator",
    icon: Scale,
    path: "/tools/bmi-calculator"
  },
  {
    id: "loan-calculator",
    name: "Loan Calculator",
    description: "Calculate loan payments, interest, and amortization schedules.",
    category: "calculator",
    icon: CreditCard,
    path: "/tools/loan-calculator"
  },
  {
    id: "age-calculator",
    name: "Age Calculator",
    description: "Calculate age in years, months, days, and more.",
    category: "calculator",
    icon: Calendar,
    path: "/tools/age-calculator"
  },

  // Formatters
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format, minify, and validate JSON data.",
    category: "formatter",
    icon: Code,
    path: "/tools/json-formatter"
  },
  {
    id: "xml-formatter",
    name: "XML Formatter",
    description: "Format and validate XML documents with proper indentation.",
    category: "formatter",
    icon: File,
    path: "/tools/xml-formatter"
  },
  {
    id: "sql-formatter",
    name: "SQL Formatter",
    description: "Format and beautify SQL queries for better readability.",
    category: "formatter",
    icon: BarChart,
    path: "/tools/sql-formatter"
  },
  {
    id: "html-formatter",
    name: "HTML Formatter",
    description: "Format and beautify HTML code with proper indentation.",
    category: "formatter",
    icon: Code,
    path: "/tools/html-formatter"
  },
  {
    id: "css-formatter",
    name: "CSS Formatter",
    description: "Format and optimize CSS code for better organization.",
    category: "formatter",
    icon: Palette,
    path: "/tools/css-formatter"
  },

  // Additional utilities
  {
    id: "color-picker",
    name: "Color Picker",
    description: "Pick colors from images or use the color wheel to find perfect colors.",
    category: "editor",
    icon: Palette,
    path: "/tools/color-picker"
  },
  {
    id: "timestamp-converter",
    name: "Timestamp Converter",
    description: "Convert between Unix timestamps and human-readable dates.",
    category: "converter",
    icon: Clock,
    path: "/tools/timestamp-converter"
  },
  {
    id: "url-encoder",
    name: "URL Encoder/Decoder",
    description: "Encode and decode URLs for safe transmission.",
    category: "formatter",
    icon: Globe,
    path: "/tools/url-encoder"
  },
  {
    id: "markdown-editor",
    name: "Markdown Editor",
    description: "Write and preview Markdown with live rendering.",
    category: "editor",
    icon: Type,
    path: "/tools/markdown-editor"
  }
];
