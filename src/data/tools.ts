import {
  FileText, Download, Upload, Image, File, Palette,
  Lock, Key, Calculator, Hash, Clock, QrCode,
  Type, AlignLeft, Languages, Search, Zap, Code,
  BarChart, PieChart, TrendingUp, Globe, Mail,
  Phone, MapPin, CreditCard, Calendar, Timer,
  Ruler, Thermometer, DollarSign, Percent, Scale,
  Binary, FileImage, FileVideo, Music, Archive,
  Bot, Video, Wand2, Sparkles, Brain, Youtube,
  Facebook, Twitter, Linkedin, Scissors, Gauge, Edit,
  Eye, UserCircle, RotateCw, Trash2, Stamp, Move, FileSpreadsheet, Presentation, Keyboard, Gamepad2, MousePointer2, MessageSquare, BookOpen, GraduationCap, FileQuestion, Book
} from "lucide-react";

const allCategories = [
  { id: "converter", name: "Converters", guidePath: "/blog-posts/converters-category" },
  { id: "pdf", name: "PDF Tools", guidePath: "/blog-posts/pdf-category" },
  { id: "generator", name: "Generators", guidePath: "/blog-posts/generators-category" },
  { id: "analyzer", name: "Analyzers", guidePath: "/blog-posts/analyzers-category" },
  { id: "editor", name: "Editors", guidePath: "/blog-posts/editors-category" },
  { id: "calculator", name: "Calculators", guidePath: "/blog-posts/calculators-category" },
  { id: "formatter", name: "Formatters", guidePath: "/blog-posts/formatters-category" },
  { id: "ai", name: "AI Tools", guidePath: "/blog-posts/ai-tools-category" },
  { id: "games", name: "Games & Brain", guidePath: "/blog-posts/games-category" },
  { id: "utility", name: "Utilities", guidePath: "/blog-posts/analyzers-category" }, // Fallback to analyzers or create utility if needed
];

const allTools = [
  // Converters - Updated
  {
    id: "pdf-converter",
    name: "PDF Converter",
    subheading: "Convert documents seamlessly",
    description: "Convert documents to and from PDF format with ease.",
    category: "pdf",
    icon: FileText,
    path: "/tools/pdf-converter"
  },
  {
    id: "merge-pdf",
    name: "Merge PDF",
    subheading: "Combine multiple PDFs",
    description: "Merge multiple PDF documents into a single file easily online.",
    category: "pdf",
    icon: FileText,
    path: "/merge-pdf-online"
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    subheading: "Extract pages from PDF",
    description: "Split PDF files or extract specific pages into new documents.",
    category: "pdf",
    icon: FileText,
    path: "/split-pdf-online"
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    subheading: "Reduce PDF file size",
    description: "Compress and optimize PDF files to reduce file size online.",
    category: "pdf",
    icon: FileText,
    path: "/compress-pdf-online"
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    subheading: "Convert PDF to DOCX",
    description: "Convert PDF files to editable Word documents.",
    category: "pdf",
    icon: FileText,
    path: "/tools/pdf-to-word"
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    subheading: "Convert DOCX to PDF",
    description: "Convert Word documents to PDF format.",
    category: "pdf",
    icon: FileText,
    path: "/tools/word-to-pdf"
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    subheading: "Convert PDF pages to Images",
    description: "Convert each page of a PDF into a high-quality JPG image.",
    category: "pdf",
    icon: Image,
    path: "/tools/pdf-to-jpg"
  },
  {
    id: "pdf-to-png",
    name: "PDF to PNG",
    subheading: "Convert PDF pages to PNG",
    description: "Convert each page of a PDF into a high-quality PNG image.",
    category: "pdf",
    icon: Image,
    path: "/tools/pdf-to-png"
  },
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    subheading: "Convert Images to PDF",
    description: "Combine multiple JPG images into a single PDF document.",
    category: "pdf",
    icon: Image,
    path: "/tools/jpg-to-pdf"
  },
  {
    id: "pdf-to-excel",
    name: "PDF to Excel",
    subheading: "Convert PDF to XLSX",
    description: "Extract tables from PDF files into Excel spreadsheets.",
    category: "pdf",
    icon: FileSpreadsheet,
    path: "/tools/pdf-to-excel",
    longDescription: "<p>Stop retyping data manually! Our <strong>PDF to Excel Converter</strong> uses advanced OCR and table recognition technology to accurately extract rows and columns from your PDF documents into editable Microsoft Excel spreadsheets (.xlsx). It preserves your original formatting, formulas, and layout, saving you hours of tedious data entry work.</p><p>Whether you are dealing with bank statements, invoices, or financial reports, this tool ensures that your data is ready for analysis immediately.</p>",
    howToUse: [
      "Upload your PDF file by dragging it into the box or clicking 'Choose File'.",
      "Wait for the conversion engine to analyze the document structure.",
      "Click 'Download Excel' to save your new .xlsx file.",
      "Open it in Microsoft Excel, Google Sheets, or LibreOffice to start editing."
    ],
    benefits: [
      "Retains original table formatting and cell structure.",
      "Works on scanned PDFs using OCR technology.",
      "No software installation required - works in your browser.",
      "Secure processing: files are deleted from our servers automatically."
    ],
    faqs: [
      {
        question: "Will it convert scanned tables?",
        answer: "Yes, our tool includes Optical Character Recognition (OCR) which can identify text and numbers even in scanned image-based PDFs."
      },
      {
        question: "Is my financial data safe?",
        answer: "Absolutely. We process files securely and do not store them. Your data remains private and is deleted locally or after processing."
      },
      {
        question: "Can I convert multiple pages?",
        answer: "Yes, the converter supports multi-page PDFs and will organize them into your Excel spreadsheet accordingly."
      }
    ]
  },
  {
    id: "excel-to-pdf",
    name: "Excel to PDF",
    subheading: "Convert XLSX to PDF",
    description: "Convert Excel spreadsheets to PDF format.",
    category: "pdf",
    icon: FileSpreadsheet,
    path: "/tools/excel-to-pdf",
    longDescription: "<p>Ensure your spreadsheets look professional on any device. Converting <strong>Excel to PDF</strong> locks your formatting, fonts, and layout, so your charts and tables render exactly as intended, whether viewed on a phone, tablet, or desktop.</p><p>This tool is essential for sending invoices, quotes, or reports where you don't want the recipient to accidentally modify the numbers or break the layout.</p>",
    howToUse: [
      "Select your Excel file (.xlsx or .xls) from your device.",
      "The tool will automatically convert each sheet into PDF pages.",
      "Preview the result to ensure page breaks are correct.",
      "Download your professional-looking PDF document."
    ],
    benefits: [
      "Prevents unwanted editing of your data.",
      "Ensures consistent printing and viewing across all devices.",
      "Supports standard .xlsx and older .xls formats.",
      "Clean, professional output with no watermarks."
    ],
    faqs: [
      {
        question: "Will my formulas be visible?",
        answer: "No, converting to PDF shows only the calculated values, not the underlying formulas. This is great for sharing final reports."
      },
      {
        question: "How does it handle wide spreadsheets?",
        answer: "The tool attempts to fit content to the page width. For very wide sheets, we recommend adjusting print settings in Excel before converting for best results."
      }
    ]
  },
  {
    id: "pdf-to-ppt",
    name: "PDF to PPT",
    subheading: "Convert PDF to PowerPoint",
    description: "Convert PDF pages into PowerPoint slides.",
    category: "pdf",
    icon: Presentation,
    path: "/tools/pdf-to-ppt"
  },
  {
    id: "ppt-to-pdf",
    name: "PPT to PDF",
    subheading: "Convert PowerPoint to PDF",
    description: "Convert PowerPoint presentations to PDF format.",
    category: "pdf",
    icon: Presentation,
    path: "/tools/ppt-to-pdf"
  },
  {
    id: "lock-pdf",
    name: "Lock PDF",
    subheading: "Protect PDF with Password",
    description: "Encrypt PDF files with a password for security.",
    category: "pdf",
    icon: Lock,
    path: "/tools/lock-pdf"
  },
  {
    id: "unlock-pdf",
    name: "Unlock PDF",
    subheading: "Remove PDF Password",
    description: "Remove password protection from PDF files.",
    category: "pdf",
    icon: Lock,
    path: "/tools/unlock-pdf"
  },
  {
    id: "rotate-pdf",
    name: "Rotate PDF",
    subheading: "Rotate PDF Pages",
    description: "Rotate PDF pages 90, 180, or 270 degrees.",
    category: "pdf",
    icon: RotateCw,
    path: "/tools/rotate-pdf"
  },
  {
    id: "delete-pdf-pages",
    name: "Delete PDF Pages",
    subheading: "Remove Pages from PDF",
    description: "Remove specific pages from a PDF document.",
    category: "pdf",
    icon: Trash2,
    path: "/tools/delete-pdf-pages"
  },
  {
    id: "extract-pdf-pages",
    name: "Extract PDF Pages",
    subheading: "Extract Pages from PDF",
    description: "Create a new PDF containing only selected pages.",
    category: "pdf",
    icon: Scissors,
    path: "/tools/extract-pdf-pages"
  },
  {
    id: "watermark-pdf",
    name: "Watermark PDF",
    subheading: "Add Watermark to PDF",
    description: "Add custom text watermarks to PDF pages.",
    category: "pdf",
    icon: Stamp,
    path: "/tools/watermark-pdf"
  },
  {
    id: "rearrange-pdf",
    name: "Rearrange PDF",
    subheading: "Reorder PDF Pages",
    description: "Reorder pages within a PDF document.",
    category: "pdf",
    icon: Move,
    path: "/tools/rearrange-pdf"
  },
  {
    id: "pdf-text-extractor",
    name: "PDF Text Extractor",
    subheading: "Extract Text from PDF",
    description: "Extract raw text from PDF files.",
    category: "pdf",
    icon: AlignLeft,
    path: "/tools/pdf-text-extractor"
  },
  {
    id: "pdf-editor",
    name: "PDF Editor",
    subheading: "Edit PDF Online",
    description: "Add text, shapes, and annotations to PDFs.",
    category: "pdf",
    icon: Edit,
    path: "/tools/pdf-editor"
  },
  {
    id: "image-converter",
    name: "Image Converter",
    subheading: "Transform image formats instantly",
    description: "Convert between different image formats (PNG, JPG, WebP, etc.)",
    category: "converter",
    icon: Image,
    path: "/tools/image-converter",
    longDescription: "<p>Format incompatibility is the enemy of creativity. Our <strong>Universal Image Converter</strong> lets you switch effortlessly between JPG, PNG, WebP, GIF, and BMP. Whether you need a transparent PNG for a logo, a compressed JPG for a website, or a next-gen WebP for SEO performance, this tool handles it all.</p><p>We prioritize image quality, ensuring that your conversions remain sharp and vibrant, without the artifacting seen in lesser tools.</p>",
    howToUse: [
      "Drag and drop your image files (supports batch processing).",
      "Select your desired output format (e.g., 'Convert to PNG').",
      "Adjust quality settings if needed (for JPG/WebP).",
      "Download your converted images individually or as a ZIP."
    ],
    benefits: [
      "Supports all major formats: JPG, PNG, WEBP, BMP, TIFF, ICO.",
      "Batch conversion saves you time.",
      "Privacy-first: Images are processed securely and not used for AI training.",
      "Preserves transparency when converting to PNG or WebP."
    ],
    faqs: [
      {
        question: "Which format is best for websites?",
        answer: "WebP is generally best for modern websites as it offers smaller file sizes with high quality. JPG is good for photos, and PNG for graphics with text."
      },
      {
        question: "Will I lose quality?",
        answer: "Converting to lossless formats (like PNG) retains 100% quality. Converting to lossy formats (like JPG) may slightly reduce quality to save space, but our default settings balance this perfectly."
      }
    ]
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
    path: "/tools/unit-converter",
    longDescription: "<p>Confusion over kilometers vs. miles or Celsius vs. Fahrenheit stops here. Our <strong>Universal Unit Converter</strong> is designed for students, engineers, and travelers who need precise conversions instantly. It covers Length, Weight, Temperature, Area, Volume, and more.</p><p>We use high-precision floating-point math to ensure that scientific and engineering calculations retain their accuracy.</p>",
    howToUse: [
      "Select the category (e.g., Length, Weight).",
      "Enter the value you want to convert.",
      "Choose the 'From' unit and the 'To' unit.",
      "The result appears instantly as you type."
    ],
    benefits: [
      "20+ categories of measurement units.",
      "Instant, real-time calculation.",
      "Mobile-friendly for use in the kitchen or field.",
      "Copy results with a single click."
    ],
    faqs: [
      {
        question: "How accurate are the conversions?",
        answer: "We use standard international conversion factors (e.g., 1 inch = 2.54 cm exactly) to ensure maximum precision."
      },
      {
        question: "Can I convert cooking units?",
        answer: "Yes! We support volume measurements like cups, tablespoons, and liters, making it perfect for international recipes."
      }
    ]
  },
  {
    id: "currency-converter",
    name: "Currency Converter",
    subheading: "Real-time exchange rates",
    description: "Convert between different currencies with real-time rates.",
    category: "converter",
    icon: DollarSign,
    path: "/tools/currency-converter",
    longDescription: "<p>Navigate the global economy with confidence. Our <strong>Currency Converter</strong> pulls the latest mid-market exchange rates to give you an accurate picture of what your money is worth abroad. Whether you are a forex trader, an international shopper, or planning a holiday, this tool is indispensable.</p><p><strong>Note:</strong> Rates are updated daily. While excellent for estimation and travel planning, always check with your specific bank for their exact transaction rates.</p>",
    howToUse: [
      "Enter the amount of money.",
      "Select the source currency (e.g., USD - US Dollar).",
      "Select the target currency (e.g., EUR - Euro).",
      "See the converted amount instantly based on today's rate."
    ],
    benefits: [
      "Supports 150+ world currencies.",
      "Clean, distraction-free interface.",
      "Fast loading even on slow mobile connections.",
      "Includes major crypto-currencies like Bitcoin (BTC) and Ethereum (ETH)."
    ],
    faqs: [
      {
        question: "How often are rates updated?",
        answer: "Exchange rates are refreshed every 24 hours from reliable financial data providers."
      },
      {
        question: "Is this free to use?",
        answer: "Yes, 100% free. We do not charge any fees for checking rates."
      }
    ]
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
    path: "/tools/password-generator",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>The First Line of Cyber Defense: Strong Passwords</h2>
        <p>In today's digital age, your password is the key to your digital life. From banking to social media, a weak password is an open invitation to hackers. Our <strong>Secure Password Generator</strong> creates complex, high-entropy passwords that are mathematically resistant to brute-force attacks and dictionary hacks.</p>

        <h3>Why "Password123" is Dangerous</h3>
        <p>Hackers use automated tools that can guess simple passwords in seconds. They rely on:</p>
        <ul>
          <li><strong>Dictionary Attacks:</strong> Trying every word in the dictionary.</li>
          <li><strong>Credential Stuffing:</strong> Using passwords leaked from other breaches.</li>
          <li><strong>Pattern Recognition:</strong> Guessing common patterns like "Name+Year" (e.g., "John2024").</li>
        </ul>

        <h3>What Makes a Password Strong?</h3>
        <p>Security experts at NIST and Microsoft recommend the following:</p>
        <ol>
          <li><strong>Length is King:</strong> A 12-character password is exponentially harder to crack than an 8-character one. Aim for 16+ for critical accounts.</li>
          <li><strong>Complexity:</strong> Mix uppercase, lowercase, numbers, and special symbols (!@#$) to expand the character set.</li>
          <li><strong>Uniqueness:</strong> Never reuse passwords. If one site is breached, all your accounts are at risk.</li>
          <li><strong>Randomness:</strong> Humans are bad at being random. We pick patterns. Machines generate true chaos, which is what you want in a password.</li>
        </ol>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg my-6 border-l-4 border-green-500">
          <h4>🛡️ Security Guarantee</h4>
          <p><strong>This tool runs 100% in your browser.</strong> Your generated passwords are never sent to our servers, never stored in logs, and never shared with anyone. Once you close this tab, they are gone forever.</p>
        </div>

        <h3>Best Practices for Password Management</h3>
        <p>Generating a strong password is step one. Step two is managing them. We strongly recommend using a <strong>Password Manager</strong> (like Bitwarden, 1Password, or LastPass) to store these complex passwords securely. This way, you only need to remember one "Master Password".</p>
      </article>
    `,
    howToUse: [
      "Adjust the slider to choose a length (Minimum 12 recommended).",
      "Toggle character types: Uppercase, Lowercase, Numbers, Symbols.",
      "Click 'Generate' to create a new unique password.",
      "Use the Copy button to copy it securely to your clipboard."
    ],
    benefits: [
      "Client-Side Generation: Zero network risk.",
      "Customizable Entropy: tailored to specific site requirements.",
      "Instant & Free: No signup or limits.",
      "Prevents Identity Theft: Stops the most common cyber attack vector."
    ],
    faqs: [
      {
        question: "Can I copy the password safely?",
        answer: "Yes, our copy button uses the secure Clipboard API to transfer the text directly to your system clipboard."
      },
      {
        question: "Why should I include symbols?",
        answer: "Adding symbols increases the number of possible combinations (entropy), making it billions of times harder for a computer to guess your password."
      },
      {
        question: "Is this tool better than my brain?",
        answer: "Yes. Humans predictable patterns. Our algorithm uses a cryptographically secure pseudo-random number generator (CSPRNG) for true unpredictability."
      }
    ]
  },
  {
    id: "qr-generator",
    name: "QR Code Generator",
    subheading: "Quick QR code creation",
    description: "Create QR codes for text, URLs, and other data.",
    category: "generator",
    icon: QrCode,
    path: "/tools/qr-generator",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>The Power of QR Codes: Bridging Physical & Digital</h2>
        <p><strong>Quick Response (QR) codes</strong> have revolutionized how we interact with the world. Originally invented in 1994 for tracking automotive parts, they are now ubiquitous in marketing, payments, and information sharing. Our <strong>Free QR Code Generator</strong> allows you to create high-quality, scannable codes instantly.</p>

        <h3>Common Use Cases</h3>
        <ul>
          <li><strong>Restaurant Menus:</strong> Replace physical menus with a hygienic, digital scan.</li>
          <li><strong>WiFi Access:</strong> Let guests join your network without typing long, complicated passwords.</li>
          <li><strong>Marketing Materials:</strong> unexpected link on a flyer, business card, or billboard to your website.</li>
          <li><strong>vCards:</strong> Share your contact details instantly with a single scan.</li>
          <li><strong>Bitcoin/Crypto Addresses:</strong> Share wallet addresses without the risk of typos.</li>
        </ul>

        <h3>Static vs. Dynamic QR Codes</h3>
        <p>This tool generates <strong>Static QR Codes</strong>. This means the data (like your URL) is embedded directly into the pattern of the code itself. </p>
        <ul>
          <li><strong>Pros:</strong> They work forever. They don't expire. They are faster to scan. No third-party tracking.</li>
          <li><strong>Cons:</strong> You cannot change the destination URL after printing. If you change your website link, you need a new QR code.</li>
        </ul>

        <h3>Tips for Printing QR Codes</h3>
        <ol>
          <li><strong>Contrast is Key:</strong> Always use a dark foreground on a light background (like Black on White). Inverted codes (White on Black) are harder for some cameras to scan.</li>
          <li><strong>Size Matters:</strong> Ensure the code is at least 2cm x 2cm (0.8in x 0.8in) for reliable scanning on paper.</li>
          <li><strong>Zone of Silence:</strong> Leave a small white margin around the code. This helps the scanner identify the edges.</li>
        </ol>
      </article>
    `,
    howToUse: [
      "Select the Data Type: URL, Plain Text, Email, WiFi, etc.",
      "Input your content properly (e.g., ensure 'https://' is included for websites).",
      "Customize the look: Change the color to match your brand (keep contrast high!).",
      "Download: Save as PNG for web use or SVG for high-quality printing."
    ],
    benefits: [
      "Vector Quality: Download SVGs that stay sharp at any print size.",
      "No Expiration: Your codes work forever.",
      "Privacy First: We don't track who scans your code or when.",
      "Universal Compatibility: Works with all iPhone and Android cameras."
    ],
    faqs: [
      {
        question: "Why isn't my QR code working?",
        answer: "Check the contrast. If the color is too light (like yellow on white), cameras can't see it. Also, ensure the data entered is valid."
      },
      {
        question: "Is there a scan limit?",
        answer: "No! Since these are static codes, you can scan them a million times and they will always work."
      },
      {
        question: "Can I use these for commercial purposes?",
        answer: "Yes, absolutely. You can use the QR codes generated here for your business, products, or marketing campaigns for free."
      }
    ]
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
    path: "/tools/seo-analyzer",
    longDescription: "<p>Get a comprehensive analysis of your website's SEO performance. Our free SEO Analyzer scans your pages for technical errors, keyword optimization, mobile responsiveness, and more. It provides a detailed report with actionable insights to help you rank higher on search engines like Google and Bing.</p><p>Whether you're a beginner launching your first blog/site or a seasoned expert performing a quick audit, this tool gives you the data you need to succeed without the expensive subscription fees.</p>",
    howToUse: [
      "Enter the full URL of the website you want to analyze (e.g., https://example.com).",
      "Click the 'Analyze' button to start the scanning process.",
      "Wait a few seconds while our bot crawls your page metadata.",
      "Review the Score and the detailed breakdown of errors and warnings.",
      "Follow the actionable recommendations to fix issues."
    ],
    benefits: [
      "Identify critical technical SEO errors instantly.",
      "Check for missing meta tags, headers, and alt text.",
      "Analyze keyword presence and content structure.",
      "Completely free with no daily limits or signup required."
    ],
    faqs: [
      {
        question: "Is this SEO tool really free?",
        answer: "Yes, Axevora's SEO Analyzer is 100% free to use for unlimited analyses. We believe basic SEO data should be accessible to everyone."
      },
      {
        question: "How often should I check my SEO?",
        answer: "We recommend running an audit whenever you publish new content, make design changes, or at least once a month to catch any new issues."
      },
      {
        question: "Does this checking affect my rankings?",
        answer: "No. Checking your site with our tool is just like a normal visitor visiting your page. It does not negatively impact your rankings."
      }
    ]
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
    path: "/tools/website-speed-checker",
    longDescription: "<p>Speed is a critical factor for both user experience and SEO rankings. Slow websites frustrate users, increase bounce rates, and are penalized by Google's Core Web Vitals algorithms. Our Website Speed Checker simulates a real user visit to measure exactly how fast your site loads.</p><p>It provides clear metrics like Time to First Byte (TTFB), total load time, and resource size, giving you a clear picture of your website's health.</p>",
    howToUse: [
      "Enter the URL of the page you want to test.",
      "Click 'Check Speed' to initiate the test.",
      "The tool will ping your server and measure response times.",
      "View the results dashboard to see your Load Time and Performance Score."
    ],
    benefits: [
      "Accurate loading time measurements from an external server.",
      "Helps identify slow hosting or unoptimized assets.",
      "Simple, fast, and jargon-free interface.",
      "Helps you benchmark your site against competitors."
    ],
    faqs: [
      {
        question: "Why is my website slow?",
        answer: "Common reasons include large unoptimized images, slow server hosting, too many plugins, or render-blocking JavaScript."
      },
      {
        question: "What is a good load time?",
        answer: "Generally, a load time under 2-3 seconds is considered good. Under 1 second is excellent. Anything over 4 seconds risks losing significant traffic."
      },
      {
        question: "Does this tool check mobile speed?",
        answer: "Our standard test checks desktop performance consistency. However, a fast response time here usually indicates good server health for mobile devices as well."
      }
    ]
  },
  {
    id: "text-analyzer",
    name: "Text Analyzer",
    subheading: "Word count & readability stats",
    description: "Analyze text for word count, readability, and statistics.",
    category: "analyzer",
    icon: AlignLeft,
    path: "/tools/text-analyzer",
    longDescription: "<p>Writing is an art, but it's also a science. Our <strong>Text Analyzer</strong> goes beyond simple word counting. It evaluates the readability, complexity, and structure of your writing. It's perfect for SEO specialists checking keyword density, students enhancing their essays, or copywriters aiming for punchy, effective text.</p><p>Get instant stats on characters, words, sentences, paragraphs, and estimated reading time.</p>",
    howToUse: [
      "Paste your text into the input box.",
      "The tool analyzes while you type.",
      "View statistics in the dashboard below.",
      "Use the 'Keyword Density' tab to see repeated words."
    ],
    benefits: [
      "Real-time analysis (no page reload needed).",
      "Privacy-focused: Your text is analyzed in your browser, not sent to a server.",
      "Checks for reading time and speaking time.",
      "Helps improve SEO by identifying keyword usage."
    ],
    faqs: [
      {
        question: "Is there a word limit?",
        answer: "Practically, no. You can paste nearly any length of text your browser memory can handle (entire books even!)."
      },
      {
        question: "Does it check grammar?",
        answer: "This tool focuses on statistical analysis (counts, density, readability metrics) rather than grammatical correctness."
      }
    ]
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
    path: "/tools/json-editor",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>The Ultimate JSON Editor & Validator</h2>
        <p><strong>JSON (JavaScript Object Notation)</strong> has become the de-facto standard for data exchange on the web. However, working with raw JSON can be messy. A single missing comma or unclosed bracket can break your entire application. Our <strong>Online JSON Editor</strong> is a powerful tool designed to help developers, data analysts, and learners visualize, edit, and clean JSON data effortlessly.</p>

        <h3>Common JSON Errors We Fix</h3>
        <ul>
          <li><strong>Trailing Commas:</strong> JSON standards are strict. A comma after the last item is a syntax error.</li>
          <li><strong>Quote Mismatch:</strong> Keys and string values must be wrapped in double quotes ("), not single quotes (').</li>
          <li><strong>Nested Structure Hell:</strong> Deeply nested objects are hard to read. Our tree view makes navigation easy.</li>
        </ul>

        <h3>Why Use an Online Editor?</h3>
        <p>While IDEs like VS Code are great, sometimes you need a quick, no-setup way to format a JSON response from an API or debug a config file. Our tool runs strictly in your browser, offering a fast sandbox environment without the overhead of installing plugins.</p>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg my-6 border-l-4 border-yellow-500">
          <h4>⚠️ Privacy Note for Developers</h4>
          <p>We understand that JSON data often contains sensitive API keys or user info. <strong>This tool processes everything client-side.</strong> Your code is never sent to our backend server.</p>
        </div>
      </article>
    `,
    howToUse: [
      "Paste your raw JSON string into the left editor panel.",
      "If the JSON is valid, the tree/code view on the right will update instantly.",
      "Click 'Format' to beautify messy one-line functionality.",
      "Click 'Validate' to check for syntax errors (lines will be highlighted)."
    ],
    benefits: [
      "Real-time Syntax Validation: Catch bugs before they hit production.",
      "Tree View Visualization: Collapse and expand nodes to analyze structure.",
      "Auto-Formatting: Turn minified garbage into readable code.",
      "Import/Export: Load files directly from your computer."
    ],
    faqs: [
      {
        question: "Does it support comments?",
        answer: "Standard JSON does not support comments. However, our editor acts as a linter and will flag them as errors unless you are using a superset like JSON5."
      },
      {
        question: "Is there a file size limit?",
        answer: "The limit depends on your browser's memory, but generally, files up to 10MB are handled smoothly. Larger files might cause UI lag."
      }
    ]
  },
  {
    id: "csv-editor",
    name: "CSV Editor",
    subheading: "Spreadsheet-like interface",
    description: "Edit CSV files with an intuitive spreadsheet-like interface.",
    category: "editor",
    icon: BarChart,
    path: "/tools/csv-editor",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Edit CSV Files Without Excel</h2>
        <p><strong>Comma-Separated Values (CSV)</strong> files are the universal language of simple databases. You don't need heavy software like Microsoft Excel or Google Sheets just to make a quick edit or view a file. Our <strong>Online CSV Editor</strong> provides a lightweight, spreadsheet-like interface directly in your browser.</p>

        <h3>When to Use This Tool?</h3>
        <ul>
          <li><strong>Quick Edits:</strong> Fix a typo in a contact list or product catalog.</li>
          <li><strong>Data Cleaning:</strong> Remove empty rows or duplicate entries before importing into a database.</li>
          <li><strong>Conversion:</strong> Check how your data looks before converting it to JSON or SQL.</li>
        </ul>

        <h3>CSV vs. Excel</h3>
        <p>CSV files store plain text data separated by commas (or semicolons). They do not support formatting like bold text, colors, or formulas. This simplicity makes them perfect for data exchange between different software systems.</p>
      </article>
    `,
    howToUse: [
      "Upload your .csv file or paste raw CSV data.",
      "The tool renders it into an interactive grid.",
      "Double-click any cell to edit its content.",
      "Add or delete rows using the toolbar buttons.",
      "Click 'Download' to save your modified CSV file."
    ],
    benefits: [
      "Spreadsheet interface familiar to Excel users.",
      "No login or installation required.",
      "Handles large datasets efficiently.",
      "Supports custom delimiters (comma, semicolon, tab)."
    ],
    faqs: [
      {
        question: "Can I use formulas like =SUM()?",
        answer: "No. CSV is a plain text format and does not support formulas. This editor is for data values only."
      },
      {
        question: "My data is all in one column, why?",
        answer: "This usually happens if the delimiter is wrong (e.g., your file uses semicolons ';' but the tool expects commas ','). Try changing the delimiter setting."
      }
    ]
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
  {
    id: "ai-image-editor",
    name: "AI Image Editor",
    subheading: "Professional image editing",
    description: "Professional image editor with layers, filters, drawing tools, and AI-powered features.",
    category: "editor",
    icon: Edit,
    path: "/tools/ai-image-editor"
  },
  {
    id: "video-editor",
    name: "Video Editor",
    subheading: "Professional video editing",
    description: "Professional video editor with timeline, effects, transitions, and multiple export formats.",
    category: "editor",
    icon: Video,
    path: "/tools/video-editor"
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
    path: "/tools/bmi-calculator",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Understanding Your Body Mass Index (BMI)</h2>
        <p>Your <strong>Body Mass Index (BMI)</strong> is a fundamental screening tool used by health professionals worldwide to assess whether an individual has a healthy body weight for a person of their height. While not a direct measure of body fat, it is strongly correlated with various metabolic and disease outcomes.</p>
        
        <h3>Why BMI Matters?</h3>
        <p>Maintaining a healthy BMI is crucial for long-term health. Research consistently shows that individuals falling outside the "Normal" range are at higher risk for:</p>
        <ul>
          <li><strong>Cardiovascular Diseases:</strong> High blood pressure and cholesterol levels.</li>
          <li><strong>Type 2 Diabetes:</strong> Excess weight is a primary risk factor.</li>
          <li><strong>Joint Issues:</strong> Osteoarthritis and joint pain due to excess load.</li>
          <li><strong>Respiratory Problems:</strong> Sleep apnea and asthma.</li>
        </ul>

        <h3>BMI Categories (WHO Standards)</h3>
        <div className="overflow-x-auto my-6">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Classification</th>
                <th className="py-2 px-4 border-b text-left">BMI Range (kg/m²)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="py-2 px-4 border-b">Underweight</td><td className="py-2 px-4 border-b">&lt; 18.5</td></tr>
              <tr><td className="py-2 px-4 border-b">Normal weight</td><td className="py-2 px-4 border-b">18.5 – 24.9</td></tr>
              <tr><td className="py-2 px-4 border-b">Overweight</td><td className="py-2 px-4 border-b">25 – 29.9</td></tr>
              <tr><td className="py-2 px-4 border-b">Obesity (Class I)</td><td className="py-2 px-4 border-b">30 – 34.9</td></tr>
              <tr><td className="py-2 px-4 border-b">Obesity (Class II)</td><td className="py-2 px-4 border-b">35 – 39.9</td></tr>
              <tr><td className="py-2 px-4 border-b">Extreme Obesity</td><td className="py-2 px-4 border-b">&ge; 40</td></tr>
            </tbody>
          </table>
        </div>

        <h3>Limitations of BMI</h3>
        <p>While useful, BMI is not perfect. It does not distinguish between muscle mass and fat mass. Therefore, athletes with high muscle mass might be classified as "overweight" despite having low body fat. Conversely, elderly individuals with low muscle mass might be "normal weight" but have high body fat.</p>
        
        <h3>Tips for Achieving a Healthy BMI</h3>
        <ol>
          <li><strong>Balanced Diet:</strong> Focus on whole foods, vegetables, lean proteins, and healthy fats. Avoid processed sugars.</li>
          <li><strong>Regular Exercise:</strong> The WHO recommends at least 150 minutes of moderate aerobic activity per week.</li>
          <li><strong>Hydration:</strong> Drinking enough water aids metabolism and digestion.</li>
          <li><strong>Sleep:</strong> Poor sleep is linked to weight gain and hormonal imbalances.</li>
        </ol>
      </article>
    `,
    howToUse: [
      "Select your preferred system (Metric or Imperial).",
      "Enter your height (in cm or ft/in).",
      "Enter your weight (in kg or lbs).",
      "Click 'Calculate BMI' to see your score and category instantly.",
      "Review the health tips associated with your result."
    ],
    benefits: [
      "Instant Health Check: Get a quick snapshot of your weight status.",
      "Privacy Focused: Your health data remains in your browser and is never sent to any server.",
      "Based on WHO Standards: Uses scientifically valid calculation methods.",
      "Mobile Friendly: Check your BMI on the go at the gym or clinic."
    ],
    faqs: [
      {
        question: "Is BMI accurate for athletes?",
        answer: "Not always. Because muscle is denser than fat, athletes may have a high BMI but low body fat. In such cases, body composition analysis is a better metric."
      },
      {
        question: "Does BMI vary by age or gender?",
        answer: "The standard formula applies to adults (18+). However, interpretations can vary. Women naturally have more body fat than men, and older adults may have more body fat than younger adults with the same BMI."
      },
      {
        question: "What is the best time to weigh myself?",
        answer: "For the most consistent results, weigh yourself in the morning, after using the restroom and before eating or drinking."
      }
    ]
  },
  {
    id: "loan-calculator",
    name: "Loan Calculator",
    subheading: "Payment & interest calculator",
    description: "Calculate loan payments, interest, and amortization schedules.",
    category: "calculator",
    icon: CreditCard,
    path: "/tools/loan-calculator",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Master Your Finances with Our Mortgage & Loan Calculator</h2>
        <p>Taking out a loan is one of the biggest financial commitments most people make. Whether it's a <strong>home mortgage</strong>, a <strong>car loan</strong>, or a <strong>personal loan</strong> for debt consolidation, understanding the true cost of borrowing is essential. Our Loan Calculator breaks down your monthly payments and total interest, giving you the clarity you need to plan your budget.</p>

        <h3>Understanding the Components of a Loan</h3>
        <ul>
          <li><strong>Principal:</strong> The amount of money you borrow.</li>
          <li><strong>Interest Rate:</strong> The cost of borrowing, expressed as a percentage. Even a small difference (e.g., 0.5%) can save you thousands over the life of a loan.</li>
          <li><strong>Loan Term:</strong> How long you have to pay back the loan. Longer terms mean lower monthly payments but higher total interest costs.</li>
        </ul>

        <h3>Amortization Explained</h3>
        <p>Most fixed-rate loans use an <em>amortization schedule</em>. In the beginning, a large portion of your monthly payment goes toward paying off interest. As time passes, more of your payment goes toward the principal balance. Our calculator helps you visualize this shift.</p>

        <h3>How to Lower Your Loan Costs</h3>
        <p>Here are three proven strategies to save money on loans:</p>
        <ol>
          <li><strong>Make Extra Payments:</strong> Paying even $50 extra per month goes directly to the principal, reducing the loan term and total interest.</li>
          <li><strong>Refinance:</strong> If interest rates drop or your credit score improves, refinancing to a lower rate can lower your monthly burden.</li>
          <li><strong>Shorten the Term:</strong> Opting for a 15-year mortgage instead of a 30-year one increases monthly payments but drastically cuts interest costs.</li>
        </ol>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg my-6 border-l-4 border-blue-500">
          <h4>💡 Pro Tip:</h4>
          <p>Always check the APR (Annual Percentage Rate) when comparing loans, not just the interest rate. APR includes fees and closing costs, giving you a truer measure of the loan's cost.</p>
        </div>
      </article>
    `,
    howToUse: [
      "Enter the total Loan Amount (Principal).",
      "Input the Annual Interest Rate (%).",
      "Set the Loan Term (in years or months).",
      "Click 'Calculate' to see your estimated monthly payment and total payback amount."
    ],
    benefits: [
      "Visualize the true cost of borrowing.",
      "Compare different loan scenarios instantly.",
      "Plan your monthly budget with accuracy.",
      "Works for Mortgages, Auto Loans, and Personal Loans."
    ],
    faqs: [
      {
        question: "Does this include property taxes?",
        answer: "No, this calculator focuses on Principal and Interest (P&I). For a mortgage, remember to budget extra for property taxes, insurance, and HOA fees."
      },
      {
        question: "How does the interest rate affect my payment?",
        answer: "A higher interest rate increases your monthly payment and the total amount you pay back. Use this tool to see how a 1% difference impacts your wallet."
      },
      {
        question: "Is this financial advice?",
        answer: "No, this is a calculation tool for estimation purposes. Always consult with a qualified financial advisor or loan officer before signing agreements."
      }
    ]
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
    path: "/tools/json-formatter",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Beautify & Debug Your JSON Instantly</h2>
        <p>APIs often return JSON that is <strong>minified</strong> (all in one line) to save bandwidth. While efficient for computers, it is impossible for humans to read. Our <strong>JSON Formatter</strong> (also known as a JSON Beautifier) takes that raw string and transforms it into a structured, indented, and color-coded document.</p>

        <h3>Key Features for Developers</h3>
        <ul>
          <li><strong>Indentation Control:</strong> Choose between 2 spaces (standard JS style) or 4 spaces (Python style) or tabs.</li>
          <li><strong>Error Highlighting:</strong> If your JSON is invalid, we don't just say "Error". We point to the exact line number and character causing the issue.</li>
          <li><strong>Minification:</strong> Reverse the process! Compressing your JSON before sending it over the network can reduce payload size by up to 30%.</li>
        </ul>

        <h3>What is JSON?</h3>
        <p>JSON stands for <em>JavaScript Object Notation</em>. It is a lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse and generate. It is comprised of two structures:</p>
        <ol>
          <li>A collection of name/value pairs (Object).</li>
          <li>An ordered list of values (Array).</li>
        </ol>
      </article>
    `,
    howToUse: [
      "Paste your minified or ugly JSON into the input box.",
      "Select your desired indentation level (2 spaces is default).",
      "Click 'Format' to see the pretty version.",
      "Click 'Minify' if you want to compress it for production use."
    ],
    benefits: [
      "Instantly readable API responses.",
      "Detects syntax errors line-by-line.",
      "Works offline / locally in browser.",
      "One-click Copy to Clipboard."
    ],
    faqs: [
      {
        question: "What is the difference between JSON Editor and Formatter?",
        answer: "This Formatter tool is focused purely on 'Pretty Printing' and validation. The Editor tool allows for more complex structural manipulation and tree viewing."
      }
    ]
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
    path: "/tools/sql-formatter",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Optimize Your SQL Queries for Readability</h2>
        <p>Structured Query Language (SQL) is powerful, but complex queries can quickly become a "spaghetti code" mess. Nested joins, subqueries, and long \`WHERE\` clauses are hard to debug when written on a single line. Our <strong>SQL Formatter</strong> beautifies your code, making it easier to read, share, and maintain.</p>

        <h3>Supported Dialects</h3>
        <p>SQL syntax varies slightly between databases. Our tool supports standard SQL as well as dialects for:</p>
        <ul>
          <li><strong>MySQL / MariaDB</strong></li>
          <li><strong>PostgreSQL</strong></li>
          <li><strong>Microsoft SQL Server (T-SQL)</strong></li>
          <li><strong>SQLite</strong></li>
        </ul>

        <h3>Why Format SQL?</h3>
        <p>Formatting isn't just aesthetic. It helps you:</p>
        <ol>
          <li><strong>Spot Logic Errors:</strong> Proper indentation reveals the structure of nested conditions.</li>
          <li><strong>Collaborate:</strong> Clean code is polite code. Your teammates will thank you.</li>
          <li><strong>Optimization:</strong> It's easier to verify indexing opportunities when you can clearly see the \`JOIN\` and \`ON\` clauses.</li>
        </ol>
      </article>
    `,
    howToUse: [
      "Paste your raw SQL query.",
      "Select your SQL dialect (optional, auto-detect works well for standard queries).",
      "Click 'Format SQL'.",
      "Copy the clean code back to your database client."
    ],
    benefits: [
      "Standardizes keyword casing (e.g., SELECT, FROM).",
      "Properly indents nested queries.",
      "Removes unnecessary whitespace.",
      "Works for snippets and full stored procedures."
    ],
    faqs: [
      {
        question: "Is my database schema safe?",
        answer: "Yes. Processing is local. We do not execute your queries, we only format the text string. No connection to your database is ever made."
      }
    ]
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



  // Utility Tools
  {
    id: "ocr-converter",
    name: "OCR Converter",
    subheading: "Extract text from images",
    description: "Extract text from images and documents using OCR technology.",
    category: "utility",
    icon: Eye,
    path: "/tools/ocr-converter"
  },
  {
    id: "resume-builder",
    name: "Resume Builder",
    subheading: "Create professional resumes",
    description: "Build professional resumes with multiple templates and export options.",
    category: "utility",
    icon: UserCircle,
    path: "/tools/resume-builder"
  },
  {
    id: "ip-address-lookup",
    name: "IP Address Lookup",
    subheading: "Check IP details",
    description: "Get detailed information about your IP address and location.",
    category: "utility",
    icon: MapPin,
    path: "/tools/ip-address-lookup"
  },
  {
    id: "whois-lookup",
    name: "Whois Lookup",
    subheading: "Domain registration info",
    description: "Lookup domain registration details and ownership information.",
    category: "utility",
    icon: Search,
    path: "/tools/whois-lookup"
  },
  {
    id: "internet-speed-test",
    name: "Internet Speed Test",
    subheading: "Check connection speed",
    description: "Test your internet download and upload speeds instantly.",
    category: "utility",
    icon: Zap,
    path: "/tools/internet-speed-test",
    longDescription: "<p>Is your internet dragging? Buffering videos? Our <strong>Internet Speed Test</strong> gives you an accurate, real-time measurement of your connection's performance. It tests your <strong>Download Speed</strong> (how fast you pull data), <strong>Upload Speed</strong> (how fast you send data), and <strong>Ping/Latency</strong> (responsiveness).</p><p>Use this tool to verify if you are getting the speeds promised by your ISP (Internet Service Provider) or to troubleshoot network issues before important video calls or gaming sessions.</p>",
    howToUse: [
      "Close other bandwidth-heavy apps (like streaming or downloads) for accuracy.",
      "Click the 'Start Test' button.",
      "Watch as the gauge measures your Ping, Jitter, Download, and Upload speeds in real-time.",
      "Review your detailed report and compare it with your plan."
    ],
    benefits: [
      "Global server network for accurate results anywhere.",
      "Works on mobile (4G/5G) and desktop (fiber/cable/DSL).",
      "Detects latency (lag) issues critical for gaming.",
      "No Flash or Java required – 100% HTML5 safe."
    ],
    faqs: [
      {
        question: "What is a good internet speed?",
        answer: "For streaming 4K video, you need at least 25 Mbps. For competitive gaming, low ping (<50ms) is more important than raw speed."
      },
      {
        question: " Why is my result slower than my plan?",
        answer: "WiFi interference, distance from the router, or network congestion can all reduce speed. Try connecting via Ethernet cable to test the true line speed."
      }
    ]
  },
  {
    id: "typing-speed-test",
    name: "Typing Speed Test",
    subheading: "Check your WPM",
    description: "Test your typing speed and accuracy with our free online typing test.",
    category: "games",
    icon: Keyboard,
    path: "/tools/typing-speed-test"
  },
  {
    id: "2048-game",
    name: "2048 Game",
    subheading: "Classic puzzle game",
    description: "Play the addictive 2048 puzzle game online. Merge numbers to win!",
    category: "games",
    icon: Gamepad2,
    path: "/tools/2048-game"
  },
  {
    id: "number-flow",
    name: "Number Flow",
    subheading: "Connect numbers logic puzzle",
    description: "Connect the numbered dots in order to fill the entire grid. A relaxing logic puzzle.",
    category: "games",
    icon: Gamepad2, // Or a specific icon if available
    path: "/tools/number-flow"
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    subheading: "Resize images online",
    description: "Resize images by pixel dimensions or percentage quickly and easily.",
    category: "editor",
    icon: Image,
    path: "/tools/image-resizer",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Optimal Image Sizing for Web & Social Media</h2>
        <p>In the digital world, image size matters. Uploading a 4000px wide photo to a blog post that is only 800px wide is a waste of bandwidth and slows down your site. Our <strong>Free Image Resizer</strong> allows you to perfectly scale your images for any platform without losing quality.</p>
        
        <h3>Why Resize Images?</h3>
        <ul>
          <li><strong>Website Speed:</strong> Smaller dimensions mean smaller file sizes. This leads to faster page loads and better SEO scores (Core Web Vitals).</li>
          <li><strong>Email Attachments:</strong> Most email providers limit attachments to 25MB. Resizing helps you fit more photos into a single email.</li>
          <li><strong>Social Media Standards:</strong> Instagram, Facebook, and Twitter have specific aspect ratio requirements. Uploading the wrong size results in awkward cropping.</li>
        </ul>

        <h3>Common Standard Sizes (Pixels)</h3>
        <div className="overflow-x-auto my-6">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Platform</th>
                <th className="py-2 px-4 border-b">Recommended Size</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="py-2 px-4 border-b">Instagram Post</td><td className="py-2 px-4 border-b">1080 x 1080</td></tr>
              <tr><td className="py-2 px-4 border-b">YouTube Thumbnail</td><td className="py-2 px-4 border-b">1280 x 720</td></tr>
              <tr><td className="py-2 px-4 border-b">Facebook Cover</td><td className="py-2 px-4 border-b">820 x 312</td></tr>
              <tr><td className="py-2 px-4 border-b">Full HD Wallpaper</td><td className="py-2 px-4 border-b">1920 x 1080</td></tr>
            </tbody>
          </table>
        </div>
      </article>
    `,
    howToUse: [
      "Upload your image (JPG, PNG, WebP supported).",
      "Choose 'By Dimensions' to set specific width/height pixels.",
      "Choose 'By Percentage' to scale down (e.g., 50% smaller).",
      "Maintain Aspect Ratio is checked by default to prevent stretching.",
      "Click 'Resize' and download your optimized image."
    ],
    benefits: [
      "Process Locally: Images never leave your browser (Privacy Safe).",
      "High Quality: Uses advanced bicubic resampling algorithms.",
      "Batch Processing: Resize multiple images at once.",
      "Format Conversion: Save resized images as different formats."
    ],
    faqs: [
      {
        question: "Does resizing reduce quality?",
        answer: "Scaling down (making smaller) usually retains excellent quality. Scaling up (making larger) can cause pixelation or blurriness, as you are asking the computer to invent new pixels."
      }
    ]
  },
  {
    id: "text-to-handwriting",
    name: "Text to Handwriting",
    subheading: "Convert digital text to notes",
    description: "Convert typed text into realistic handwritten notes with customizable fonts and paper.",
    category: "generator",
    icon: Edit,
    path: "/tools/text-to-handwriting",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Convert Digital Text to Realistic Handwriting</h2>
        <p>Need to submit a handwritten assignment but running out of time? Our <strong>Text to Handwriting Converter</strong> transforms your typed notes into an image that looks like it was written with a pen on paper. Ideal for creating study notes, letters, or artistic projects.</p>

        <h3>Customization Options</h3>
        <p>To make the output convincing, you can tweak multiple variables:</p>
        <ul>
          <li><strong>Handwriting Style:</strong> Choose from 8+ different human handwriting fonts (messy, cursive, neat, block).</li>
          <li><strong>Paper Type:</strong> Select lined paper, graph paper, or plain white background.</li>
          <li><strong>Ink Color:</strong> Classic Blue, Black, Red, or custom colors.</li>
        </ul>

        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg my-6 border-l-4 border-red-500">
          <h4>🚫 Educational Integrity Warning</h4>
          <p>This tool is designed for creative purposes and study aids. Please do not use it to deceive teachers or professors for assignments where manual handwriting is explicitly required for learning purposes.</p>
        </div>
      </article>
    `,
    howToUse: [
      "Type or paste your text into the input box.",
      "Select a 'Handwriting Font' from the dropdown.",
      "Choose your 'Paper Background'.",
      "Adjust font size and line spacing to align with the lines.",
      "Click 'Generate Image' to download your handwritten note."
    ],
    benefits: [
      "Save hours of manual writing time.",
      "Create aesthetic study notes for Instagram/Pinterest.",
      "Generate personalized letters in bulk.",
      "High-resolution export for printing."
    ],
    faqs: [
      {
        question: "Can I upload my own handwriting?",
        answer: "Currently, we only support our curated list of handwriting fonts, but we are working on a feature to upload custom fonts in the future."
      }
    ]
  },
  {
    id: "click-speed-test",
    name: "Click Speed Test",
    subheading: "Check your CPS",
    description: "Test your clicking speed with our CPS (Clicks Per Second) test.",
    category: "games",
    icon: MousePointer2,
    path: "/tools/click-speed-test",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Test Your Clicking Speed (CPS Test)</h2>
        <p>The <strong>Clicks Per Second (CPS)</strong> test is a popular challenge among gamers, especially those who play Minecraft (PvP), shooters, or MOBAs. It measures how fast you can click your mouse button in a given time frame.</p>

        <h3>Why Click Speed Matters in Gaming?</h3>
        <p>In competitive gaming, higher CPS can mean the difference between winning and losing a duel. Techniques like "Jitter Clicking" or "Butterfly Clicking" are practiced by professionals to achieve speeds of 12-20 CPS.</p>

        <h3>World Records</h3>
        <p>While the average human clicks about 6-7 times per second, elite gamers can reach speeds of over 14 CPS consistently. The world record varies by technique but sits around the 22 CPS mark.</p>
      </article>
    `,
    howToUse: [
      "Get ready with your mouse.",
      "Click the green 'Start' area as fast as you can.",
      "The timer starts on your first click.",
      "Keep clicking until the timer runs out.",
      "View your Score and Rank (Turtle, Rabbit, Cheetah, etc.)."
    ],
    benefits: [
      "Train your finger muscles for endurance.",
      "Improve reaction time used in FPS games.",
      "Challenge friends to beat your high score.",
      "Works on mobile tap as well."
    ],
    faqs: [
      {
        question: "Does the mouse matter?",
        answer: "Yes! Gaming mice with high-quality switches (like Omron or Huano) are more responsive and durable for high-speed clicking."
      }
    ]
  },
  {
    id: "reaction-time-test",
    name: "Reaction Time Test",
    subheading: "Test your reflexes",
    description: "Measure your visual reaction time in milliseconds. Are you fast enough?",
    category: "games",
    icon: Timer,
    path: "/tools/reaction-time-test"
  },
  {
    id: "memory-match-game",
    name: "Memory Match Game",
    subheading: "Train your brain",
    description: "Classic card matching game to improve your short-term memory and focus.",
    category: "games",
    icon: Brain,
    path: "/tools/memory-match-game"
  },
  {
    id: "math-speed-challenge",
    name: "Math Speed Challenge",
    subheading: "Mental math practice",
    description: "Solve rapid-fire arithmetic problems against the clock. Great for students!",
    category: "games",
    icon: Calculator,
    path: "/tools/math-speed-challenge"
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    subheading: "Reduce image size",
    description: "Compress JPG, PNG, and WebP images locally in your browser.",
    category: "utility",
    icon: Image,
    path: "/tools/image-compressor",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Compress Images Without Losing Quality</h2>
        <p>A website with heavy images is a slow website. And slow websites lose visitors. Our <strong>Image Compressor</strong> balances file size with image quality, often reducing file size by 70-90% with zero visible difference to the naked eye.</p>

        <h3>Lossy vs. Lossless Compression</h3>
        <p>We use smart compression algorithms to minimize file size:</p>
        <ul>
          <li><strong>Lossy Compression (JPG/WebP):</strong> Removes invisible data. Best for photographs. Highest savings.</li>
          <li><strong>Lossless Compression (PNG):</strong> Compresses data without removing detail. Best for logos, screenshots, and text.</li>
        </ul>

        <h3>SEO Impact</h3>
        <p>Google has officially interpreted page speed as a ranking factor. Large images are the #1 cause of slow Largest Contentful Paint (LCP) scores. By compressing your images before upload, you directly improve your site's SEO.</p>
      </article>
    `,
    howToUse: [
      "Drag and drop your images into the compression zone.",
      "Adjust the Quality slider (0-100). Lower quality = smaller file size.",
      "Compare the 'Original' vs 'Compressed' preview side-by-side.",
      "Click 'Download All' to save your optimized images."
    ],
    benefits: [
      "Drastically reduces bandwidth usage.",
      "Faster website load periods.",
      "Works with JPG, PNG, and WebP.",
      "No file limits - process as many as you want."
    ],
    faqs: [
      {
        question: "Will my photos look blurry?",
        answer: "At recommended settings (70-80% quality), the difference is imperceptible to the human eye for standard screens."
      }
    ]
  },
  // AI PDF Tools
  {
    id: "chat-with-pdf",
    name: "Chat with PDF",
    subheading: "Talk to your documents",
    description: "Upload a PDF and ask questions, get summaries, and find answers instantly using AI.",
    category: "ai",
    icon: MessageSquare,
    path: "/tools/chat-with-pdf",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Talk to Your Documents with AI</h2>
        <p>Gone are the days of scrolling endlessly through 100-page documents to find one specific answer. With <strong>Chat with PDF</strong>, you can upload any PDF document—be it a textbook, a legal contract, a research paper, or a user manual—and have a natural conversation with it.</p>

        <h3>How It Works (The Magic of RAG)</h3>
        <p>This tool uses a technology called <strong>Retrieval Augmented Generation (RAG)</strong>. When you ask a question:</p>
        <ol>
          <li>The AI scans your document for relevant paragraphs.</li>
          <li>It passes those paragraphs to a Large Language Model (like GPT-4).</li>
          <li>The model answers your question using <em>only</em> the information in your document, ensuring accuracy.</li>
        </ol>

        <h3>Who Is This For?</h3>
        <ul>
          <li><strong>Students:</strong> "Explain the key concepts in Chapter 3 in simple terms."</li>
          <li><strong>Lawyers:</strong> "What are the termination clauses in this contract?"</li>
          <li><strong>Researchers:</strong> "Summarize the methodology section and list the limitations."</li>
          <li><strong>Professionals:</strong> "Extract the quarterly revenue figures from this financial report."</li>
        </ul>
      </article>
    `,
    howToUse: [
      "Upload your PDF file (drag & drop supported).",
      "Wait a few seconds for our AI to process and index the content.",
      "Type your question in the chat box.",
      "Receive an instant, citation-backed answer from your document."
    ],
    benefits: [
      "Save hours of reading time.",
      "Get precise answers with page references.",
      "Secure processing: Files are analyzed in memory and not stored permanently.",
      "Works with scanned documents (using OCR)."
    ],
    faqs: [
      {
        question: "Is there a page limit?",
        answer: "Currently, we support PDFs up to 50 pages for the free tier to ensure fast response times."
      },
      {
        question: "Does it work with other languages?",
        answer: "Yes! You can upload a document in Spanish and ask questions in English (or vice versa). The AI handles translation automatically."
      }
    ]
  },
  {
    id: "pdf-summarizer",
    name: "PDF Summarizer",
    subheading: "Summarize long documents",
    description: "Turn long PDFs into concise summaries, bullet points, or detailed breakdowns.",
    category: "ai",
    icon: FileText,
    path: "/tools/pdf-summarizer",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Turn Long PDFs into Executive Summaries in Seconds</h2>
        <p>Information overload is real. Whether you are a student facing a mountain of papers or an executive with a stack of reports, our <strong>AI PDF Summarizer</strong> cuts through the noise. It extracts the core ideas, main arguments, and crucial data points, presenting them in a clear, concise format.</p>

        <h3>Summary Modes</h3>
        <ul>
          <li><strong>Bullet Points:</strong> Great for quick scanning. Lists key takeaways.</li>
          <li><strong>Detailed Abstract:</strong> A cohesive paragraph summarizing the narrative.</li>
          <li><strong>Action Items:</strong> Extracts tasks and next steps (perfect for meeting minutes).</li>
        </ul>

        <h3>Why usage AI Summarization?</h3>
        <p>Human summarization is slow and biased. AI offers an objective, comprehensive overview instantly. It doesn't get tired and doesn't skip boring sections.</p>
      </article>
    `,
    howToUse: [
      "Upload your PDF document.",
      "Choose your summary length (Short, Medium, Long).",
      "Click 'Summarize'.",
      "Copy the text or download it as a new PDF/Word doc."
    ],
    benefits: [
      "Drastically improve reading comprehension.",
      "Review documents 10x faster.",
      "Identify if a document is worth reading in full.",
      "Extract key statistics and claims automatically."
    ],
    faqs: [
      {
        question: "Can it summarize fiction/novels?",
        answer: "Yes, it can outline plot points and character arcs, though it works best with non-fiction, technical, and business documents."
      }
    ]
  },
  {
    id: "pdf-quiz-generator",
    name: "PDF Quiz Generator",
    subheading: "Create quizzes from PDF",
    description: "Generate interactive quizzes and MCQs from your study materials automatically.",
    category: "ai",
    icon: FileQuestion,
    path: "/tools/pdf-quiz-generator",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Auto-Generate Quizzes from Your Study Materials</h2>
        <p>Active Recall is the #1 scientifically proven way to learn faster. Instead of checking reading, you should test yourself. Our <strong>PDF Quiz Generator</strong> uses AI to create multiple-choice questions (MCQs), true/false questions, and flashcards directly from your textbooks or lecture slides.</p>

        <h3>Perfect For:</h3>
        <ul>
          <li><strong>Exam Prep:</strong> Turn your syllabus into a mock exam.</li>
          <li><strong>Teachers:</strong> Create quick pop quizzes for your class in minutes.</li>
          <li><strong>Corporate Training:</strong> verify employees read the new policy handbook.</li>
        </ul>

        <h3>How It Works</h3>
        <p>The AI analyzes the semantic meaning of your text, identifies key facts and definitions, and formulates challenging questions to test your understanding—complete with correct answers and explanations.</p>
      </article>
    `,
    howToUse: [
      "Upload your study material (PDF).",
      "Select the number of questions you want (e.g., 10, 20).",
      "Choose the difficulty level (Easy, Medium, Hard).",
      "Click 'Generate Quiz' and start testing yourself immediately."
    ],
    benefits: [
      "Automated Active Recall: The most efficient study method.",
      "Instant feedback on your answers.",
      "Gamified learning experience.",
      "Export quizzes to Anki or Quizlet (coming soon)."
    ],
    faqs: [
      {
        question: "Are the answers accurate?",
        answer: "The AI pulls answers directly from the source text. However, as with any automated tool, we recommend verifying critical facts."
      }
    ]
  },
  {
    id: "pdf-study-notes",
    name: "PDF Study Notes",
    subheading: "Auto-generate study aids",
    description: "Create structured study notes, key definitions, and concept lists from textbooks.",
    category: "ai",
    icon: GraduationCap,
    path: "/tools/pdf-study-notes",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Instant Study Guides from Any Textbook</h2>
        <p>Struggling to organize your notes? Our <strong>PDF Study Notes Generator</strong> transforms chaotic chapters into structured, easy-to-read study guides. It automatically identifies headings, key terms, definitions, and important dates, formatting them into a beautiful revision sheet.</p>

        <h3>What You Get</h3>
        <ul>
          <li><strong>Key Concepts:</strong> A breakdown of the main topics.</li>
          <li><strong>Vocabulary List:</strong> Essential terms and their definitions.</li>
          <li><strong>Important Dates/Figures:</strong> Extracted timelines and people.</li>
          <li><strong>Summary Tables:</strong> Data organized for quick comparison.</li>
        </ul>
      </article>
    `,
    howToUse: [
      "Upload your textbook chapter or lecture slides.",
      "Click 'Generate Notes'.",
      "Review the structured output.",
      "Edit or add your own comments.",
      "Download as a clean PDF or Notion-friendly format."
    ],
    benefits: [
      "Stop wasting time formatting; start learning.",
      "Ensure you don't miss any key concepts.",
      "Create consistent documentation for all your subjects.",
      "Accessible anywhere, anytime."
    ],
    faqs: [
      {
        question: "Does it work with handwritten notes?",
        answer: "It works best with typed text. Scanned handwriting quality varies too much for reliable auto-formatting."
      }
    ]
  },
  {
    id: "pdf-translator",
    name: "PDF Translator",
    subheading: "Translate documents instantly",
    description: "Translate PDF text into any language while preserving meaning.",
    category: "ai",
    icon: Languages,
    path: "/tools/pdf-translator"
  }
];

export const categories = allCategories;

export const tools = allTools;
