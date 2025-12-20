const fs = require('fs');
const path = require('path');

// Re-use logic from generate-sitemap.cjs (simplified for this script)
const baseUrl = process.env.SITEMAP_BASE_URL || "https://axevora.com/";
const appFile = path.join(__dirname, "src", "App.tsx");
const toolsDataFile = path.join(__dirname, "src", "data", "tools.ts");
const blogPostsDir = path.join(__dirname, "src", "pages", "blog-posts");
const blogsDataFile = path.join(__dirname, "src", "data", "blogs.ts");
const authorsDataFile = path.join(__dirname, "src", "data", "authors.ts");

// ---------------- Helper Functions (Copied/Adapted) ----------------
function extractRoutesFromApp() {
    try {
        const content = fs.readFileSync(appFile, "utf8");
        const routeRegex = /path\s*=\s*["'`](\/[^"]+?)["'`]/g;
        const routes = [];
        let match;
        while ((match = routeRegex.exec(content)) !== null) {
            const p = match[1];
            if (!p || p === "*" || p.includes(":")) continue;
            routes.push(p);
        }
        return routes;
    } catch { return []; }
}

function extractToolPaths() {
    try {
        const content = fs.readFileSync(toolsDataFile, "utf8");
        const regex = /path\s*:\s*["'`](\/tools\/[^"'`]+)["'`]/g;
        const paths = [];
        let m;
        while ((m = regex.exec(content)) !== null) { paths.push(m[1]); }
        return paths;
    } catch { return []; }
}

function extractBlogCategoryRoutes() {
    try {
        const files = fs.readdirSync(blogPostsDir).filter((f) => f.endsWith(".tsx"));
        return files.map((f) => `/blog-posts/${path.basename(f, ".tsx")}`);
    } catch { return []; }
}

function extractBlogSlugRoutes() {
    try {
        const content = fs.readFileSync(blogsDataFile, "utf8");
        const slugRegex = /slug\s*:\s*["'`]([^"'`]+)["'`]/g;
        const routes = [];
        let m;
        while ((m = slugRegex.exec(content)) !== null) {
            if (m[1] && m[1].length > 0) routes.push(`/blog/${m[1]}`);
        }
        return routes;
    } catch { return []; }
}

function extractAuthorSlugRoutes() {
    try {
        const content = fs.readFileSync(authorsDataFile, "utf8");
        const slugRegex = /slug\s*:\s*["'`]([^"'`]+)["'`]/g;
        const routes = [];
        let m;
        while ((m = slugRegex.exec(content)) !== null) {
            if (m[1] && m[1].length > 0) routes.push(`/author/${m[1]}`);
        }
        return routes;
    } catch { return []; }
}


// ---------------- Main Logic ----------------

const distDir = path.join(__dirname, 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
    console.error("❌ Error: dist/index.html not found. Run 'npm run build' first.");
    process.exit(1);
}

const template = fs.readFileSync(indexHtmlPath, 'utf8');

const staticPaths = ["/categories", "/about", "/contact", "/tools", "/privacy", "/terms", "/blog"];
const allRoutes = [
    ...staticPaths,
    ...extractRoutesFromApp(),
    ...extractToolPaths(),
    ...extractBlogCategoryRoutes(),
    ...extractBlogSlugRoutes(),
    ...extractAuthorSlugRoutes()
];

// Deduplicate and filter
const uniqueRoutes = new Set();
// Always include root
uniqueRoutes.add("/");

for (const r of allRoutes) {
    if (!r || r === "*" || r.includes(":")) continue;
    uniqueRoutes.add(r);
}

console.log(`🚀 Generating static HTML for ${uniqueRoutes.size} routes...`);

let successCount = 0;

// --- DYNAMIC CONTENT INJECTION SETUP ---
// Read tools.ts to map paths to names for SEO (Title/H1 uniqueness)
let toolMap = {};
try {
    const toolsFileContent = fs.readFileSync(path.join(__dirname, 'src/data/tools.ts'), 'utf8');
    // Regex to capture name and path from the object structure
    // Matches: name: "Tool Name", ... path: "/tools/tool-path"
    // We use a global match with exec in a loop
    const toolRegex = /name:\s*"([^"]+)",[\s\S]*?path:\s*"([^"]+)"/g;
    let match;
    while ((match = toolRegex.exec(toolsFileContent)) !== null) {
        // match[1] = Name, match[2] = Path
        const toolName = match[1];
        const toolPath = match[2];
        // Normalize path for map key (remove trailing slash if any, though tools.ts usually doesn't have them)
        const checkPath = toolPath.replace(/\/$/, "");
        toolMap[checkPath] = toolName;
    }
    console.log(`Loaded ${Object.keys(toolMap).length} tools for SEO Injection.`);
} catch (e) {
    console.warn("Could not load tools.ts for SEO injection, using defaults.", e);
}

const defaultTitleStart = "Axevora - 40+ Essential";
const defaultH1 = "Axevora - Free Online Tools & Utilities";

uniqueRoutes.forEach(route => {
    // Determine canonical URL for this route
    // Logic: NO trailing slash (Matches Vercel Clean URLs for .html files)
    let normalizedRoute = route.replace(/\/$/, "");
    if (normalizedRoute === "") normalizedRoute = "/";

    // Canonical NO trailing slash (Matches Cloudflare Clean URLs)
    const canonicalUrl = `${baseUrl.replace(/\/$/, "")}${normalizedRoute === "/" ? "/" : normalizedRoute}`;

    // Prepare target file path
    // OLD: /tools/pdf -> dist/tools/pdf/index.html
    // NEW: /tools/pdf -> dist/tools/pdf.html

    let targetFile = "";

    if (route === "/" || route === "") {
        // Root must still be index.html in valid dist location? 
        // Actually root is handled by Main index.html. 
        // But we want to inject our Canonical.
        targetFile = path.join(distDir, "index.html");
    } else {
        const relativePath = route.replace(/^\//, ''); // tools/pdf-converter
        targetFile = path.join(distDir, `${relativePath}.html`);
    }

    try {
        const targetDir = path.dirname(targetFile);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        let html = template;

        // --- SEO INJECTION: CANONICAL ---
        const staticCanonicalTag = `<link rel="canonical" href="${canonicalUrl}" data-generated="static-flat" />`;
        // Remove existing canonical hooks or tags
        html = html.replace(/<link rel="canonical" href=".*?" \/>/g, ""); // regex kill old ones
        // Inject new one before head close
        html = html.replace('</head>', `${staticCanonicalTag}\n</head>`);

        // --- SEO INJECTION: OG:URL (Must match Canonical) ---
        // Remove existing og:url to prevent duplicates
        html = html.replace(/<meta property="og:url" content=".*?" \/>/g, "");
        html = html.replace('</head>', `<meta property="og:url" content="${canonicalUrl}" />\n</head>`);

        // --- SEO INJECTION: DYNAMIC TITLE & H1 ---
        // Lookup tool name
        // route is like "/tools/pdf-converter"
        const toolName = toolMap[normalizedRoute];

        if (toolName) {
            // Replace Title
            // <title>Axevora - 40+ Essential Online Utilities | Free Web Tools</title>
            const newTitle = `${toolName} - Axevora Free Tools`;
            html = html.replace(/<title>.*?<\/title>/, `<title>${newTitle}</title>`);

            // Replace H1
            // <h1>Axevora - Free Online Tools & Utilities</h1>
            html = html.replace(/<h1>.*?<\/h1>/, `<h1>${toolName}</h1>`);
        }
        // If not found (e.g. blog pages or categories not in tools.ts), leave default or we could improve logic later.



        // INJECT FULL STATIC SITE MAP (Hidden/SEO-only)
        // This ensures NO ORPHAN PAGES even if JS fails or Crawler ignores JS.
        // We replace the content of <div id="root"> with actual links content.
        // React will hydration-mismatch and replace this, which is exactly what we want for users vs bots.
        const sitemapLinks = Array.from(uniqueRoutes).map(r => {
            const clean = r.replace(/^\//, ''); // tools/pdf -> tools/pdf
            const title = clean === "" ? "Home" : clean.replace(/-/g, " ").replace(/\//g, " - ").toUpperCase();
            // Cloudflare/Clean URL: NO TRAILING SLASH
            const href = `/${clean}`;
            return `<li><a href="${href}">${title}</a></li>`;
        }).join("\n");

        const seoContent = `
        <div id="static-sitemap-content" style="display:none; visibility:hidden;">
            <h2>Axevora Static Sitemap</h2>
            <ul>
                ${sitemapLinks}
            </ul>
        </div>
        `;

        // Append to body (safer than replacing root content to avoid flashing issues if CSS loads fast)
        // Actually, Putting it inside a <noscript> is also good, but some strictly parse HTML.
        // Let's append it to the body.
        html = html.replace('</body>', `${seoContent}\n</body>`);

        fs.writeFileSync(targetFile, html);
        successCount++;
    } catch (e) {
        console.error(`Failed to generate ${route}:`, e);
    }
});
console.log(`✅ Successfully generated ${successCount} static pages.`);
