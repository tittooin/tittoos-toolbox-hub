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

uniqueRoutes.forEach(route => {
    // Determine canonical URL for this route
    // Logic: NO trailing slash (Matches Vercel Clean URLs for .html files)
    let normalizedRoute = route.replace(/\/$/, "");
    if (normalizedRoute === "") normalizedRoute = "/";

    // Canonical HAS trailing slash (Matches Vercel trailingSlash: true)
    const canonicalUrl = `${baseUrl.replace(/\/$/, "")}${normalizedRoute === "/" ? "/" : normalizedRoute + "/"}`;

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

        // Inject Canonical
        const staticCanonicalTag = `<link rel="canonical" href="${canonicalUrl}" data-generated="static-flat" />`;
        // Remove existing canonical hooks or tags
        html = html.replace(/<link rel="canonical" href=".*?" \/>/g, ""); // regex kill old ones
        // Inject new one before head close
        html = html.replace('</head>', `${staticCanonicalTag}\n</head>`);

        fs.writeFileSync(targetFile, html);
        successCount++;
    } catch (e) {
        console.error(`Failed to generate ${route}:`, e);
    }
});
console.log(`✅ Successfully generated ${successCount} static pages.`);
