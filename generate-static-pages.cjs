// generate-static-pages.cjs
const fs = require('fs');
const path = require('path');

const baseUrl = process.env.SITEMAP_BASE_URL || "https://axevora.com/";
const distDir = path.join(__dirname, 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error("❌ Error: dist/index.html not found. Run 'npm run build' first.");
  process.exit(1);
}

const template = fs.readFileSync(indexHtmlPath, 'utf8');

const appFile = path.join(__dirname, "src", "App.tsx");
const toolsDataFile = path.join(__dirname, "src", "data", "tools.ts");
const blogPostsDir = path.join(__dirname, "src", "pages", "blog-posts");
const blogsDataFile = path.join(__dirname, "src", "data", "blogs.ts");
const generatedBlogsFile = path.join(__dirname, "src", "data", "generated_blogs.json");
const authorsDataFile = path.join(__dirname, "src", "data", "authors.ts");

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function stripHtml(str) {
  if (!str) return '';
  return String(str).replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
}

// ---------------- Route Extraction ----------------
function extractRoutesFromApp() {
  try {
    const content = fs.readFileSync(appFile, "utf8");
    const routeRegex = /path\s*=\s*["'`](\/[^"']+?)["'`]/g;
    const redirectAliases = new Set([
      "/tools/merge-pdf",
      "/tools/split-pdf",
      "/tools/compress-pdf",
      "/all-tools",
      "/tools/base64-encoder"
    ]);
    const routes = [];
    let match;
    while ((match = routeRegex.exec(content)) !== null) {
      const p = match[1];
      if (!p || p === "*" || p.includes(":")) continue;
      if (redirectAliases.has(p)) continue;
      if (p.startsWith("/admin")) continue;
      if (p.startsWith("/apps") && !p.includes("privacy")) continue;
      routes.push(p);
    }
    return routes;
  } catch (err) {
    console.error("extractRoutesFromApp error:", err);
    return [];
  }
}

function extractToolPaths() {
  try {
    const content = fs.readFileSync(toolsDataFile, "utf8");
    const regex = /path\s*:\s*["'`](\/tools\/[^"'`]+|\/[^"'`]+-online)["'`]/g;
    const paths = [];
    let m;
    while ((m = regex.exec(content)) !== null) {
      paths.push(m[1]);
    }
    return paths;
  } catch {
    return [];
  }
}

function extractBlogCategoryRoutes() {
  try {
    const files = fs.readdirSync(blogPostsDir).filter((f) => f.endsWith(".tsx"));
    return files.map((f) => `/blog-posts/${path.basename(f, ".tsx")}`);
  } catch {
    return [];
  }
}

function extractBlogSlugRoutes() {
  try {
    const content = fs.readFileSync(blogsDataFile, "utf8");
    const slugRegex = /slug\s*:\s*["'`]([^"'`]+)["'`]/g;
    const routes = [];
    let m;
    while ((m = slugRegex.exec(content)) !== null) {
      const slug = m[1];
      if (slug && slug.length > 0 && slug !== "string;") {
        routes.push(`/blog/${slug}`);
      }
    }
    return routes;
  } catch {
    return [];
  }
}

function extractGeneratedBlogRoutes() {
  try {
    if (!fs.existsSync(generatedBlogsFile)) return [];
    const content = fs.readFileSync(generatedBlogsFile, "utf8");
    const blogs = JSON.parse(content);
    if (Array.isArray(blogs)) {
      return blogs.map(blog => `/blog/${blog.slug}`);
    }
    return [];
  } catch (e) {
    return [];
  }
}

function extractAuthorSlugRoutes() {
  try {
    const content = fs.readFileSync(authorsDataFile, "utf8");
    const slugRegex = /slug\s*:\s*["'`]([^"'`]+)["'`]/g;
    const routes = [];
    let m;
    while ((m = slugRegex.exec(content)) !== null) {
      const slug = m[1];
      if (slug && slug.length > 0) {
        routes.push(`/author/${slug}`);
      }
    }
    return routes;
  } catch {
    return [];
  }
}

// ---------------- Content Parsers ----------------
function parseAllTools() {
  const content = fs.readFileSync(toolsDataFile, 'utf8');
  const tools = [];
  const startIndex = content.indexOf('export const allTools = [');
  if (startIndex === -1) return [];
  
  const arrayContent = content.substring(startIndex);
  const toolBlocks = arrayContent.split(/\n\s*\{\s*\n\s*id:/);
  
  for (let i = 1; i < toolBlocks.length; i++) {
    const block = 'id:' + toolBlocks[i];
    const idMatch = block.match(/id:\s*"([^"]+)"/);
    const nameMatch = block.match(/name:\s*"([^"]+)"/);
    const subMatch = block.match(/subheading:\s*"([^"]+)"/);
    const descMatch = block.match(/description:\s*"([^"]+)"/);
    const catMatch = block.match(/category:\s*"([^"]+)"/);
    const pathMatch = block.match(/path:\s*"([^"]+)"/);
    
    const faqs = [];
    const faqSection = block.match(/faqs:\s*\[([\s\S]*?)\]/);
    if (faqSection) {
      const qRegex = /question:\s*"([^"]+)",[\s\S]*?answer:\s*"([^"]+)"/g;
      let qm;
      while ((qm = qRegex.exec(faqSection[1])) !== null) {
        faqs.push({ question: qm[1], answer: qm[2] });
      }
    }
    
    const howToUse = [];
    const howToSection = block.match(/howToUse:\s*\[([\s\S]*?)\]/);
    if (howToSection) {
      const stepRegex = /"([^"]+)"/g;
      let sm;
      while ((sm = stepRegex.exec(howToSection[1])) !== null) {
        howToUse.push(sm[1]);
      }
    }

    const benefits = [];
    const benefitSection = block.match(/benefits:\s*\[([\s\S]*?)\]/);
    if (benefitSection) {
      const bRegex = /"([^"]+)"/g;
      let bm;
      while ((bm = bRegex.exec(benefitSection[1])) !== null) {
        benefits.push(bm[1]);
      }
    }

    if (idMatch && pathMatch) {
      tools.push({
        id: idMatch[1],
        name: nameMatch ? nameMatch[1] : idMatch[1],
        subheading: subMatch ? subMatch[1] : '',
        description: descMatch ? descMatch[1] : '',
        category: catMatch ? catMatch[1] : 'tools',
        path: pathMatch[1],
        faqs,
        howToUse,
        benefits
      });
    }
  }
  return tools;
}

function parseAllBlogs() {
  const blogs = [];
  const content = fs.readFileSync(blogsDataFile, 'utf8');
  const startIndex = content.indexOf('export const DEFAULT_BLOG_POSTS');
  if (startIndex !== -1) {
    const blocks = content.substring(startIndex).split(/\n\s*\{\s*\n\s*id:/);
    for (let i = 1; i < blocks.length; i++) {
      const b = 'id:' + blocks[i];
      const titleMatch = b.match(/title:\s*"([^"]+)"/);
      const slugMatch = b.match(/slug:\s*"([^"]+)"/);
      const excerptMatch = b.match(/excerpt:\s*(?:"([^"]+)"|`([^`]+)`)/);
      const descMatch = b.match(/metaDescription:\s*"([^"]+)"/);
      const dateMatch = b.match(/date:\s*"([^"]+)"/);
      const authorMatch = b.match(/author:\s*"([^"]+)"/);
      const imgMatch = b.match(/image:\s*"([^"]+)"/);

      if (slugMatch && titleMatch && slugMatch[1] !== 'string;') {
        blogs.push({
          title: titleMatch[1],
          slug: slugMatch[1],
          excerpt: excerptMatch ? (excerptMatch[1] || excerptMatch[2] || '').trim() : '',
          metaDescription: descMatch ? descMatch[1] : (excerptMatch ? (excerptMatch[1] || excerptMatch[2] || '').trim() : ''),
          date: dateMatch ? dateMatch[1] : '2026-01-01',
          author: authorMatch ? authorMatch[1] : 'Axevora Team',
          image: imgMatch ? imgMatch[1] : 'https://axevora.com/og-image.png'
        });
      }
    }
  }

  if (fs.existsSync(generatedBlogsFile)) {
    try {
      const gen = JSON.parse(fs.readFileSync(generatedBlogsFile, 'utf8'));
      if (Array.isArray(gen)) {
        gen.forEach(g => {
          blogs.push({
            title: g.title,
            slug: g.slug,
            excerpt: g.excerpt || '',
            metaDescription: g.metaDescription || g.excerpt || '',
            date: g.date || '2026-01-01',
            author: g.author || 'Axevora Team',
            image: g.image || 'https://axevora.com/og-image.png'
          });
        });
      }
    } catch (e) {}
  }
  return blogs;
}

function parseAllAuthors() {
  const authors = [];
  try {
    const content = fs.readFileSync(authorsDataFile, 'utf8');
    const slugRegex = /slug:\s*"([^"]+)",[\s\S]*?name:\s*"([^"]+)",[\s\S]*?role:\s*"([^"]+)",[\s\S]*?bio:\s*"([^"]+)"/g;
    let m;
    while ((m = slugRegex.exec(content)) !== null) {
      authors.push({ slug: m[1], name: m[2], role: m[3], bio: m[4] });
    }
  } catch (e) {}
  return authors;
}

// Data Registries
const allToolsList = parseAllTools();
const allBlogsList = parseAllBlogs();
const allAuthorsList = parseAllAuthors();

const toolsByPath = {};
allToolsList.forEach(t => {
  toolsByPath[t.path.replace(/\/$/, '')] = t;
});

const blogsByPath = {};
allBlogsList.forEach(b => {
  blogsByPath[`/blog/${b.slug}`] = b;
});

const authorsByPath = {};
allAuthorsList.forEach(a => {
  authorsByPath[`/author/${a.slug}`] = a;
});

// Category Guide Names Map
const categoryNamesMap = {
  'pdf-category': { name: 'PDF Tools & Document Processing', desc: 'Complete guides and online utilities for PDF conversion, compression, merging, editing, and security on Axevora.' },
  'converters-category': { name: 'File & Format Converters', desc: 'Free online tools and guides to convert images, audio, video, documents, and code formats seamlessly.' },
  'generators-category': { name: 'Generators & Creation Utilities', desc: 'Essential online generators for passwords, QR codes, hashes, barcodes, terminal commands, and mock data.' },
  'analyzers-category': { name: 'Analyzers & Web Testing Tools', desc: 'Online utilities to analyze SEO, website performance, network latency, text readability, and image metadata.' },
  'editors-category': { name: 'Online Code & Text Editors', desc: 'Browser-based editors and viewers for HTML, CSS, JSON, CSV, Markdown, and rich text documents.' },
  'calculators-category': { name: 'Online Math & Financial Calculators', desc: 'Fast, interactive online calculators for SIP investments, calories, BMI, loans, and percentages.' },
  'formatters-category': { name: 'Code Formatters & Beautifiers', desc: 'Clean, beautify, and validate JSON, SQL, HTML, CSS, and XML code directly in your browser.' },
  'ai-tools-category': { name: 'AI Creation & Productivity Tools', desc: 'Free AI-powered tools for thumbnails, reel scripts, bios, image generation, and creative digital workflows.' },
  'dev-tools-category': { name: 'Developer Utilities & Terminal Generators', desc: 'Handy developer utilities, regex testers, ADB command generators, terminal syntax tools, and encoders.' },
  'games-category': { name: 'Online Games, Arcade & Brain Training', desc: 'Play 22 free web-based board games, retro arcade classics, and reflex trainers with zero installation.' },
  'validators-category': { name: 'Online Validators & Verification Tools', desc: 'Verify and validate JSON syntax, email addresses, password strength, and structured data with instant feedback.' }
};

// Hubs & Static Pages Metadata Dictionary
const STATIC_HUBS_METADATA = {
  '/': {
    title: 'Axevora — Find Smarter, Connect, Play & Work | 120+ Free Web Tools',
    description: 'Axevora is a free, privacy-first digital toolbox featuring 120+ web utilities, PDF converters, image editors, financial calculators, and 22 arcade games. No signup needed.',
    h1: 'Axevora — Free Online Tools, Utilities & Arcade Games',
    lead: 'Process documents locally with 100% privacy, challenge your mind with classic board games, and discover smart buying options in one unified digital ecosystem.'
  },
  '/tools': {
    title: '120+ Free Online Productivity Tools & Web Utilities | Axevora',
    description: 'Explore 120+ free web utilities for PDF conversion, image editing, file compression, code formatting, and mathematical calculations with instant local browser processing.',
    h1: '120+ Free Online Productivity Tools & Utilities',
    lead: 'Fast, secure, and client-side processing. Convert PDFs, edit images, beautify code, generate credentials, and calculate returns without software installation.'
  },
  '/games': {
    title: '22 Free Online Games - Play Board, Arcade & Puzzle Games | Axevora',
    description: 'Play 22 instant browser games online for free: Chess, 8-Ball Pool, Ludo, Solitaire, Spades, Checkers, 2048, Snake, Sudoku, and Minesweeper. Zero ads, no download required.',
    h1: '22 Free Online Games — Board, Arcade & Brain Games',
    lead: 'Challenge AI bots or play solo directly in your web browser. Instant loading, zero sign-up, and 100% responsive gameplay across desktop and mobile devices.'
  },
  '/shopping': {
    title: 'Smart Shopping Intelligence, Store Deals & Product Comparison | Axevora',
    description: 'Find smarter buying options, curated product deals, coupon discounts, and comprehensive price comparisons across top retail platforms on Axevora.',
    h1: 'Axevora Shopping — Smarter Buying & Curated Deals',
    lead: 'Discover top-rated tech gear, curated product recommendations, and verified discount coupons to make smarter shopping decisions.'
  },
  '/community': {
    title: 'Axevora Community - Connect, Share, Discuss & Grow',
    description: 'Join the Axevora creator and tech community. Share digital workflows, discuss tools, ask questions, and discover community recommendations.',
    h1: 'Axevora Community Hub',
    lead: 'Connect with developers, digital creators, and productivity enthusiasts. Share tips, discuss web utilities, and collaborate.'
  },
  '/deals': {
    title: 'Curated Store Deals, Coupons & Tech Discounts | Axevora',
    description: 'Browse verified store discounts, limited-time coupon codes, and tech promotions curated for maximum savings on Axevora.',
    h1: 'Verified Store Deals & Limited-Time Offers',
    lead: 'Exclusive coupon codes, price drops, and hand-picked retail promotions updated regularly.'
  },
  '/workspace': {
    title: 'Digital Workspace & Productivity Dashboard | Axevora',
    description: 'Manage your favorite utilities, recent documents, notes, and productivity workflows in your unified Axevora Workspace.',
    h1: 'Your Axevora Digital Workspace',
    lead: 'Organize your daily web utilities, pin essential calculators, and streamline your workflow in one convenient dashboard.'
  },
  '/creator-studio': {
    title: 'Creator Studio - Creative AI Tools & Digital Utilities | Axevora',
    description: 'Streamline your content creation with AI thumbnail text generators, reel script builders, bio makers, and media conversion tools on Axevora.',
    h1: 'Axevora Creator Studio',
    lead: 'Powerful AI-assisted tools for YouTubers, Instagram creators, and digital marketers to produce captivating content faster.'
  },
  '/categories': {
    title: 'Browse All Tool & Game Categories | Axevora',
    description: 'Explore all categories of free online tools, games, and web utilities on Axevora: PDF, Converters, Image, Developer, Calculators, Games & more.',
    h1: 'Directory of All Tool & Game Categories',
    lead: 'Navigate through specialized utility categories to find the exact converter, calculator, or game you need.'
  },
  '/about': {
    title: 'About Axevora - Privacy-First Digital Ecosystem & Free Utilities',
    description: 'Learn about Axevora\'s mission to provide fast, privacy-first, client-side web utilities, interactive arcade games, and smart consumer intelligence.',
    h1: 'About Axevora',
    lead: 'Dedicated to empowering users worldwide with free, accessible, and privacy-preserving web utilities and interactive digital experiences.'
  },
  '/contact': {
    title: 'Contact Axevora Support & Community Team',
    description: 'Get in touch with the Axevora team for support, feature suggestions, partnership inquiries, or tool feedback.',
    h1: 'Contact Axevora',
    lead: 'Have a question, feedback, or a tool request? Reach out to our team and we\'ll be glad to help.'
  },
  '/privacy': {
    title: 'Privacy Policy - Local Processing & Data Protection | Axevora',
    description: 'Read Axevora\'s privacy policy. Learn how our privacy-first tools process your files directly in your web browser without uploading them to servers.',
    h1: 'Privacy Policy',
    lead: 'Your privacy is our utmost priority. Learn how Axevora ensures your data and files remain strictly yours through local processing.'
  },
  '/terms': {
    title: 'Terms of Service & Usage Policy | Axevora',
    description: 'Terms of Service, acceptable use guidelines, and legal disclaimer for using Axevora free tools, games, and platform services.',
    h1: 'Terms of Service',
    lead: 'Please review the terms and conditions governing the use of Axevora\'s website, tools, games, and digital services.'
  },
  '/blog': {
    title: 'Axevora Blog - Technology Guides, Productivity Tips & Tool Tutorials',
    description: 'Read insightful tech guides, file management tutorials, productivity advice, and online security best practices on the Axevora Blog.',
    h1: 'Axevora Blog & Technology Guides',
    lead: 'In-depth tutorials, file conversion insights, productivity frameworks, and cyber-security best practices from our team.'
  }
};

// Distinct Titles & Descriptions for High-Priority Tools & Games
const CUSTOM_TOOL_SEO = {
  '/tools/investment-calculator': {
    title: 'Investment Calculator - Free SIP & Lumpsum Returns | Axevora',
    description: 'Calculate future value, total wealth gained, and annualized returns for SIP and lump sum investments with interactive compounding schedule on Axevora.'
  },
  '/tools/calorie-calculator': {
    title: 'Calorie Calculator - Free Daily TDEE & BMR Targets | Axevora',
    description: 'Calculate daily calorie needs, Basal Metabolic Rate (BMR), and Total Daily Energy Expenditure (TDEE) using Mifflin-St Jeor formula on Axevora.'
  },
  '/tools/chess': {
    title: 'Chess Online - Free 2-Player & vs AI Board Game | Axevora',
    description: 'Play chess online against smart AI or a friend. Free interactive chess board game with move validation, captured pieces tracker, and zero registration.'
  },
  '/tools/8-ball-pool': {
    title: '8 Ball Pool - Free Online Billiards Game | Axevora',
    description: 'Play classic 8-Ball Pool online in your browser. Realistic cue physics, smooth aim trajectory, and responsive controls with zero downloads on Axevora.'
  },
  '/tools/ludo': {
    title: 'Ludo Classic - Free Multiplayer Board Game Online | Axevora',
    description: 'Play Ludo online with friends or AI opponents. Classic 4-player board game with dice roll animations, safe zones, and family-friendly rules on Axevora.'
  },
  '/tools/solitaire': {
    title: 'Classic Solitaire - Free Online Klondike Card Game | Axevora',
    description: 'Play Classic Klondike Solitaire online for free. Draw 1 or Draw 3 cards, smooth drag-and-drop mechanics, undo moves, and score tracking with zero ads.'
  },
  '/tools/spades': {
    title: 'Spades Card Game - Free Online Classic Trick-Taking | Axevora',
    description: 'Play classic Spades card game online against intelligent AI bots. Bid tricks, set contracts, track bags, and master strategy in your web browser on Axevora.'
  },
  '/tools/checkers': {
    title: 'Checkers Classic - Free Online Draughts Board Game | Axevora',
    description: 'Play Checkers (English Draughts) online vs computer or friend. Diagonal jumps, king promotions, forced captures, and strategic gameplay on Axevora.'
  },
  '/tools/2048-game': {
    title: '2048 Game - Free Online Tile Puzzle Game | Axevora',
    description: 'Join the numbers and get to the 2048 tile! Play the classic 4x4 sliding block puzzle game free in your browser on Axevora.'
  },
  '/tools/snake': {
    title: 'Snake Game - Free Online Retro Arcade Classic | Axevora',
    description: 'Relive the retro classic Snake arcade game online. Eat food pellets, avoid walls, beat your high score, and enjoy smooth arrow controls on Axevora.'
  },
  '/tools/sudoku': {
    title: 'Sudoku Online - Free Daily Number Puzzle Game | Axevora',
    description: 'Play free Sudoku number puzzles online. Multiple difficulty levels from Easy to Expert with note-taking, error checking, and timer on Axevora.'
  },
  '/tools/minesweeper': {
    title: 'Minesweeper Classic - Free Online Puzzle Game | Axevora',
    description: 'Play classic Minesweeper online. Flag hidden mines, reveal safe grid cells using logic deduction, and beat your fastest completion time on Axevora.'
  },
  '/merge-pdf-online': {
    title: 'Merge PDF Online - Combine Multiple PDF Files Free | Axevora',
    description: 'Combine multiple PDF documents into one organized file in seconds. Drag-and-drop page reordering, 100% free, and private client-side processing on Axevora.'
  },
  '/split-pdf-online': {
    title: 'Split PDF Online - Extract Pages from PDF Free | Axevora',
    description: 'Extract specific pages or split large PDF files into separate documents for free. Fast, private local browser processing with no file size limits.'
  },
  '/compress-pdf-online': {
    title: 'Compress PDF Online - Reduce PDF File Size Free | Axevora',
    description: 'Reduce PDF file size quickly without losing visual quality. 100% private in-browser compression with zero server uploads on Axevora.'
  }
};

// ---------------- Route Aggregation ----------------
const staticPaths = [
  "/",
  "/categories",
  "/about",
  "/contact",
  "/tools",
  "/games",
  "/shopping",
  "/community",
  "/deals",
  "/workspace",
  "/creator-studio",
  "/privacy",
  "/terms",
  "/blog"
];

const allDiscoveredRoutes = [
  ...staticPaths,
  ...extractRoutesFromApp(),
  ...extractToolPaths(),
  ...extractBlogCategoryRoutes(),
  ...extractBlogSlugRoutes(),
  ...extractGeneratedBlogRoutes(),
  ...extractAuthorSlugRoutes()
];

const uniqueRoutes = new Set();
for (const r of allDiscoveredRoutes) {
  if (!r || r === "*" || r.includes(":")) continue;
  uniqueRoutes.add(r.replace(/\/+$/, ""));
}

console.log(`🚀 Generating static HTML for ${uniqueRoutes.size} verified routes...`);

let successCount = 0;

uniqueRoutes.forEach((route) => {
  let normalizedRoute = route.replace(/\/$/, "");
  if (normalizedRoute === "") normalizedRoute = "/";

  const canonicalUrl = `${baseUrl.replace(/\/$/, "")}${normalizedRoute === "/" ? "/" : normalizedRoute}`;

  let targetFile = "";
  if (normalizedRoute === "/" || normalizedRoute === "") {
    targetFile = path.join(distDir, "index.html");
  } else {
    const relativePath = normalizedRoute.replace(/^\//, '');
    targetFile = path.join(distDir, `${relativePath}.html`);
  }

  try {
    const targetDir = path.dirname(targetFile);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    let html = template;

    // Determine Metadata & Content based on route
    let pageTitle = "Axevora - Free Online Tools & Web Utilities";
    let pageDescription = "Free online tools for productivity: converters, generators, analyzers, editors, calculators, and arcade games with 100% private local processing.";
    let pageType = "website";
    let pageImage = "https://axevora.com/og-image.png";
    let h1Title = "Axevora Online Tools";
    let leadText = "Explore free online utilities and tools for productivity.";
    let howToSteps = [];
    let benefitItems = [];
    let faqItems = [];
    let relatedLinks = [];
    let jsonLd = null;

    // Check Static Hubs
    if (STATIC_HUBS_METADATA[normalizedRoute]) {
      const hub = STATIC_HUBS_METADATA[normalizedRoute];
      pageTitle = hub.title;
      pageDescription = hub.description;
      h1Title = hub.h1;
      leadText = hub.lead;

      if (normalizedRoute === "/") {
        jsonLd = {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": "https://axevora.com/#website",
              "url": "https://axevora.com/",
              "name": "Axevora",
              "description": pageDescription,
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://axevora.com/tools?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@type": "Organization",
              "@id": "https://axevora.com/#organization",
              "name": "Axevora",
              "url": "https://axevora.com/",
              "logo": {
                "@type": "ImageObject",
                "url": "https://axevora.com/favicon.png"
              }
            }
          ]
        };
      } else {
        jsonLd = {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": pageTitle,
          "url": canonicalUrl,
          "description": pageDescription,
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://axevora.com/" },
              { "@type": "ListItem", "position": 2, "name": h1Title, "item": canonicalUrl }
            ]
          }
        };
      }
    } 
    // Check Tools
    else if (toolsByPath[normalizedRoute]) {
      const tool = toolsByPath[normalizedRoute];
      const isGame = tool.category === "games";

      const customSeo = CUSTOM_TOOL_SEO[normalizedRoute];
      pageTitle = customSeo ? customSeo.title : (isGame ? `${tool.name} - Free Online Game | Axevora` : `${tool.name} - Free Online Tool | Axevora`);
      pageDescription = customSeo ? customSeo.description : (tool.description ? `${tool.description} Free, fast, and 100% private local browser processing on Axevora.` : pageDescription);
      h1Title = tool.name;
      leadText = tool.subheading || tool.description || `Use ${tool.name} online for free on Axevora.`;
      howToSteps = tool.howToUse || [];
      benefitItems = tool.benefits || [];
      faqItems = tool.faqs || [];

      // Find 4 related tools in same category
      relatedLinks = allToolsList
        .filter(t => t.category === tool.category && t.path !== tool.path)
        .slice(0, 4)
        .map(t => ({ name: t.name, path: t.path }));

      const breadcrumbHub = isGame ? { name: "Games", path: "/games" } : { name: "Tools", path: "/tools" };

      const schemaGraph = [
        {
          "@type": isGame ? "VideoGame" : "WebApplication",
          "name": tool.name,
          "url": canonicalUrl,
          "description": pageDescription,
          "applicationCategory": isGame ? "GameApplication" : "UtilitiesApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://axevora.com/" },
            { "@type": "ListItem", "position": 2, "name": breadcrumbHub.name, "item": `https://axevora.com${breadcrumbHub.path}` },
            { "@type": "ListItem", "position": 3, "name": tool.name, "item": canonicalUrl }
          ]
        }
      ];

      if (faqItems.length > 0) {
        schemaGraph.push({
          "@type": "FAQPage",
          "mainEntity": faqItems.map(f => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.answer
            }
          }))
        });
      }

      jsonLd = {
        "@context": "https://schema.org",
        "@graph": schemaGraph
      };
    }
    // Check Blogs
    else if (blogsByPath[normalizedRoute]) {
      const blog = blogsByPath[normalizedRoute];
      pageTitle = `${blog.title} | Axevora Blog`;
      pageDescription = blog.metaDescription || blog.excerpt || `Read ${blog.title} on the Axevora Blog.`;
      pageType = "article";
      pageImage = blog.image || pageImage;
      h1Title = blog.title;
      leadText = blog.excerpt || `Published on ${blog.date} by ${blog.author}.`;

      relatedLinks = [
        { name: "All Tools", path: "/tools" },
        { name: "Axevora Blog", path: "/blog" },
        { name: "PDF Tools", path: "/blog-posts/pdf-category" }
      ];

      jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.title,
        "description": pageDescription,
        "datePublished": blog.date,
        "author": {
          "@type": "Person",
          "name": blog.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "Axevora",
          "logo": {
            "@type": "ImageObject",
            "url": "https://axevora.com/favicon.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": canonicalUrl
        },
        "image": pageImage
      };
    }
    // Check Blog Categories
    else if (normalizedRoute.startsWith("/blog-posts/")) {
      const catKey = normalizedRoute.replace("/blog-posts/", "");
      const catMeta = categoryNamesMap[catKey] || { name: catKey.replace(/-/g, ' ').toUpperCase(), desc: 'Guides and online tools on Axevora.' };
      pageTitle = `${catMeta.name} Guides & Tools | Axevora`;
      pageDescription = catMeta.desc;
      h1Title = catMeta.name;
      leadText = catMeta.desc;

      relatedLinks = [
        { name: "Tools Hub", path: "/tools" },
        { name: "Categories", path: "/categories" },
        { name: "Blog Hub", path: "/blog" }
      ];

      jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": pageTitle,
        "url": canonicalUrl,
        "description": pageDescription,
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://axevora.com/" },
            { "@type": "ListItem", "position": 2, "name": "Categories", "item": "https://axevora.com/categories" },
            { "@type": "ListItem", "position": 3, "name": catMeta.name, "item": canonicalUrl }
          ]
        }
      };
    }
    // Check Authors
    else if (authorsByPath[normalizedRoute]) {
      const author = authorsByPath[normalizedRoute];
      pageTitle = `${author.name} - Author Profile | Axevora`;
      pageDescription = `${author.name} (${author.role}) - ${author.bio}`;
      h1Title = author.name;
      leadText = `${author.role} • ${author.bio}`;

      jsonLd = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "name": pageTitle,
        "mainEntity": {
          "@type": "Person",
          "name": author.name,
          "jobTitle": author.role,
          "description": author.bio
        }
      };
    }
    // Fallback for any other valid route
    else {
      const cleanSlug = normalizedRoute.replace(/^\//, '').replace(/-/g, ' ');
      const capitalized = cleanSlug.charAt(0).toUpperCase() + cleanSlug.slice(1);
      pageTitle = `${capitalized} | Axevora`;
      pageDescription = `Explore ${capitalized} on Axevora. Fast, responsive, and privacy-first digital tools.`;
      h1Title = capitalized;
      leadText = pageDescription;
    }

    // Fallback schema if not specialized
    if (!jsonLd) {
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": pageTitle,
        "url": canonicalUrl,
        "description": pageDescription,
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://axevora.com/" },
            { "@type": "ListItem", "position": 2, "name": h1Title, "item": canonicalUrl }
          ]
        }
      };
    }

    // --- SEO INJECTION: CANONICAL & META ---
    const staticCanonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;

    // Clean old meta tags
    html = html.replace(/<link rel="canonical"[^>]*?>/gi, "");
    html = html.replace(/<meta property="og:url"[^>]*?>/gi, "");
    html = html.replace(/<meta property="og:title"[^>]*?>/gi, "");
    html = html.replace(/<meta property="og:description"[^>]*?>/gi, "");
    html = html.replace(/<meta property="og:type"[^>]*?>/gi, "");
    html = html.replace(/<meta property="og:image"[^>]*?>/gi, "");
    html = html.replace(/<meta property="twitter:title"[^>]*?>/gi, "");
    html = html.replace(/<meta property="twitter:description"[^>]*?>/gi, "");
    html = html.replace(/<meta name="twitter:title"[^>]*?>/gi, "");
    html = html.replace(/<meta name="twitter:description"[^>]*?>/gi, "");
    html = html.replace(/<meta name="description"[\s\S]*?>/i, "");
    html = html.replace(/<title>[\s\S]*?<\/title>/i, "");

    // Build JSON-LD string
    const jsonLdTag = jsonLd ? `\n  <script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n  </script>` : '';

    // Injected Head Meta Block
    const headInjections = `
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(pageDescription)}" />
  ${staticCanonicalTag}
  <meta property="og:type" content="${pageType}" />
  <meta property="og:title" content="${escapeHtml(pageTitle)}" />
  <meta property="og:description" content="${escapeHtml(pageDescription)}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:image" content="${pageImage}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(pageDescription)}" />
  <meta name="twitter:image" content="${pageImage}" />${jsonLdTag}
</head>`;

    html = html.replace('</head>', headInjections);

    // --- CRAWLER-ACCESSIBLE SEMANTIC ROOT HTML ---
    let semanticBody = `
    <header class="seo-header">
      <nav aria-label="Breadcrumb" style="font-size: 12px; margin-bottom: 8px;">
        <a href="/">Home</a> &gt; <span aria-current="page">${escapeHtml(h1Title)}</span>
      </nav>
      <h1>${escapeHtml(h1Title)}</h1>
      <p class="lead" style="font-size: 16px; line-height: 1.5; color: #4b5563;">${escapeHtml(leadText)}</p>
    </header>
    <main class="seo-main">`;

    if (howToSteps.length > 0) {
      semanticBody += `
      <section class="seo-how-to" style="margin-top: 16px;">
        <h2>How to Use</h2>
        <ol style="padding-left: 20px;">
          ${howToSteps.map(step => `<li>${escapeHtml(step)}</li>`).join('\n          ')}
        </ol>
      </section>`;
    }

    if (benefitItems.length > 0) {
      semanticBody += `
      <section class="seo-benefits" style="margin-top: 16px;">
        <h2>Key Features &amp; Benefits</h2>
        <ul style="padding-left: 20px;">
          ${benefitItems.map(item => `<li>${escapeHtml(item)}</li>`).join('\n          ')}
        </ul>
      </section>`;
    }

    if (faqItems.length > 0) {
      semanticBody += `
      <section class="seo-faqs" style="margin-top: 16px;">
        <h2>Frequently Asked Questions</h2>
        <dl style="margin-top: 8px;">
          ${faqItems.map(f => `<dt style="font-weight: bold; margin-top: 8px;">${escapeHtml(f.question)}</dt><dd style="margin-left: 0; margin-bottom: 8px; color: #4b5563;">${escapeHtml(f.answer)}</dd>`).join('\n          ')}
        </dl>
      </section>`;
    }

    if (relatedLinks.length > 0) {
      semanticBody += `
      <section class="seo-related" style="margin-top: 20px;">
        <h2>Related Tools &amp; Resources</h2>
        <ul style="display: flex; flex-wrap: wrap; gap: 12px; list-style: none; padding: 0;">
          ${relatedLinks.map(l => `<li><a href="${l.path}" style="color: #2563eb; text-decoration: underline;">${escapeHtml(l.name)}</a></li>`).join('\n          ')}
        </ul>
      </section>`;
    }

    semanticBody += `
    </main>
    <footer class="seo-footer" style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 13px;">
      <nav aria-label="Ecosystem Navigation">
        <a href="/tools" style="margin-right: 12px;">All Tools</a>
        <a href="/games" style="margin-right: 12px;">Games</a>
        <a href="/shopping" style="margin-right: 12px;">Shopping</a>
        <a href="/community" style="margin-right: 12px;">Community</a>
        <a href="/blog" style="margin-right: 12px;">Blog</a>
        <a href="/about">About</a>
      </nav>
    </footer>`;

    // Replace the innerHTML of <div id="root">
    html = html.replace(/<div id="root">[\s\S]*?<\/div>/i, `<div id="root">${semanticBody}\n  </div>`);

    // Ensure noscript tag at bottom is clean
    html = html.replace(/<noscript>[\s\S]*?<\/noscript>/g, (match) => {
      // Preserve Google Tag Manager noscript
      if (match.includes('googletagmanager.com')) return match;
      return '';
    });

    fs.writeFileSync(targetFile, html, 'utf8');
    successCount++;
  } catch (e) {
    console.error(`❌ Failed to generate static HTML for ${route}:`, e);
  }
});

console.log(`✅ Successfully generated ${successCount} production-grade static pages with rich SEO metadata.`);
