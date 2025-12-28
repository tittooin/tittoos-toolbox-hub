import {
  FileText, Download, Upload, Image, File, Palette,
  Lock, Key, Calculator, Hash, Clock, QrCode,
  Type, AlignLeft, Languages, Search, Zap, Code,
  BarChart, PieChart, TrendingUp, Globe, Mail,
  Phone, MapPin, CreditCard, Calendar, Timer,
  Ruler, Thermometer, DollarSign, Percent, Scale,
  Binary, FileImage, FileVideo, Music, Archive,
  Bot, Video, Wand2, Sparkles, Brain, Youtube,
  Facebook, Twitter, Linkedin, Scissors, Gauge, Edit, Command, Smartphone, Terminal,
  Eye, UserCircle, RotateCw, Trash2, Stamp, Move, FileSpreadsheet, Presentation, Keyboard, Gamepad2, MousePointer2, MessageSquare, BookOpen, GraduationCap, FileQuestion, Book,
  AppWindow, Utensils, Apple
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
  { id: "dev", name: "Developer Tools", guidePath: "/blog-posts/dev-tools-category" },
  { id: "games", name: "Games & Brain", guidePath: "/blog-posts/games-category" },
  { id: "validators", name: "Validators", guidePath: "/blog-posts/validators-category" },
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
    path: "/merge-pdf-online",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Combine Multiple PDFs into One Organized Document</h2>
        <p>Project reports, invoices, legal contracts—documents often come in scattered pieces. Our <strong>Merge PDF tool</strong> is the digital stapler you've been looking for. Combine unlimited files into a single, professional document in the exact order you want.</p>
        
        <h3>Why Merge PDFs?</h3>
        <ul>
          <li><strong>Organization:</strong> Keep related documents together.</li>
          <li><strong>Sharing:</strong> Send one link or attachment instead of ten.</li>
          <li><strong>Printing:</strong> Print a cohesive packet without opening multiple files.</li>
        </ul>
      </article>
    `,
    howToUse: [
      "Select or drag multiple PDF files at once.",
      "Drag the thumbnails to rearrange the page order.",
      "Click 'Merge PDF' to combine them.",
      "Download your single, unified document."
    ],
    benefits: [
      "100% Free with no page limits.",
      "Drag-and-drop reordering.",
      "Works on Mac, Windows, and Linux.",
      "Secure processing."
    ],
    faqs: [
      {
        question: "Can I merge different page sizes?",
        answer: "Yes! You can combine A4, Letter, and Landscape pages. The final PDF will maintain the original dimensions of each page."
      }
    ]
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    subheading: "Extract pages from PDF",
    description: "Split PDF files or extract specific pages into new documents.",
    category: "pdf",
    icon: FileText,
    path: "/split-pdf-online",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Extract Only the Pages You Need</h2>
        <p>Have a massive 100-page report but only need Chapter 4? Or maybe a scanned bank statement where you only want to share one specific transaction page? Our <strong>Split PDF tool</strong> gives you surgical precision to separate, extract, and save specific pages.</p>
        
        <h3>Flexible Splitting Options</h3>
        <ul>
          <li><strong>Extract Custom Ranges:</strong> e.g., "Pages 1-5, 10, 12-15".</li>
          <li><strong>Burst Split:</strong> Save every single page as a separate PDF file.</li>
          <li><strong>Delete Unwanted Pages:</strong> Simply uncheck the pages you don't want to include.</li>
        </ul>
      </article>
    `,
    howToUse: [
      "Upload your PDF.",
      "Select the pages you want to keep (click to select/deselect).",
      "Or enter a specific range (e.g. 1-5).",
      "Click 'Split PDF' and download your new file(s)."
    ],
    benefits: [
      "Instant page visualization.",
      "No quality loss.",
      "Handle large files with ease.",
      "Browser-based privacy."
    ],
    faqs: [
      {
        question: "Will this break my links/bookmarks?",
        answer: "Extracted pages retain their content, but internal links to pages that were removed will obviously no longer work."
      }
    ]
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    subheading: "Reduce PDF file size",
    description: "Compress and optimize PDF files to reduce file size online.",
    category: "pdf",
    icon: FileText,
    path: "/compress-pdf-online",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Reduce PDF Size Without Losing Quality</h2>
        <p>Large PDF files are a hassle. They clog up email inboxes, take forever to upload, and eat up storage space. Our <strong>PDF Compressor</strong> solves this by intelligently optimizing your file's internal structure.</p>

        <h3>How Compression Works</h3>
        <p>We use advanced algorithms to:</p>
        <ul>
          <li><strong>Resample Images:</strong> Reduce the DPI of embedded images to a web-friendly standard (144dpi or 72dpi).</li>
          <li><strong>Remove Redundancy:</strong> Strip out duplicate fonts, unused metadata, and hidden layers.</li>
          <li><strong>Optimize Structure:</strong> Reorganize the internal objects of the PDF for efficiency.</li>
        </ul>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg my-6 border-l-4 border-green-500">
          <h4>🚀 Performance Boost</h4>
          <p>Compressing a 20MB scanned contract down to 2MB makes it 10x faster to share and download, without making the text unreadable.</p>
        </div>
      </article>
    `,
    howToUse: [
      "Upload your large PDF file.",
      "Select compression level (Medium is recommended for most docs).",
      "Wait for the optimization process to finish.",
      "See exactly how much space you saved (e.g., -85%).",
      "Download your lightweight PDF."
    ],
    benefits: [
      "Bypass email attachment limits (usually 25MB).",
      "Faster uploads to portals (government, university, jobs).",
      "Save device storage space.",
      "Cloud-based processing saves your CPU."
    ],
    faqs: [
      {
        question: "Will the text become blurry?",
        answer: "No. Text in PDFs is usually vector-based, which scales perfectly at any size. Only embedded images might lose some detail, but they will still be readable."
      },
      {
        question: "Is it safe for sensitive docs?",
        answer: "Yes. All processing happens securely. We auto-delete all uploaded files from our servers after 1 hour."
      }
    ]
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    subheading: "Convert PDF to DOCX",
    description: "Convert PDF files to editable Word documents.",
    category: "pdf",
    icon: FileText,
    path: "/tools/pdf-to-word",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Convert PDF to Editable Word Docs</h2>
        <p>PDFs are great for sharing, but terrible for editing. Our <strong>PDF to Word Converter</strong> changes that. It accurately transforms your static PDF into a fully editable Microsoft Word (.docx) file.</p>
        
        <h3>What Gets Preserved?</h3>
        <ul>
          <li><strong>Text & Fonts:</strong> We match the original fonts as closely as possible.</li>
          <li><strong>Images:</strong> Photos and graphics stay in place.</li>
          <li><strong>Layout:</strong> Paragraphs, columns, and tables remain intact.</li>
        </ul>
      </article>
    `,
    howToUse: [
      "Drag and drop your PDF.",
      "Wait for the conversion (usually 5-10 seconds).",
      "Download your new .docx file.",
      "Open in MS Word or Google Docs to edit."
    ],
    benefits: [
      "Stop retyping documents.",
      "Edit contracts and resumes easily.",
      "Free for everyone.",
      "Secure deletion after processing."
    ],
    faqs: [
      {
        question: "Can I convert scanned PDFs?",
        answer: "Yes! Our OCR technology can recognize text even in non-selectable scanned documents."
      }
    ]
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    subheading: "Convert DOCX to PDF",
    description: "Convert Word documents to PDF format.",
    category: "pdf",
    icon: FileText,
    path: "/tools/word-to-pdf",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Turn Word Docs into Professional PDFs</h2>
        <p>Sending a Word doc can be risky—formatting often breaks on different computers (missing fonts, shifted images). Converting to <strong>PDF</strong> ensures your document looks exactly the same on every device, from iPhones to Windows desktops.</p>
      </article>
    `,
    howToUse: [
      "Upload your DOC or DOCX file.",
      "The tool automatically converts it.",
      "Download your high-quality PDF."
    ],
    benefits: [
      "Locks your formatting.",
      "Universal compatibility.",
      "Smaller file sizes.",
      "Ready for professional printing."
    ],
    faqs: [
      {
        question: "Does it support .doc files?",
        answer: "Yes, we support both the modern .docx and the older .doc formats."
      }
    ]
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    subheading: "Convert PDF pages to Images",
    description: "Convert each page of a PDF into a high-quality JPG image.",
    category: "pdf",
    icon: Image,
    path: "/tools/pdf-to-jpg",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Extract Images from PDF</h2>
        <p>Need to share a single page of a PDF on Instagram or use it in a PowerPoint presentation? Our <strong>PDF to JPG</strong> tool converts every page of your document into a separate, high-resolution image file.</p>
      </article>
    `,
    howToUse: [
      "Upload your PDF.",
      "Choose 'Convert Entire Pages' or 'Extract Single Images'.",
      "Download your images as a ZIP file or individually."
    ],
    benefits: [
      "High Resolution (300 DPI).",
      "Great for social media sharing.",
      "No watermarks.",
      "Fast processing."
    ],
    faqs: [
      {
        question: "JPG vs PNG?",
        answer: "JPG is best for photos and smaller file sizes. Use our PDF to PNG tool if you need higher quality text rendering."
      }
    ]
  },
  {
    id: "pdf-to-png",
    name: "PDF to PNG",
    subheading: "Convert PDF pages to PNG",
    description: "Convert each page of a PDF into a high-quality PNG image.",
    category: "pdf",
    icon: Image,
    path: "/tools/pdf-to-png",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Convert PDF to High-Quality PNGs</h2>
        <p>Unlike JPG which compresses images (losing quality), <strong>PNG is a lossless format</strong>. This means when you convert your PDF pages to PNG, you get razor-sharp text and graphics, making it perfect for archiving or professional editing.</p>
      </article>
    `,
    howToUse: [
      "Upload your PDF.",
      "Wait for the conversion.",
      "Download your pristine PNG images."
    ],
    benefits: [
      "Lossless quality.",
      "Transparent background support.",
      "Ideal for screenshots and text.",
      "Batch downloading."
    ],
    faqs: [
      {
        question: "Why are the files larger than JPG?",
        answer: "Because PNG preserves all the detail. If file size is a concern, use our PDF to JPG tool instead."
      }
    ]
  },
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    subheading: "Convert Images to PDF",
    description: "Combine multiple JPG images into a single PDF document.",
    category: "pdf",
    icon: Image,
    path: "/tools/jpg-to-pdf",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Turn Photos into a Document</h2>
        <p>Taken photos of a contract or receipt with your phone? Use our <strong>JPG to PDF converter</strong> to combine all those separate images into a single, clean PDF file that's easy to email.</p>
      </article>
    `,
    howToUse: [
      "Select your JPG/PNG images.",
      "Drag to reorder them.",
      "Choose page size (A4, Letter, Auto).",
      "Click 'Create PDF' to merge them all."
    ],
    benefits: [
      "Combine unlimited photos.",
      "Adjust margins and orientation.",
      "Supports JPG, PNG, GIF, BMP.",
      "Instant download."
    ],
    faqs: [
      {
        question: "Can I print this?",
        answer: "Yes! The resulting PDF is formatted perfectly for standard printing."
      }
    ]
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
    path: "/tools/pdf-to-ppt",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Present with Confidence: PDF to PowerPoint</h2>
        <p>Locked in a PDF? Our <strong>PDF to PPT converter</strong> unlocks your content, transforming static pages into editable PowerPoint slides. This is a lifesaver for professionals who need to present data from reports or teachers who want to use textbook materials in class.</p>
      </article>
    `,
    howToUse: [
      "Upload your PDF document.",
      "The tool extracts content and places it onto slides.",
      "Download your new .pptx file.",
      "Open in PowerPoint or Google Slides to present."
    ],
    benefits: [
      "No need to re-type slides.",
      "Preserves original layout.",
      "Editable text and images.",
      "Works with Keynote and Google Slides too."
    ],
    faqs: [
      {
        question: "Is the text editable?",
        answer: "Yes! We strive to make text blocks editable so you can change fonts, colors, and content."
      }
    ]
  },
  {
    id: "ppt-to-pdf",
    name: "PPT to PDF",
    subheading: "Convert PowerPoint to PDF",
    description: "Convert PowerPoint presentations to PDF format.",
    category: "pdf",
    icon: Presentation,
    path: "/tools/ppt-to-pdf",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Share Presentations Fearlessly</h2>
        <p>Sending a PowerPoint file is risky—fonts go missing, videos don't play, and formatting shifts. Converting your <strong>PPT to PDF</strong> freezes everything in place. It guarantees your audience sees exactly what you designed, whether they are on a phone, tablet, or PC.</p>
      </article>
    `,
    howToUse: [
      "Upload your .ppt or .pptx file.",
      "We convert each slide into a PDF page.",
      "Download your professional handout."
    ],
    benefits: [
      "Locks all formatting.",
      "Reduces file size for email.",
      "Great for lecture notes/handouts.",
      "Prevent accidental edits."
    ],
    faqs: [
      {
        question: "What about animations?",
        answer: "PDF is a static format. Animations and transitions will not play, but the final visual state of the slide will be captured."
      }
    ]
  },
  {
    id: "lock-pdf",
    name: "Lock PDF",
    subheading: "Protect PDF with Password",
    description: "Encrypt PDF files with a password for security.",
    category: "pdf",
    icon: Lock,
    path: "/tools/lock-pdf",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Bank-Grade Security for Your Documents</h2>
        <p>Sending a contract via email? Storing tax returns on the cloud? Don't leave them exposed. Our <strong>Lock PDF</strong> tool uses industry-standard 256-bit AES encryption to password-protect your files. Only people with the password can view the content.</p>
      </article>
    `,
    howToUse: [
      "Upload your confidential PDF.",
      "Type a strong password.",
      "Click 'Encrypt PDF'.",
      "Download your secured file."
    ],
    benefits: [
      "Prevent unauthorized access.",
      "Compliant with GDPR privacy standards.",
      "Cannot be opened without the key.",
      "Files are not stored on our server."
    ],
    faqs: [
      {
        question: "Can you recover my password if I forget it?",
        answer: "No. For your security, we do not store passwords. If you lose it, the file cannot be opened."
      }
    ]
  },
  {
    id: "unlock-pdf",
    name: "Unlock PDF",
    subheading: "Remove PDF Password",
    description: "Remove password protection from PDF files.",
    category: "pdf",
    icon: Lock,
    path: "/tools/unlock-pdf",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Remove Passwords from PDFs</h2>
        <p>Tired of typing a password every time you open your bank statement or payslip? If you know the password and want to remove it permanently, our <strong>Unlock PDF</strong> tool creates a new, unencrypted version of your file for easy access.</p>
      </article>
    `,
    howToUse: [
      "Upload the locked PDF.",
      "Enter the *current* password once (to prove you have access).",
      "Click 'Unlock'.",
      "Download the password-free version."
    ],
    benefits: [
      "Save time opening frequent files.",
      "Enable editing on previously restricted files.",
      "Share with others without sharing the password."
    ],
    faqs: [
      {
        question: "Can it crack a password I don't know?",
        answer: "No. This is a legitimate tool for owners to remove their own protection. It is not a hacking tool."
      }
    ]
  },
  {
    id: "rotate-pdf",
    name: "Rotate PDF",
    subheading: "Rotate PDF Pages",
    description: "Rotate PDF pages 90, 180, or 270 degrees.",
    category: "pdf",
    icon: RotateCw,
    path: "/tools/rotate-pdf",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Fix Upside-Down Scans Instantly</h2>
        <p>Scanned a document in the wrong orientation? Don't rescan it. Our <strong>Rotate PDF</strong> tool lets you fix the orientation of single pages or the entire document with a click.</p>
      </article>
    `,
    howToUse: [
      "Upload your PDF.",
      "Hover over any page to rotate it individually.",
      "Or use 'Rotate All' buttons.",
      "Download the fixed PDF."
    ],
    benefits: [
      "Fix landscape/portrait mix-ups.",
      "No quality loss.",
      "Visual interface."
    ],
    faqs: [
      {
        question: "Is the rotation permanent?",
        answer: "Yes, once you download the file, the new orientation is saved permanently."
      }
    ]
  },
  {
    id: "delete-pdf-pages",
    name: "Delete PDF Pages",
    subheading: "Remove Pages from PDF",
    description: "Remove specific pages from a PDF document.",
    category: "pdf",
    icon: Trash2,
    path: "/tools/delete-pdf-pages",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Clean Up Your Documents</h2>
        <p>Accidentally scanned a blank page? Need to remove a sensitive page before sharing? Our <strong>Delete PDF Pages</strong> tool lets you remove unwanted content simply by clicking 'X'.</p>
      </article>
    `,
    howToUse: [
      "Upload your PDF.",
      "See all pages as thumbnails.",
      "Click the trash icon on pages you want to remove.",
      "Download the cleaned PDF."
    ],
    benefits: [
      "Reduce file size.",
      "Remove sensitive info.",
      "Fix scanning errors."
    ],
    faqs: [
      {
        question: "Can I undo?",
        answer: "You can re-upload the original file if you make a mistake, but the downloaded file will not have the deleted pages."
      }
    ]
  },
  {
    id: "extract-pdf-pages",
    name: "Extract PDF Pages",
    subheading: "Extract Pages from PDF",
    description: "Create a new PDF containing only selected pages.",
    category: "pdf",
    icon: Scissors,
    path: "/tools/extract-pdf-pages",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Cherry-Pick Your Pages</h2>
        <p>Unlike splitting (which divides a file), <strong>Extraction</strong> is about curating. Pick the exact 3 pages you want from a 50-page document and create a brand new, lightweight PDF containing just those highlights.</p>
      </article>
    `,
    howToUse: [
      "Upload PDF.",
      "Click on the pages you want to KEEP.",
      "Click 'Extract'.",
      "Download your new mini-PDF."
    ],
    benefits: [
      "Create focused documents.",
      "Send only relevant info.",
      "Simple visual selector."
    ],
    faqs: []
  },
  {
    id: "watermark-pdf",
    name: "Watermark PDF",
    subheading: "Add Watermark to PDF",
    description: "Add custom text watermarks to PDF pages.",
    category: "pdf",
    icon: Stamp,
    path: "/tools/watermark-pdf",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Claim Ownership of Your Work</h2>
        <p>Prevent unauthorized copying or mark documents as 'DRAFT' or 'CONFIDENTIAL'. Our <strong>Watermark PDF</strong> tool stamps your custom text over every page of your document.</p>
      </article>
    `,
    howToUse: [
      "Upload PDF.",
      "Type watermark text (e.g. 'Copyright 2024').",
      "Choose transparency, color, and position.",
      "Download watermarked file."
    ],
    benefits: [
      "Protect intellectual property.",
      "Indicate document status.",
      "Professional branding."
    ],
    faqs: [
      {
        question: "Can I remove the watermark later?",
        answer: "It is very difficult to remove a baked-in watermark, which is the point! Always keep your original clean file safe."
      }
    ]
  },
  {
    id: "rearrange-pdf",
    name: "Rearrange PDF",
    subheading: "Reorder PDF Pages",
    description: "Reorder pages within a PDF document.",
    category: "pdf",
    icon: Move,
    path: "/tools/rearrange-pdf",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Organize Your PDF</h2>
        <p>Scanned pages in the wrong order? Need to move the conclusion to the front? <strong>Rearrange PDF</strong> lets you drag and drop pages into the perfect sequence.</p>
      </article>
    `,
    howToUse: [
      "Upload PDF.",
      "Drag thumbnails to new positions.",
      "Click 'Save Order'.",
      "Download."
    ],
    benefits: [
      "Fix scanning mistakes.",
      "Improve document flow.",
      "No technical skills needed."
    ],
    faqs: []
  },
  {
    id: "pdf-text-extractor",
    name: "PDF Text Extractor",
    subheading: "Extract Text from PDF",
    description: "Extract raw text from PDF files.",
    category: "pdf",
    icon: AlignLeft,
    path: "/tools/pdf-text-extractor",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Get the Text, Leave the Formatting</h2>
        <p>Need to copy text from a PDF but it's all garbled or locked? Our <strong>Text Extractor</strong> pulls out the raw plain text from your document, ready for pasting into Notepad, Word, or code editors.</p>
      </article>
    `,
    howToUse: [
      "Upload PDF.",
      "We strip images and layout.",
      "You get a clean stream of text.",
      "Copy or download as .txt."
    ],
    benefits: [
      "Analysis ready data.",
      "Smallest file size.",
      "Works on essays and reports."
    ],
    faqs: []
  },
  {
    id: "pdf-editor",
    name: "PDF Editor",
    subheading: "Edit PDF Online",
    description: "Add text, shapes, and annotations to PDFs.",
    category: "pdf",
    icon: Edit,
    path: "/tools/pdf-editor",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Edit PDFs in Your Browser</h2>
        <p>Forgot to add a date? Need to fill out a form? Our <strong>Online PDF Editor</strong> lets you add text, checkmarks, signatures, and shapes directly onto your PDF pages.</p>
      </article>
    `,
    howToUse: [
      "Upload PDF.",
      "Select 'Text Tool' to type.",
      "Select 'Freehand' to sign or draw.",
      "Download your specific edits."
    ],
    benefits: [
      "Fill forms without printing.",
      "Sign documents digitally.",
      "Annotate and markup."
    ],
    faqs: []
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
    path: "/tools/age-calculator",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Calculate Your Exact Age to the Scroll</h2>
        <p>You know you are 25 years old, but do you know how many days you've been alive? Or how many seconds? Our <strong>Age Calculator</strong> helps you find your precise chronological age based on your Date of Birth (DOB).</p>

        <h3>Why Calculate Precise Age?</h3>
        <ul>
          <li><strong>Astrology:</strong> Exact time is crucial for birth charts.</li>
          <li><strong>Milestones:</strong> Celebrate your 10,000th day alive!</li>
          <li><strong>Legal Documents:</strong> Verify eligibility for age-restricted services.</li>
        </ul>
      </article>
    `,
    howToUse: [
      "Select your Date of Birth from the calendar picker.",
      "Enter the Time of Birth (optional, for extra precision).",
      "Click 'Calculate'.",
      "View your age in Years, Months, Weeks, Days, Hours, and Minutes."
    ],
    benefits: [
      "Fun facts about your birthday.",
      "Determine age difference between two people.",
      "Planning for retirement or events."
    ],
    faqs: [
      {
        question: "Does it account for Leap Years?",
        answer: "Yes, our algorithm correctly accounts for all leap years (every 4 years) when calculating your total days alive."
      }
    ]
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
    id: "thumbnail-generator",
    name: "AI Thumbnail Generator",
    subheading: "Create Viral YouTube Thumbnails",
    description: "Auto-generate clickbait-worthy thumbnails with AI background and text overlay.",
    category: "ai",
    icon: Youtube,
    path: "/tools/thumbnail-generator",
    longDescription: `
      <article className="prose prose-lg max-w-none">
        <h2>Stop Spending Hours on Thumbnails</h2>
        <p>Your video deserves a click, but creating thumbnails is a pain. Our <strong>AI Thumbnail Generator</strong> does the heavy lifting for you.</p>
        <p>Just tell us your video title, and our AI will:</p>
        <ul>
          <li><strong>Dream up a Background:</strong> It hallucinates a dramatic, high-quality scene that fits your topic.</li>
          <li><strong>Write the Copy:</strong> It generates punchy, 2-word sticker text and heavy titles that scream "Click Me".</li>
          <li><strong>Composite It:</strong> It layers everything perfectly in 1280x720 HD format.</li>
        </ul>
      </article>
    `,
    howToUse: [
      "Enter your Video Title (e.g., 'I Built a House Underwater').",
      "Click 'Generate Thumbnail'.",
      "AI will generate background, title, and CTA.",
      "Customize text or colors if needed.",
      "Download the finished PNG instantly."
    ],
    benefits: [
      "100% Free AI Generation.",
      "Perfect YouTube Aspect Ratio (16:9).",
      "No Watermarks.",
      "Instant 'Burn-In' of Text."
    ],
    faqs: [
      {
        question: "Can I use these on YouTube?",
        answer: "Yes! The images are copyright-free and ready for monetization."
      }
    ]
  },
  {
    id: "text-to-image",
    name: "AI Text to Image",
    subheading: "Generate stunning visuals",
    description: "Generate stunning images from text descriptions using AI.",
    category: "ai",
    icon: Image,
    path: "/tools/text-to-image",
    longDescription: `
  < article className = "prose prose-lg max-w-none" >
  <h2>Turn Words into Art with AI </h2>
  < p > You don't need to be an artist to create breathtaking visuals. With our <strong>AI Text to Image Generator</strong>, you simply describe what you see in your mind's eye, and our advanced diffusion models paint it into reality in seconds.</p>

    < h3 > How to Write Better Prompts </h3>
      < p > The secret to great AI art is the "prompt"(your instruction).Use this formula: </p>
        < div className = "bg-gray-100 dark:bg-gray-800 p-4 rounded-md font-mono text-sm mb-4" >
          <strong>[Subject] + [Action / Context] + [Art Style] + [Lighting / Mood] </strong>
          </div>
          < p > <em>Example: "A futuristic city (Subject) floating in the clouds (Context), cyberpunk style with neon lights (Style), cinematic 8k resolution (Mood)." < /em></p >
            </article>
              `,
    howToUse: [
      "Type a detailed description of the image you want.",
      "Select an aspect ratio (Square, Portrait, Landscape).",
      "Click 'Generate'.",
      "Upscale and download your favorite result."
    ],
    benefits: [
      "Copyright-free images for your blog.",
      "Visualize concepts instantly.",
      "No design skills required.",
      "Create unique assets found nowhere else."
    ],
    faqs: [
      {
        question: "Can I use these images commercially?",
        answer: "Yes, you own full commercial rights to the images you generate with our tool."
      }
    ]
  },
  {
    id: "text-to-video",
    name: "AI Text to Video",
    subheading: "Create videos from text",
    description: "Create videos from text prompts with AI generation.",
    category: "ai",
    icon: Video,
    path: "/tools/text-to-video",
    longDescription: `
            < article className = "prose prose-lg max-w-none" >
              <h2>AI Video Generation: The New Frontier </h2>
                < p > Video production used to cost thousands of dollars and weeks of time.Now, you can script scenes with text and have our AI animate them. < strong > Text to Video < /strong> is perfect for creating social media ads, storyboards, or visualizing scenes for a movie.</p >
                  </article>
                    `,
    howToUse: [
      "Describe the scene (e.g., 'A drone flying over a snowy mountain at sunset').",
      "Choose a duration (e.g., 5 seconds).",
      "Click 'Generate Video'.",
      "Download the MP4 file."
    ],
    benefits: [
      "Rapid prototyping.",
      "Unique stock footage.",
      "Engage audiences better than static images."
    ],
    faqs: [
      {
        question: "Is there audio?",
        answer: "Currently, we generate visual video only. You can add music tracks separately using our Video Editor."
      }
    ]
  },
  {
    id: "ai-prompt-assistant",
    name: "AI Prompt Assistant",
    subheading: "Perfect prompt crafting",
    description: "Get help crafting perfect prompts for AI tools and chatbots.",
    category: "ai",
    icon: Bot,
    path: "/tools/ai-prompt-assistant",
    longDescription: `
                  < article className = "prose prose-lg max-w-none" >
                    <h2>Master the Language of AI </h2>
                      < p > AI models like ChatGPT, Midjourney, and Claude are powerful, but they are only as smart as the instructions you give them.The < strong > AI Prompt Assistant < /strong> helps you rewrite basic requests into highly optimized engineered prompts that unlock the full potential of these LLMs.</p >

                        <h3>What We Optimize </h3>
                          < ul >
                          <li><strong>Clarity: </strong> Removing ambiguity.</li >
                            <li><strong>Context: </strong> Adding personas (e.g., "Act as a Senior Developer").</li >
                              <li><strong>Constraints: </strong> Setting word limits or formatting rules.</li >
                                </ul>
                                </article>
                                  `,
    howToUse: [
      "Enter your basic idea (e.g., 'Write a blog about coffee').",
      "Select your target AI (ChatGPT, Midjourney, Stable Diffusion).",
      "Click 'Optimize'.",
      "Copy the enhanced, detailed prompt."
    ],
    benefits: [
      "Get better answers on the first try.",
      "Learn prompt engineering techniques.",
      "Save time iterating."
    ],
    faqs: []
  },
  {
    id: "ai-website-generator",
    name: "AI Website Generator",
    subheading: "Complete website creation",
    description: "Generate complete website layouts and content using AI.",
    category: "ai",
    icon: Wand2,
    path: "/tools/ai-website-generator",
    longDescription: `
                                < article className = "prose prose-lg max-w-none" >
                                  <h2>Build a Website in 60 Seconds </h2>
                                    < p > Need a landing page for your startup ? A portfolio for your photography ? Don't spend months coding. Our <strong>AI Website Generator</strong> builds a responsive, modern HTML/CSS website based on a simple description of your business.</p>
                                      </article>
                                        `,
    howToUse: [
      "Describe your site purpose (e.g., 'A bakery in New York selling custom cupcakes').",
      "Choose a color theme.",
      "Click 'Build Website'.",
      "Preview the live site and download the code."
    ],
    benefits: [
      "Includes copy, images, and layout.",
      "Mobile-friendly design.",
      "Clean, semantic HTML code."
    ],
    faqs: []
  },
  // Dev Tools
  {
    id: "windows-cmd-gen",
    name: "Windows Command Gen",
    subheading: "PowerShell AI Assistant",
    description: "Generate complex PowerShell commands from plain English.",
    category: "dev",
    icon: Terminal,
    path: "/tools/windows-cmd-gen"
  },
  {
    id: "linux-cmd-gen",
    name: "Linux Terminal Gen",
    subheading: "Bash AI Assistant",
    description: "Translate your requests into executable Bash commands.",
    category: "dev",
    icon: Terminal,
    path: "/tools/linux-cmd-gen"
  },
  {
    id: "mac-cmd-gen",
    name: "MacOS Terminal Gen",
    subheading: "Zsh AI Assistant",
    description: "Master the Mac terminal with AI-generated Zsh commands.",
    category: "dev",
    icon: Command,
    path: "/tools/mac-cmd-gen"
  },
  {
    id: "android-adb-gen",
    name: "ADB Command Gen",
    subheading: "Android Debug Bridge",
    description: "Generate ADB and Fastboot commands for Android management.",
    category: "dev",
    icon: Smartphone,
    path: "/tools/android-adb-gen"
  },

  {
    id: "ai-tool-generator",
    name: "AI Tool Generator",
    subheading: "Custom AI utilities",
    description: "Create custom AI-powered tools and utilities on demand.",
    category: "ai",
    icon: Sparkles,
    path: "/tools/ai-tool-generator",
    longDescription: `
                                      < article className = "prose prose-lg max-w-none" >
                                        <h2>If It Doesn't Exist, Build It</h2>
                                          < p > Can't find the specific tool you need? Tell our <strong>AI Tool Generator</strong> what logic you need (e.g., "A calculator that estimates standard deviation based on a list of numbers" or "A text parser that extracts email addresses"). We will generate a working mini-app for you instantly.</p>
                                            </article>
                                              `,
    howToUse: [
      "Describe the tool functionality.",
      "Wait for the AI to code it.",
      "Use the tool immediately in the preview window."
    ],
    benefits: [
      "Limitless possibilities.",
      "Solve niche problems.",
      "No coding knowledge needed."
    ],
    faqs: [
      {
        question: "Is the code safe?",
        answer: "Yes, the generated tools run in a sandboxed environment within your browser."
      }
    ]
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
    path: "/tools/typing-speed-test",
    longDescription: `
                                            < article className = "prose prose-lg max-w-none" >
                                              <h2>How Fast Can You Type ? </h2>
                                                < p > Typing speed is a critical skill in today's digital age. Whether you are a programmer coding all day, a writer working on a novel, or a student finishing a paper, typing faster saves you hundreds of hours per year. Our <strong>Typing Speed Test</strong> measures your WPM (Words Per Minute) and Accuracy.</p>

                                                  < h3 > What is a good WPM ? </h3>
                                                    < ul >
                                                    <li><strong>40 WPM: </strong> Average typing speed.</li >
                                                      <li><strong>60 - 70 WPM: </strong> Professional typing speed (secretaries, writers).</li >
                                                        <li><strong>100 + WPM: </strong> Elite speed (competitive typists).</li >
                                                          </ul>
                                                          </article>
                                                            `,
    howToUse: [
      "Click on the text input area.",
      "Start typing the highlighted words as accurately as possible.",
      "Correction of mistakes is allowed (backspace).",
      "The timer stops when you finish the paragraph."
    ],
    benefits: [
      "Improve your muscle memory.",
      "Identify weak keys.",
      "Train for speed and accuracy simultaneously."
    ],
    faqs: []
  },
  {
    id: "2048-game",
    name: "2048 Game",
    subheading: "Classic puzzle game",
    description: "Play the addictive 2048 puzzle game online. Merge numbers to win!",
    category: "games",
    icon: Gamepad2,
    path: "/tools/2048-game",
    longDescription: `
                                                          < article className = "prose prose-lg max-w-none" >
                                                            <h2>The Addiction of Powers of Two </h2>
                                                              < p > 2048 is the legendary sliding block puzzle game that took the internet by storm.The goal is deceptively simple: slide numbered tiles on a grid to combine them to create a tile with the number 2048. </p>

                                                                < h3 > Strategy Tips </h3>
                                                                  < p > The key to winning is keeping your highest number in a secure corner.Never move it from there! Build a chain of descending numbers next to it so you can easily merge them upwards.</p>
                                                                    </article>
                                                                      `,
    howToUse: [
      "Use Arrow Keys (or Swipe) to move tiles.",
      "Tiles with the same number merge into one when they touch.",
      "Add them up to reach 2048 to win!"
    ],
    benefits: [
      "Great mental workout.",
      "Improves strategic planning.",
      "Relaxing yet challenging."
    ],
    faqs: []
  },
  {
    id: "number-flow",
    name: "Number Flow",
    subheading: "Connect numbers logic puzzle",
    description: "Connect the numbered dots in order to fill the entire grid. A relaxing logic puzzle.",
    category: "games",
    icon: Gamepad2,
    path: "/tools/number-flow",
    longDescription: `
                                                                    < article className = "prose prose-lg max-w-none" >
                                                                      <h2>Connect the Dots - Logic Edition </h2>
                                                                        < p > Number Flow is a minimalist puzzle game where you must connect matching numbers with continuous lines(pipes) without the lines crossing each other.It sounds easy, but you must also fill < em > every single square < /em> on the grid to solve the level.</p >
                                                                          </article>
                                                                            `,
    howToUse: [
      "Click/Tap on a colored number.",
      "Drag a line to its matching pair.",
      "Ensure lines do not cross.",
      "Fill the entire board to win."
    ],
    benefits: [
      "Enhances spatial reasoning.",
      "Calming, Zen-like gameplay.",
      "Hundreds of levels of increasing difficulty."
    ],
    faqs: []
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
                                                                          < article className = "prose prose-lg max-w-none" >
                                                                            <h2>Optimal Image Sizing for Web & Social Media </h2>
                                                                              < p > In the digital world, image size matters.Uploading a 4000px wide photo to a blog post that is only 800px wide is a waste of bandwidth and slows down your site.Our < strong > Free Image Resizer < /strong> allows you to perfectly scale your images for any platform without losing quality.</p >

                                                                                <h3>Why Resize Images ? </h3>
                                                                                  < ul >
                                                                                  <li><strong>Website Speed: </strong> Smaller dimensions mean smaller file sizes. This leads to faster page loads and better SEO scores (Core Web Vitals).</li >
                                                                                    <li><strong>Email Attachments: </strong> Most email providers limit attachments to 25MB. Resizing helps you fit more photos into a single email.</li >
                                                                                      <li><strong>Social Media Standards: </strong> Instagram, Facebook, and Twitter have specific aspect ratio requirements. Uploading the wrong size results in awkward cropping.</li >
                                                                                        </ul>

                                                                                        < h3 > Common Standard Sizes(Pixels) </h3>
                                                                                          < div className = "overflow-x-auto my-6" >
                                                                                            <table className="min-w-full bg-white border border-gray-300" >
                                                                                              <thead>
                                                                                              <tr className="bg-gray-100" >
                                                                                                <th className="py-2 px-4 border-b" > Platform </th>
                                                                                                  < th className = "py-2 px-4 border-b" > Recommended Size </th>
                                                                                                    </tr>
                                                                                                    </thead>
                                                                                                    < tbody >
                                                                                                    <tr><td className="py-2 px-4 border-b" > Instagram Post < /td><td className="py-2 px-4 border-b">1080 x 1080</td > </tr>
                                                                                                      < tr > <td className="py-2 px-4 border-b" > YouTube Thumbnail < /td><td className="py-2 px-4 border-b">1280 x 720</td > </tr>
                                                                                                        < tr > <td className="py-2 px-4 border-b" > Facebook Cover < /td><td className="py-2 px-4 border-b">820 x 312</td > </tr>
                                                                                                          < tr > <td className="py-2 px-4 border-b" > Full HD Wallpaper < /td><td className="py-2 px-4 border-b">1920 x 1080</td > </tr>
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
                                                                                                            < article className = "prose prose-lg max-w-none" >
                                                                                                              <h2>Convert Digital Text to Realistic Handwriting </h2>
                                                                                                                < p > Need to submit a handwritten assignment but running out of time ? Our < strong > Text to Handwriting Converter < /strong> transforms your typed notes into an image that looks like it was written with a pen on paper. Ideal for creating study notes, letters, or artistic projects.</p >

                                                                                                                  <h3>Customization Options </h3>
                                                                                                                    < p > To make the output convincing, you can tweak multiple variables: </p>
                                                                                                                      < ul >
                                                                                                                      <li><strong>Handwriting Style: </strong> Choose from 8+ different human handwriting fonts (messy, cursive, neat, block).</li >
                                                                                                                        <li><strong>Paper Type: </strong> Select lined paper, graph paper, or plain white background.</li >
                                                                                                                          <li><strong>Ink Color: </strong> Classic Blue, Black, Red, or custom colors.</li >
                                                                                                                            </ul>

                                                                                                                            < div className = "bg-red-50 dark:bg-red-900/20 p-6 rounded-lg my-6 border-l-4 border-red-500" >
                                                                                                                              <h4>🚫 Educational Integrity Warning </h4>
                                                                                                                                < p > This tool is designed for creative purposes and study aids.Please do not use it to deceive teachers or professors for assignments where manual handwriting is explicitly required for learning purposes.</p>
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
                                                                                                                                  < article className = "prose prose-lg max-w-none" >
                                                                                                                                  <h2>Test Your Clicking Speed(CPS Test) </h2>
                                                                                                                                    < p > The < strong > Clicks Per Second(CPS) < /strong> test is a popular challenge among gamers, especially those who play Minecraft (PvP), shooters, or MOBAs. It measures how fast you can click your mouse button in a given time frame.</p >

                                                                                                                                      <h3>Why Click Speed Matters in Gaming ? </h3>
                                                                                                                                        < p > In competitive gaming, higher CPS can mean the difference between winning and losing a duel.Techniques like "Jitter Clicking" or "Butterfly Clicking" are practiced by professionals to achieve speeds of 12 - 20 CPS.</p>

                                                                                                                                          < h3 > World Records </h3>
                                                                                                                                            < p > While the average human clicks about 6 - 7 times per second, elite gamers can reach speeds of over 14 CPS consistently.The world record varies by technique but sits around the 22 CPS mark.</p>
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
    path: "/tools/reaction-time-test",
    longDescription: `
                                                                                                                                              < article className = "prose prose-lg max-w-none" >
                                                                                                                                                <h2>Reflex Check: How Fast Are You ? </h2>
                                                                                                                                                  < p > Reaction time is the duration between a stimulus and your response.The average human visual reaction time is around 250 milliseconds(0.25 seconds).Professional F1 drivers and Esports athletes clock in closer to 150 - 180ms.</p>

                                                                                                                                                    < h3 > Factors Affecting Reaction Time </h3>
                                                                                                                                                      < ul >
                                                                                                                                                      <li><strong>Age: </strong> Reactions peak in your 20s.</li >
                                                                                                                                                        <li><strong>Fatigue: </strong> Being tired significantly slows you down.</li >
                                                                                                                                                          <li><strong>Hydration: </strong> Dehydration works like mild intoxication.</li >
                                                                                                                                                            </ul>
                                                                                                                                                            </article>
                                                                                                                                                              `,
    howToUse: [
      "Wait for the screen to turn GREEN.",
      "Click as fast as you can once it changes color.",
      "Do NOT click too early (false start).",
      "Repeat 5 times to get your average score."
    ],
    benefits: [
      "Benchmark your nervous system health.",
      "Compete for the lowest millisecond score.",
      "fun warm-up before gaming."
    ],
    faqs: []
  },
  {
    id: "memory-match-game",
    name: "Memory Match Game",
    subheading: "Train your brain",
    description: "Classic card matching game to improve your short-term memory and focus.",
    category: "games",
    icon: Brain,
    path: "/tools/memory-match-game",
    longDescription: `
                                                                                                                                                            < article className = "prose prose-lg max-w-none" >
                                                                                                                                                              <h2>Sharpen Your Focus </h2>
                                                                                                                                                                < p > Memory Match(also known as Concentration) is a timeless game where you must find pairs of matching cards.It forces you to hold visual information in your working memory, strengthening your short - term recall abilities.</p>
                                                                                                                                                                  </article>
                                                                                                                                                                    `,
    howToUse: [
      "Click a card to flip it over.",
      "Click another card to find its match.",
      "If they match, they stay face up.",
      "If they don't, remember their positions for next time!"
    ],
    benefits: [
      "Improves visual memory.",
      "Enhances concentration span.",
      "Great brain-training exercise for all ages."
    ],
    faqs: []
  },
  {
    id: "math-speed-challenge",
    name: "Math Speed Challenge",
    subheading: "Mental math practice",
    description: "Solve rapid-fire arithmetic problems against the clock. Great for students!",
    category: "games",
    icon: Calculator,
    path: "/tools/math-speed-challenge",
    longDescription: `
                                                                                                                                                                  < article className = "prose prose-lg max-w-none" >
                                                                                                                                                                    <h2>Mental Math Gymnastics </h2>
                                                                                                                                                                      < p > Ditch the calculator.The < strong > Math Speed Challenge < /strong> throws random arithmetic problems (Addition, Subtraction, Multiplication, Division) at you. Your goal? Solve as many as you can before time runs out.</p >

                                                                                                                                                                        <h3>Why Practice Mental Math ? </h3>
                                                                                                                                                                          < p > It strengthens your "number sense," helping you estimate costs, split bills, and catch errors in daily life without relying on a phone.</p>
                                                                                                                                                                            </article>
                                                                                                                                                                              `,
    howToUse: [
      "Select your difficulty (Easy/Medium/Hard).",
      "Read the problem (e.g., 15 + 7).",
      "Type the answer.",
      "Be quick! The timer is ticking."
    ],
    benefits: [
      "Boosts calculation speed.",
      "Improves numerical fluency.",
      "Keeps your brain sharp."
    ],
    faqs: []
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
                                                                                                                                                                            < article className = "prose prose-lg max-w-none" >
                                                                                                                                                                              <h2>Compress Images Without Losing Quality </h2>
                                                                                                                                                                                < p > A website with heavy images is a slow website.And slow websites lose visitors.Our < strong > Image Compressor < /strong> balances file size with image quality, often reducing file size by 70-90% with zero visible difference to the naked eye.</p >

                                                                                                                                                                                  <h3>Lossy vs.Lossless Compression </h3>
                                                                                                                                                                                    < p > We use smart compression algorithms to minimize file size: </p>
                                                                                                                                                                                      < ul >
                                                                                                                                                                                      <li><strong>Lossy Compression(JPG / WebP): </strong> Removes invisible data. Best for photographs. Highest savings.</li >
                                                                                                                                                                                        <li><strong>Lossless Compression(PNG): </strong> Compresses data without removing detail. Best for logos, screenshots, and text.</li >
                                                                                                                                                                                          </ul>

                                                                                                                                                                                          < h3 > SEO Impact </h3>
                                                                                                                                                                                            < p > Google has officially interpreted page speed as a ranking factor.Large images are the #1 cause of slow Largest Contentful Paint(LCP) scores.By compressing your images before upload, you directly improve your site's SEO.</p>
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
                                                                                                                                                                                              < article className = "prose prose-lg max-w-none" >
                                                                                                                                                                                                <h2>Talk to Your Documents with AI </h2>
                                                                                                                                                                                                < p > Gone are the days of scrolling endlessly through 100 - page documents to find one specific answer.With < strong > Chat with PDF < /strong>, you can upload any PDF document—be it a textbook, a legal contract, a research paper, or a user manual—and have a natural conversation with it.</p >

                                                                                                                                                                                                <h3>How It Works(The Magic of RAG) </h3>
                                                                                                                                                                                                  < p > This tool uses a technology called < strong > Retrieval Augmented Generation(RAG) < /strong>. When you ask a question:</p >
                                                                                                                                                                                                    <ol>
                                                                                                                                                                                                    <li>The AI scans your document for relevant paragraphs.</li>
                                                                                                                                                                                                      < li > It passes those paragraphs to a Large Language Model(like GPT - 4).</li>
                                                                                                                                                                                                        < li > The model answers your question using < em > only < /em> the information in your document, ensuring accuracy.</li >
                                                                                                                                                                                                          </ol>

                                                                                                                                                                                                          < div className = "bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg my-6 border-l-4 border-blue-500" >
                                                                                                                                                                                                            <h4>🔒 Data Privacy Guarantee </h4>
                                                                                                                                                                                                              < p > We understand that your documents may contain sensitive info. < strong > Your files are processed in ephemeral memory.< /strong> We do not store your PDFs on our servers after the session ends, and we do not use your data to train our models.</p >
                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                < h3 > Who Is This For ? </h3>
                                                                                                                                                                                                                  < ul >
                                                                                                                                                                                                                  <li><strong>Students : </strong> "Explain the key concepts in Chapter 3 in simple terms."</li >
                                                                                                                                                                                                                <li><strong>Lawyers: </strong> "What are the termination clauses in this contract?"</li >
                                                                                                                                                                                                                  <li><strong>Researchers: </strong> "Summarize the methodology section and list the limitations."</li >
                                                                                                                                                                                                                    <li><strong>Professionals: </strong> "Extract the quarterly revenue figures from this financial report."</li >
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
                                                                                                                                                                                                                      < article className = "prose prose-lg max-w-none" >
                                                                                                                                                                                                                        <h2>Turn Long PDFs into Executive Summaries in Seconds </h2>
                                                                                                                                                                                                                          < p > Information overload is real.Whether you are a student facing a mountain of papers or an executive with a stack of reports, our < strong > AI PDF Summarizer < /strong> cuts through the noise. It extracts the core ideas, main arguments, and crucial data points, presenting them in a clear, concise format.</p >

                                                                                                                                                                                                                            <h3>Summary Modes </h3>
                                                                                                                                                                                                                              < ul >
                                                                                                                                                                                                                              <li><strong>Bullet Points: </strong> Great for quick scanning. Lists key takeaways.</li >
                                                                                                                                                                                                                                <li><strong>Detailed Abstract: </strong> A cohesive paragraph summarizing the narrative.</li >
                                                                                                                                                                                                                                  <li><strong>Action Items: </strong> Extracts tasks and next steps (perfect for meeting minutes).</li >
                                                                                                                                                                                                                                    </ul>

                                                                                                                                                                                                                                    < h3 > Tips for Best Results </h3>
                                                                                                                                                                                                                                      < p > To get the highest quality summary, ensure your PDF has selectable text(not just images).Documents with clear headings and structure allow the AI to understand the hierarchy of information much better.</p>
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
                                                                                                                                                                                                                                        < article className = "prose prose-lg max-w-none" >
                                                                                                                                                                                                                                          <h2>Auto - Generate Quizzes from Your Study Materials </h2>
                                                                                                                                                                                                                                            < p > Active Recall is the #1 scientifically proven way to learn faster.Instead of checking reading, you should test yourself.Our < strong > PDF Quiz Generator < /strong> uses AI to create multiple-choice questions (MCQs), true/false questions, and flashcards directly from your textbooks or lecture slides.</p>

                                                                                                                                                                                                                                              < h3 > The Science of Active Recall </h3>
                                                                                                                                                                                                                                                < p > Testing yourself forces your brain to retrieve information, strengthening neural pathways.This tool automates the tedious process of creating flashcards, so you can spend 100 % of your time actually learning.</p>

                                                                                                                                                                                                                                                  < h3 > Perfect For: </h3>
                                                                                                                                                                                                                                                    < ul >
                                                                                                                                                                                                                                                    <li><strong>Exam Prep: </strong> Turn your syllabus into a mock exam.</li >
                                                                                                                                                                                                                                                      <li><strong>Teachers: </strong> Create quick pop quizzes for your class in minutes.</li >
                                                                                                                                                                                                                                                        <li><strong>Corporate Training: </strong> verify employees read the new policy handbook.</li >
                                                                                                                                                                                                                                                          </ul>
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
                                                                                                                                                                                                                                                          < article className = "prose prose-lg max-w-none" >
                                                                                                                                                                                                                                                            <h2>Instant Study Guides from Any Textbook </h2>
                                                                                                                                                                                                                                                              < p > Struggling to organize your notes ? Our < strong > PDF Study Notes Generator < /strong> transforms chaotic chapters into structured, easy-to-read study guides. It automatically identifies headings, key terms, definitions, and important dates, formatting them into a beautiful revision sheet.</p >

                                                                                                                                                                                                                                                                <h3>What You Get </h3>
                                                                                                                                                                                                                                                                  < ul >
                                                                                                                                                                                                                                                                  <li><strong>Key Concepts: </strong> A breakdown of the main topics.</li >
                                                                                                                                                                                                                                                                    <li><strong>Vocabulary List: </strong> Essential terms and their definitions.</li >
                                                                                                                                                                                                                                                                      <li><strong>Important Dates / Figures: </strong> Extracted timelines and people.</li >
                                                                                                                                                                                                                                                                        <li><strong>Summary Tables: </strong> Data organized for quick comparison.</li >
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
    path: "/tools/pdf-translator",
    longDescription: `
                                                                                                                                                                                                                                                                          < article className = "prose prose-lg max-w-none" >
                                                                                                                                                                                                                                                                            <h2>Break Language Barriers with AI PDF Translation </h2>
                                                                                                                                                                                                                                                                              < p > Need to read a research paper in Japanese ? Or a user manual in German ? Traditional copy - pasting into Google Translate destroys the document's layout. Our <strong>AI PDF Translator</strong> translates the text <em>in-place</em>, preserving your original formatting, images, and tables.</p>

                                                                                                                                                                                                                                                                                < h3 > Supported Languages </h3>
                                                                                                                                                                                                                                                                                  < p > We support over 50 + major languages including: </p>
                                                                                                                                                                                                                                                                                    < ul className = "grid grid-cols-2 md:grid-cols-3 gap-2" >
                                                                                                                                                                                                                                                                                      <li>🇺🇸 English </li>
                                                                                                                                                                                                                                                                                        <li>🇪🇸 Spanish </li>
                                                                                                                                                                                                                                                                                          <li>🇫🇷 French </li>
                                                                                                                                                                                                                                                                                            <li>🇩🇪 German </li>
                                                                                                                                                                                                                                                                                              <li>🇨🇳 Chinese(Mandarin) </li>
                                                                                                                                                                                                                                                                                                <li>🇮🇳 Hindi </li>
                                                                                                                                                                                                                                                                                                  <li>🇯🇵 Japanese </li>
                                                                                                                                                                                                                                                                                                    <li>🇷🇺 Russian </li>
                                                                                                                                                                                                                                                                                                      <li>...and many more.</li>
                                                                                                                                                                                                                                                                                                        </ul>

                                                                                                                                                                                                                                                                                                        < h3 > Why Use AI Translation ? </h3>
                                                                                                                                                                                                                                                                                                          < p > Unlike simple word -for-word substitution, our Neural Machine Translation(NMT) models understand context, idioms, and technical jargon, ensuring that the translated document reads naturally.</p>
                                                                                                                                                                                                                                                                                                            </article>
                                                                                                                                                                                                                                                                                                              `,
    howToUse: [
      "Upload your PDF file.",
      "Select the 'Source Language' (or use Auto-Detect).",
      "Select the 'Target Language'.",
      "Click 'Translate'.",
      "Download your new, localized PDF."
    ],
    benefits: [
      "Preserves original layout and formatting.",
      "High accuracy for technical documents.",
      "Translate entire books in minutes.",
      "Secure and private."
    ],
    faqs: [
      {
        question: "Is it perfect?",
        answer: "AI translation is incredibly good (95%+ accuracy), but legal or safety-critical documents should always be reviewed by a human professional."
      }
    ]
  },
  {
    id: "thumbnail-generator",
    name: "AI Thumbnail Generator",
    subheading: "Create viral YouTube thumbnails",
    description: "Generate high-CTR thumbnails with AI. Remove backgrounds, add neon text, and use MrBeast-style effects.",
    category: "ai",
    icon: Sparkles,
    path: "/tools/thumbnail-generator"
  },
  {
    id: "video-editor",
    name: "Online Video Editor",
    subheading: "Edit videos in browser",
    description: "Trim, cut, and edit videos directly in your browser without watermarks.",
    category: "editor",
    icon: Video,
    path: "/tools/video-editor"
  },
  {
    id: "text-to-video",
    name: "AI Text to Video",
    subheading: "Turn text into video",
    description: "Generate engaging videos from simple text prompts using AI.",
    category: "ai",
    icon: Bot,
    path: "/tools/text-to-video"
  },
  {
    id: "ai-image-editor",
    name: "AI Image Editor",
    subheading: "Edit images with AI",
    description: "Magic erase, background removal, and smart enhancement tools powered by AI.",
    category: "ai",
    icon: Image,
    path: "/tools/ai-image-editor"
  },
  {
    id: "ai-website-generator",
    name: "AI Website Generator",
    subheading: "Build websites in seconds",
    description: "Generate full landing pages and websites from a single prompt.",
    category: "ai",
    icon: Globe,
    path: "/tools/ai-website-generator"
  },
  {
    id: "ai-tool-generator",
    name: "AI Tool Generator",
    subheading: "Create your own tools",
    description: "Describe a tool and let AI build it for you instantly.",
    category: "ai",
    icon: Code,
    path: "/tools/ai-tool-generator"
  },
  {
    id: "chat-with-pdf",
    name: "Chat with PDF",
    subheading: "Talk to your documents",
    description: "Upload a PDF and ask questions, summarize, or extract data using AI.",
    category: "ai",
    icon: MessageSquare,
    path: "/tools/chat-with-pdf"
  },


  {
    id: "ai-caption-generator",
    name: "AI Caption Generator",
    subheading: "Viral social media captions",
    description: "Generate engaging captions for Instagram, TikTok, and YouTube with AI.",
    category: "ai",
    icon: MessageSquare,
    path: "/tools/ai-caption-generator"
  },
  {
    id: "ai-hashtag-generator",
    name: "AI Hashtag Generator",
    subheading: "Find trending hashtags",
    description: "Boost your reach with intelligent, trending hashtag suggestions.",
    category: "ai",
    icon: Hash,
    path: "/tools/ai-hashtag-generator"
  },
  {
    id: "ai-reel-script-generator",
    name: "AI Reel Script Generator",
    subheading: "Video scripts in seconds",
    description: "Generate viral scripts for Reels, Shorts, and TikTok videos.",
    category: "ai",
    icon: Video,
    path: "/tools/ai-reel-script-generator"
  },
  {
    id: "ai-thumbnail-text-generator",
    name: "AI Thumbnail Text Gen",
    subheading: "Catchy thumbnail text",
    description: "Brainstorm high-CTR text overlays for your YouTube thumbnails.",
    category: "ai",
    icon: Type,
    path: "/tools/ai-thumbnail-text-generator"
  },
  {
    id: "ai-bio-generator",
    name: "AI Bio Generator",
    subheading: "Perfect your profile",
    description: "Create professional or creative bios for Instagram, LinkedIn, and Twitter.",
    category: "ai",
    icon: UserCircle,
    path: "/tools/ai-bio-generator"
  },
  // Versus Tools
  {
    id: "tech-versus",
    name: "Tech Battle Arena",
    subheading: "Compare Gadgets Instantly",
    description: "Compare smartphones, laptops, and gadgets side-by-side using AI.",
    category: "analyzer",
    icon: Smartphone,
    path: "/tools/tech-versus"
  },
  {
    id: "software-versus",
    name: "Software Showdown",
    subheading: "Compare Apps & SaaS",
    description: "Compare software pricing, features, and reviews.",
    category: "analyzer",
    icon: AppWindow,
    path: "/tools/software-versus"
  },
  {
    id: "nutrition-versus",
    name: "Food Fight",
    subheading: "Nutrition Comparator",
    description: "Compare calories, macros, and health benefits of foods.",
    category: "analyzer",
    icon: Apple,
    path: "/tools/nutrition-versus"
  },

];

export const categories = allCategories;

export const tools = allTools;
