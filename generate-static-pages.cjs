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
    // Logic: Force trailing slash for everything (Directory structure behavior)
    let normalizedRoute = route.replace(/\/$/, "");
    if (normalizedRoute === "") normalizedRoute = "/"; // Root
    else normalizedRoute += "/"; // Append slash for subpaths

    const canonicalUrl = `${baseUrl.replace(/\/$/, "")}${normalizedRoute}`;

    // Prepare target directory
    // E.g. /tools/pdf -> dist/tools/pdf/index.html
    const relativePath = route === '/' ? '' : route.replace(/^\//, '');
    const validRelativePath = relativePath.split('/').filter(Boolean).join(path.sep); // Cross-platform

    const targetDir = path.join(distDir, validRelativePath);

    try {
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // Inject Metadata into the template
        let html = template;

        // 1. Remove the inline script we customized earlier (optional, but cleaner to replace it)
        // Actually, let's just inject a STATIC <link rel="canonical"> at the end of head
        // The inline script might still run but check if tag exists? 
        // Better: We aggressively inject the CORRECT static tag.

        const staticCanonicalTag = `<link rel="canonical" href="${canonicalUrl}"data-generated="static" />`;

        // Remove any existing canonical tags (if any slipped in) or our previous hardcoded one
        // Also simpler: Just replace </head> with the tag + </head>
        // But we want to be clean.

        // We will remove the "Immediate Canonical Generation" script if possible, or just append the static tag 
        // which most crawlers will prefer if found in source.

        html = html.replace('</head>', `${staticCanonicalTag}\n</head>`);

        // Write file
        fs.writeFileSync(path.join(targetDir, 'index.html'), html);
        successCount++;
    } catch (e) {
        console.error(`Failed to generate ${route}:`, e);
    }
});

console.log(`✅ Successfully generated ${successCount} static pages.`);
