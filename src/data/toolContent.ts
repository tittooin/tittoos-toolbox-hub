export function getToolContent(pathname: string): string | undefined {
  const map: Record<string, string> = {
    '/tools/pdf-converter': `
      <h2>What This Tool Does</h2>
      <p>Convert documents to and from PDF quickly. Supports merging, compressing, and converting common formats like DOCX, PPTX, and images.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Turn Word or PowerPoint files into shareable PDFs.</li>
        <li>Compress large PDFs for email or uploads.</li>
        <li>Combine multiple PDFs into a single file.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Upload your file or drop it into the area.</li>
        <li>Choose the target format and options.</li>
        <li>Click Convert and download the result.</li>
      </ol>
    `,
    '/tools/image-converter': `
      <h2>What This Tool Does</h2>
      <p>Convert images between formats (PNG, JPG, WEBP) and adjust quality to optimize size without losing clarity.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Compress images for faster website loading.</li>
        <li>Convert screenshots to JPG or WEBP for sharing.</li>
        <li>Prepare assets for social media or blog posts.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Upload an image.</li>
        <li>Select output format and quality.</li>
        <li>Download the optimized image.</li>
      </ol>
    `,
    '/tools/video-converter': `
      <h2>What This Tool Does</h2>
      <p>Convert videos to common formats (MP4, WEBM) with options for resolution and bitrate to balance quality and size.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Prepare videos for web uploads or email.</li>
        <li>Reduce file size for mobile viewing.</li>
        <li>Standardize formats for editing tools.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Upload a video file.</li>
        <li>Choose format and quality settings.</li>
        <li>Convert and download your video.</li>
      </ol>
    `,
    '/tools/audio-converter': `
      <h2>What This Tool Does</h2>
      <p>Convert audio tracks to MP3, WAV, or M4A, and adjust bitrate for music, podcasts, or voice notes.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Make audio compatible with players or editors.</li>
        <li>Shrink file size for faster sharing.</li>
        <li>Convert voice notes to MP3 for distribution.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Upload an audio file.</li>
        <li>Select target format and bitrate.</li>
        <li>Download the converted track.</li>
      </ol>
    `,
    '/tools/unit-converter': `
      <h2>What This Tool Does</h2>
      <p>Convert units across length, weight, temperature, volume, and more with accurate results.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Quickly convert metric to imperial and back.</li>
        <li>Compare measurements for DIY projects.</li>
        <li>Check scientific units when studying or coding.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Select a category and units.</li>
        <li>Enter a value.</li>
        <li>Get the converted result instantly.</li>
      </ol>
    `,
    '/tools/currency-converter': `
      <h2>What This Tool Does</h2>
      <p>Convert currencies using real-time rates to plan purchases, travel budgets, or online sales.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Check exchange rates before buying online.</li>
        <li>Plan travel costs across different currencies.</li>
        <li>Estimate revenue in your local currency.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Choose source and target currencies.</li>
        <li>Enter an amount.</li>
        <li>View the converted total instantly.</li>
      </ol>
    `,
    '/tools/temperature-converter': `
      <h2>What This Tool Does</h2>
      <p>Convert temperature values between Celsius, Fahrenheit, and Kelvin for weather, cooking, or science.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Understand foreign weather reports.</li>
        <li>Adjust oven settings between units.</li>
        <li>Study physics with consistent units.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Select input and output units.</li>
        <li>Enter temperature.</li>
        <li>Get an instant conversion.</li>
      </ol>
    `,
    '/tools/base64-converter': `
      <h2>What This Tool Does</h2>
      <p>Encode and decode Base64 strings for images, text, or data transfer in web development.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Embed small images into CSS or HTML.</li>
        <li>Decode API responses for debugging.</li>
        <li>Transfer data safely between systems.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Paste text or select a file.</li>
        <li>Choose encode or decode.</li>
        <li>Copy the result for use.</li>
      </ol>
    `,
    '/tools/timestamp-converter': `
      <h2>What This Tool Does</h2>
      <p>Convert Unix timestamps to human-readable dates and back for logs, analytics, and scheduling.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Debug backend logs and events.</li>
        <li>Display user-friendly dates in apps.</li>
        <li>Schedule tasks using epoch times.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Paste a timestamp or date.</li>
        <li>Select direction (to date or to timestamp).</li>
        <li>Copy the formatted output.</li>
      </ol>
    `,
    '/tools/password-generator': `
      <h2>What This Tool Does</h2>
      <p>Create secure, random passwords with custom length and character sets to protect accounts.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Generate strong passwords for new accounts.</li>
        <li>Create passphrases for password managers.</li>
        <li>Rotate credentials regularly.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Choose length and character options.</li>
        <li>Generate and copy your password.</li>
        <li>Store it in a secure manager.</li>
      </ol>
    `,
    '/tools/qr-generator': `
      <h2>What This Tool Does</h2>
      <p>Create QR codes for URLs, text, or contact details and download them for print or digital use.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Share links via posters or flyers.</li>
        <li>Create Wi‑Fi or contact QR codes.</li>
        <li>Embed codes in product packaging.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Enter the content.</li>
        <li>Customize size and margin.</li>
        <li>Download as PNG or SVG.</li>
      </ol>
    `,
    '/tools/uuid-generator': `
      <h2>What This Tool Does</h2>
      <p>Generate UUIDs (v4) for unique identifiers in apps, databases, and integrations.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Create unique IDs for records or sessions.</li>
        <li>Tag assets and files reliably.</li>
        <li>Use in distributed systems without collisions.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Click Generate to create a new UUID.</li>
        <li>Copy or export as needed.</li>
      </ol>
    `,
    '/tools/lorem-generator': `
      <h2>What This Tool Does</h2>
      <p>Generate placeholder text (Lorem Ipsum) for designs, mockups, and prototypes with custom lengths.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Fill layouts while content is pending.</li>
        <li>Prototype UI without distractions.</li>
        <li>Test font and spacing styles.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Choose paragraph or word count.</li>
        <li>Generate and copy to clipboard.</li>
      </ol>
    `,
    '/tools/hash-generator': `
      <h2>What This Tool Does</h2>
      <p>Create cryptographic hashes (e.g., SHA‑256, MD5) of text or files for integrity checks and comparisons.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Verify downloads against checksums.</li>
        <li>Fingerprint content in workflows.</li>
        <li>Compare data without exposing plaintext.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Enter text or upload a file.</li>
        <li>Select the hashing algorithm.</li>
        <li>Copy the computed hash.</li>
      </ol>
    `,
    '/tools/barcode-generator': `
      <h2>What This Tool Does</h2>
      <p>Create barcodes (e.g., Code128, EAN‑13) from text or numbers for products, tickets, and inventory.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Generate product or ticket barcodes.</li>
        <li>Label items for scanning in stores.</li>
        <li>Prototype scannable assets for apps.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Enter the value and type.</li>
        <li>Generate and preview the barcode.</li>
        <li>Download for print or digital use.</li>
      </ol>
    `,
    '/tools/seo-analyzer': `
      <h2>What This Tool Does</h2>
      <p>Analyze on‑page SEO signals including titles, meta tags, headings, links, and performance hints.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Audit pages before publishing.</li>
        <li>Spot missing meta tags or broken links.</li>
        <li>Plan improvements for rankings.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Enter a page URL.</li>
        <li>Run the analysis.</li>
        <li>Follow the improvement checklist.</li>
      </ol>
    `,
    '/tools/website-analyzer': `
      <h2>What This Tool Does</h2>
      <p>Inspect performance, security headers, and tech stack to understand how a site is built and performs.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Benchmark competing sites.</li>
        <li>Check basic security configurations.</li>
        <li>Discover frameworks and libraries used.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Enter a URL.</li>
        <li>Run checks and review results.</li>
        <li>Export insights for your team.</li>
      </ol>
    `,
    '/tools/website-speed-checker': `
      <h2>What This Tool Does</h2>
      <p>Measure site speed and loading metrics with tips to improve Core Web Vitals.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Check performance before launches.</li>
        <li>Find slow resources and bottlenecks.</li>
        <li>Monitor improvements over time.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Enter a URL and start the test.</li>
        <li>Review metrics and suggestions.</li>
        <li>Apply optimizations and retest.</li>
      </ol>
    `,
    '/tools/text-analyzer': `
      <h2>What This Tool Does</h2>
      <p>Analyze text for readability, sentiment, and keyword density to refine content quality.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Improve blog readability scores.</li>
        <li>Measure sentiment in feedback.</li>
        <li>Balance keywords for SEO.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Paste text.</li>
        <li>Select analyses to run.</li>
        <li>Review results and edit text.</li>
      </ol>
    `,
    '/tools/color-analyzer': `
      <h2>What This Tool Does</h2>
      <p>Extract color palettes and contrast ratios from images or hex values for accessible design.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Create accessible color schemes.</li>
        <li>Pick brand colors from images.</li>
        <li>Check contrast for WCAG compliance.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Upload an image or enter a color.</li>
        <li>View palette and contrast scores.</li>
        <li>Copy hex codes to use in designs.</li>
      </ol>
    `,
    '/tools/image-analyzer': `
      <h2>What This Tool Does</h2>
      <p>Inspect images for resolution, metadata, and dominant colors to prepare assets for web or print.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Check image quality before publishing.</li>
        <li>Strip or review EXIF metadata.</li>
        <li>Extract colors for branding.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Upload an image.</li>
        <li>Review metadata and analysis.</li>
        <li>Export details for documentation.</li>
      </ol>
    `,
    '/tools/color-picker': `
      <h2>What This Tool Does</h2>
      <p>Pick colors and generate palettes, shades, and tints for consistent design systems.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Create brand palettes.</li>
        <li>Choose accessible color combos.</li>
        <li>Preview UI themes quickly.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Pick a base color.</li>
        <li>Copy hex, RGB, or HSL values.</li>
        <li>Save palettes for reuse.</li>
      </ol>
    `,
    '/tools/text-editor': `
      <h2>What This Tool Does</h2>
      <p>Edit, format, and search text with handy utilities like case conversion and whitespace control.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Clean up pasted content.</li>
        <li>Prepare snippets for publishing.</li>
        <li>Batch edit text quickly.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Paste text into the editor.</li>
        <li>Apply formatting operations.</li>
        <li>Copy the refined output.</li>
      </ol>
    `,
    '/tools/json-editor': `
      <h2>What This Tool Does</h2>
      <p>Edit and validate JSON with real-time errors and formatting for APIs and configs.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Fix JSON payloads for APIs.</li>
        <li>Format configs for readability.</li>
        <li>Spot syntax issues quickly.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Paste JSON.</li>
        <li>Fix errors and format.</li>
        <li>Copy valid JSON.</li>
      </ol>
    `,
    '/tools/csv-editor': `
      <h2>What This Tool Does</h2>
      <p>View and edit CSV data with sorting, filtering, and export for reports or imports.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Clean data before importing.</li>
        <li>Build small datasets for tests.</li>
        <li>Quickly inspect spreadsheet rows.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Upload or paste CSV.</li>
        <li>Edit cells and filter rows.</li>
        <li>Export the updated file.</li>
      </ol>
    `,
    '/tools/html-editor': `
      <h2>What This Tool Does</h2>
      <p>Edit HTML with syntax highlighting and preview changes for landing pages or snippets.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Prototype sections for websites.</li>
        <li>Fix small HTML issues.</li>
        <li>Teach basics with live preview.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Paste HTML.</li>
        <li>Edit structure and classes.</li>
        <li>Preview and copy.</li>
      </ol>
    `,
    '/tools/css-editor': `
      <h2>What This Tool Does</h2>
      <p>Edit CSS styling, try variables, and test responsive layouts with quick tweaks.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Experiment with design tokens.</li>
        <li>Debug layout glitches.</li>
        <li>Prototype animations and effects.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Paste CSS rules.</li>
        <li>Adjust properties and selectors.</li>
        <li>Copy styles to your project.</li>
      </ol>
    `,
    '/tools/markdown-editor': `
      <h2>What This Tool Does</h2>
      <p>Write and preview Markdown for docs, READMEs, and blog posts with live rendering.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Draft README files.</li>
        <li>Compose blog posts quickly.</li>
        <li>Share notes with formatting.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Write Markdown in the editor.</li>
        <li>Preview and refine content.</li>
        <li>Export or copy the text.</li>
      </ol>
    `,
    '/tools/image-background-remover': `
      <h2>What This Tool Does</h2>
      <p>Remove backgrounds from images using AI for clean, professional results ready for web and print.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Create product photos with transparent backgrounds.</li>
        <li>Prepare profile pictures and thumbnails.</li>
        <li>Isolate subjects for marketing assets.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Upload one or more images.</li>
        <li>Run background removal (single or batch).</li>
        <li>Download the processed PNGs.</li>
      </ol>
    `,
    '/tools/ai-image-editor': `
      <h2>What This Tool Does</h2>
      <p>Edit images with AI enhancements like background removal, sharpening, and color adjustments.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Create clean product photos.</li>
        <li>Enhance social media images.</li>
        <li>Prepare visuals for presentations.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Upload an image.</li>
        <li>Apply AI edits and fine-tune.</li>
        <li>Download the result.</li>
      </ol>
    `,
    '/tools/video-editor': `
      <h2>What This Tool Does</h2>
      <p>Trim, crop, and adjust video properties for quick edits without heavy software.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Create short clips for social media.</li>
        <li>Remove unwanted sections.</li>
        <li>Adjust resolution for platforms.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Upload a video.</li>
        <li>Apply edits and preview.</li>
        <li>Export the final cut.</li>
      </ol>
    `,
    '/tools/calculator': `
      <h2>What This Tool Does</h2>
      <p>Perform basic arithmetic and quick calculations with a clean, easy interface.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Add, subtract, multiply, and divide numbers.</li>
        <li>Make quick percentage and decimal calculations.</li>
        <li>Check totals while budgeting or planning.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Enter numbers using the keypad.</li>
        <li>Select an operation (+, −, ×, ÷).</li>
        <li>Press equals to view the result.</li>
      </ol>
    `,
    '/tools/percentage-calculator': `
      <h2>What This Tool Does</h2>
      <p>Calculate percentages, increases/decreases, and find values before or after change.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Compute discounts and markups.</li>
        <li>Find percentage change between values.</li>
        <li>Determine what percent X is of Y.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Enter the base value and percentage.</li>
        <li>Choose the calculation type.</li>
        <li>View and copy the result.</li>
      </ol>
    `,
    '/tools/bmi-calculator': `
      <h2>What This Tool Does</h2>
      <p>Calculate Body Mass Index (BMI) from height and weight in metric or imperial units.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Track fitness progress over time.</li>
        <li>Understand BMI category ranges.</li>
        <li>Compare metrics across unit systems.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Select unit system (metric or imperial).</li>
        <li>Enter height and weight values.</li>
        <li>Calculate BMI and review category.</li>
      </ol>
    `,
    '/tools/loan-calculator': `
      <h2>What This Tool Does</h2>
      <p>Estimate monthly payments and total interest for loans using standard amortization.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Plan mortgages, auto loans, or personal loans.</li>
        <li>Compare terms and interest rates.</li>
        <li>Forecast total cost of borrowing.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Enter principal, annual rate, and term.</li>
        <li>Run the calculation.</li>
        <li>Review monthly payment and total interest.</li>
      </ol>
    `,
    '/tools/age-calculator': `
      <h2>What This Tool Does</h2>
      <p>Calculate precise age between two dates in years, months, days, and totals.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Find exact age for forms or events.</li>
        <li>Compute time spans for records.</li>
        <li>Track milestones and anniversaries.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Select birth date and target date.</li>
        <li>Run the calculation.</li>
        <li>Review detailed age breakdown.</li>
      </ol>
    `,
    '/tools/json-formatter': `
      <h2>What This Tool Does</h2>
      <p>Format and beautify JSON with indentation, sorting, and validation for clean output.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Prepare JSON for documentation.</li>
        <li>Debug API responses.</li>
        <li>Make configs readable in reviews.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Paste raw JSON.</li>
        <li>Format and validate.</li>
        <li>Copy the result.</li>
      </ol>
    `,
    '/tools/xml-formatter': `
      <h2>What This Tool Does</h2>
      <p>Format XML for readability and highlight errors to fix broken markup fast.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Clean up XML feeds or sitemaps.</li>
        <li>Fix malformed tags.</li>
        <li>Review configs with teams.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Paste XML.</li>
        <li>Format and review structure.</li>
        <li>Copy the improved markup.</li>
      </ol>
    `,
    '/tools/sql-formatter': `
      <h2>What This Tool Does</h2>
      <p>Format SQL queries for readability with consistent casing and indentation to reduce mistakes.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Clean queries for code reviews.</li>
        <li>Understand complex joins and CTEs.</li>
        <li>Teach SQL with readable examples.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Paste SQL.</li>
        <li>Format and inspect.</li>
        <li>Copy the final query.</li>
      </ol>
    `,
    '/tools/html-formatter': `
      <h2>What This Tool Does</h2>
      <p>Format HTML markup with clean indentation and structure for maintainable templates.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Refactor HTML snippets.</li>
        <li>Improve readability in tutorials.</li>
        <li>Prepare code samples for posts.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Paste HTML.</li>
        <li>Format and preview.</li>
        <li>Copy for deployment.</li>
      </ol>
    `,
    '/tools/css-formatter': `
      <h2>What This Tool Does</h2>
      <p>Format CSS rules and organize properties to keep stylesheets consistent and easy to scan.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Clean styles for production.</li>
        <li>Prepare examples for blogs.</li>
        <li>Standardize team conventions.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Paste CSS.</li>
        <li>Format and review.</li>
        <li>Copy the result.</li>
      </ol>
    `,
    '/tools/url-encoder': `
      <h2>What This Tool Does</h2>
      <p>Encode and decode URLs to safely include parameters and special characters in links.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Create safe query strings.</li>
        <li>Debug redirects and callbacks.</li>
        <li>Fix broken links with special chars.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Paste a URL.</li>
        <li>Encode or decode as needed.</li>
        <li>Copy the cleaned link.</li>
      </ol>
    `,
    '/tools/text-to-image': `
      <h2>What This Tool Does</h2>
      <p>Generate images from text prompts using AI models with style and size settings.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Create concept art and thumbnails.</li>
        <li>Illustrate blog posts rapidly.</li>
        <li>Prototype branding ideas.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Write a descriptive prompt.</li>
        <li>Select style and size.</li>
        <li>Generate and download images.</li>
      </ol>
    `,
    '/tools/text-to-video': `
      <h2>What This Tool Does</h2>
      <p>Create simple video clips from text prompts with motion templates and overlays.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Generate social media shorts.</li>
        <li>Visualize ideas quickly.</li>
        <li>Create intros and placeholders.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Enter a prompt.</li>
        <li>Pick a motion template.</li>
        <li>Export the video clip.</li>
      </ol>
    `,
    '/tools/ai-prompt-assistant': `
      <h2>What This Tool Does</h2>
      <p>Draft and refine AI prompts with structure, constraints, and examples for better outputs.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Write prompts for coding assistants.</li>
        <li>Prepare briefs for image generation.</li>
        <li>Standardize internal prompt templates.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Describe your goal.</li>
        <li>Add constraints and examples.</li>
        <li>Copy the final prompt.</li>
      </ol>
    `,
    '/tools/ai-website-generator': `
      <h2>What This Tool Does</h2>
      <p>Generate simple website layouts and copy from a brief with sections ready to export.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Mock landing pages for ideas.</li>
        <li>Draft content structure quickly.</li>
        <li>Create prototypes for clients.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Write a short brief.</li>
        <li>Generate sections and refine.</li>
        <li>Export HTML as needed.</li>
      </ol>
    `,
    '/tools/ai-tool-generator': `
      <h2>What This Tool Does</h2>
      <p>Generate ideas and scaffolding for small AI tools from descriptions and constraints.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Brainstorm MVP features.</li>
        <li>Draft inputs/outputs for tools.</li>
        <li>Outline basic UI flows.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Describe the tool concept.</li>
        <li>Choose target users and scope.</li>
        <li>Generate and export the plan.</li>
      </ol>
    `,
    '/tools/youtube-downloader': `
      <h2>What This Tool Does</h2>
      <p>Download videos in available formats and resolutions for offline viewing. Use responsibly and respect platform terms.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Save tutorials for offline study.</li>
        <li>Archive your own content.</li>
        <li>Prepare clips for educational use.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Paste the video URL.</li>
        <li>Select format/resolution.</li>
        <li>Download the file.</li>
      </ol>
    `,
    '/tools/facebook-downloader': `
      <h2>What This Tool Does</h2>
      <p>Download videos from public posts where permissible. Only download content you own or have rights to.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Backup your published videos.</li>
        <li>Save educational material.</li>
        <li>Review content offline.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Paste a post URL.</li>
        <li>Choose format and quality.</li>
        <li>Download responsibly.</li>
      </ol>
    `,
    '/tools/twitter-downloader': `
      <h2>What This Tool Does</h2>
      <p>Download media from public tweets where allowed. Respect creators and platform rules.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Save your own posted clips.</li>
        <li>Collect references for research.</li>
        <li>Archive campaign materials.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Enter a tweet URL.</li>
        <li>Select available quality.</li>
        <li>Download media.</li>
      </ol>
    `,
    '/tools/linkedin-downloader': `
      <h2>What This Tool Does</h2>
      <p>Download videos from public LinkedIn posts for legitimate purposes. Follow platform terms.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Archive corporate posts you own.</li>
        <li>Collect training resources.</li>
        <li>Prepare offline presentations.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Paste a LinkedIn post URL.</li>
        <li>Choose format.</li>
        <li>Download the result.</li>
      </ol>
    `,
    '/tools/ocr-converter': `
      <h2>What This Tool Does</h2>
      <p>Extract text from images and PDFs using OCR to edit and search content easily.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Digitize printed documents.</li>
        <li>Copy text from screenshots.</li>
        <li>Make scanned PDFs searchable.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Upload an image or PDF.</li>
        <li>Run OCR.</li>
        <li>Copy or export the text.</li>
      </ol>
    `,
    '/tools/resume-builder': `
      <h2>What This Tool Does</h2>
      <p>Create polished resumes from templates with sections for skills, experience, and education.</p>
      <h3>Popular Use Cases</h3>
      <ul>
        <li>Draft resumes quickly.</li>
        <li>Tailor sections for each role.</li>
        <li>Export PDF for applications.</li>
      </ul>
      <h3>Quick Tutorial</h3>
      <ol>
        <li>Choose a template.</li>
        <li>Fill in your details.</li>
        <li>Download the finished resume.</li>
      </ol>
    `,
  };

  return map[pathname];
}