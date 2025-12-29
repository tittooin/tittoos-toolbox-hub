const fs = require('fs');
const path = require('path');

// Re-use logic from generate-sitemap.cjs (simplified for this script)
const baseUrl = process.env.SITEMAP_BASE_URL || "https://axevora.com/";
const appFile = path.join(__dirname, "src", "App.tsx");
const toolsDataFile = path.join(__dirname, "src", "data", "tools.ts");
const blogPostsDir = path.join(__dirname, "src", "pages", "blog-posts");
const blogsDataFile = path.join(__dirname, "src", "data", "blogs.ts");
const authorsDataFile = path.join(__dirname, "src", "data", "authors.ts");
const generatedBlogsFile = path.join(__dirname, "src", "data", "generated_blogs.json");

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
        console.error("Error reading generated blogs for sitemap:", e);
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

const staticPaths = ["/categories", "/about", "/contact", "/tools", "/privacy", "/terms", "/blog", "/sitemap"];
const allRoutes = [
    ...staticPaths,
    ...extractRoutesFromApp(),
    ...extractToolPaths(),
    ...extractBlogCategoryRoutes(),
    ...extractBlogSlugRoutes(),
    ...extractGeneratedBlogRoutes(),
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
    const toolRegex = /name:\s*"([^"]+)",[\s\S]*?path:\s*"([^"]+)"/g;
    let match;
    while ((match = toolRegex.exec(toolsFileContent)) !== null) {
        toolMap[match[2].replace(/\/$/, "")] = match[1];
    }
    console.log(`Loaded ${Object.keys(toolMap).length} tools for SEO Injection.`);
} catch (e) {
    console.warn("Could not load tools.ts for SEO injection, using defaults.", e);
}

uniqueRoutes.forEach(route => {
    let normalizedRoute = route.replace(/\/$/, "");
    if (normalizedRoute === "") normalizedRoute = "/";

    const canonicalUrl = `${baseUrl.replace(/\/$/, "")}${normalizedRoute === "/" ? "/" : normalizedRoute}`;

    let targetFile = "";
    if (route === "/" || route === "") {
        targetFile = path.join(distDir, "index.html");
    } else {
        const relativePath = route.replace(/^\//, '');
        targetFile = path.join(distDir, `${relativePath}.html`);
    }

    try {
        const targetDir = path.dirname(targetFile);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        let html = template;

        // --- SEO INJECTION: CANONICAL & META ---
        const staticCanonicalTag = `<link rel="canonical" href="${canonicalUrl}" data-generated="static-flat" />`;

        // Remove existing tags to prevent duplicates (Robust Regex)
        html = html.replace(/<link rel="canonical" href="[^"]*?"\s*\/?>/g, "");
        html = html.replace(/<meta property="og:url" content="[^"]*?"\s*\/?>/g, "");

        // Inject new Canonical and OG:URL
        html = html.replace('</head>', `${staticCanonicalTag}\n<meta property="og:url" content="${canonicalUrl}" />\n</head>`);

        // --- SEO INJECTION: TITLE & H1 ---
        const toolName = toolMap[normalizedRoute];
        if (toolName) {
            const newTitle = `${toolName} - Axevora Free Tools`;
            html = html.replace(/<title>.*?<\/title>/, `<title>${newTitle}</title>`);
            html = html.replace(/<h1>.*?<\/h1>/, `<h1>${toolName}</h1>`);
        }

        // --- SPECIAL: PRE-RENDER LINKS FOR SITEMAP PAGE ---
        // This ensures non-JS crawlers see all links on /sitemap
        // Prepare links for Sitemap and NoScript fallbacks
        const sortedRoutesForLinks = Array.from(uniqueRoutes).sort();
        const linksHtml = sortedRoutesForLinks.map(r => {
            const name = toolMap[r.replace(/\/$/, "")] || r;
            return `<li><a href="${r}">${name}</a></li>`;
        }).join('\n');

        // --- SPECIAL: PRE-RENDER LINKS FOR SITEMAP PAGE ---
        if (normalizedRoute === "/sitemap") {
            const sitemapContent = `
                <div style="padding: 20px;">
                    <h1>Sitemap</h1>
                    <p>Static index for crawlers.</p>
                    <ul>${linksHtml}</ul>
                </div>
            `;
            html = html.replace('<div id="root"></div>', `<div id="root">${sitemapContent}</div>`);
        }

        // --- UNIVERSAL NOSCRIPT FALLBACK ---
        // Inject all links in noscript on ALL pages to ensure crawlability for non-JS bots
        const noscriptBlock = `
        <noscript>
            <hr/>
            <h3>Site Links</h3>
            <ul>${linksHtml}</ul>
        </noscript>
        `;
        html = html.replace('</body>', `${noscriptBlock}\n</body>`);

        fs.writeFileSync(targetFile, html);
        successCount++;
    } catch (e) {
        console.error(`Failed to generate ${route}:`, e);
    }
});
console.log(`✅ Successfully generated ${successCount} static pages.`);
