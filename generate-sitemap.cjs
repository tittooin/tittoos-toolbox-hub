// generate-sitemap.cjs
const fs = require("fs");
const path = require("path");

const baseUrl = process.env.SITEMAP_BASE_URL || "https://tittoos.online/";
const appFile = path.join(__dirname, "src", "App.tsx");
const toolsDataFile = path.join(__dirname, "src", "data", "tools.ts");
const blogPostsDir = path.join(__dirname, "src", "pages", "blog-posts");
const blogsDataFile = path.join(__dirname, "src", "data", "blogs.ts");
const authorsDataFile = path.join(__dirname, "src", "data", "authors.ts");

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
  } catch {
    return [];
  }
}

function extractToolPaths() {
  try {
    const content = fs.readFileSync(toolsDataFile, "utf8");
    const regex = /path\s*:\s*["'`](\/tools\/[^"'`]+)["'`]/g;
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
    const files = fs
      .readdirSync(blogPostsDir)
      .filter((f) => f.endsWith(".tsx"));
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
      if (slug && slug.length > 0) {
        routes.push(`/blog/${slug}`);
      }
    }
    return routes;
  } catch {
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

function includeDownloaderRoutes() {
  try {
    const envContent = fs.readFileSync(path.join(__dirname, ".env.review"), "utf8");
    const m = envContent.match(/VITE_ENABLE_DOWNLOADERS\s*=\s*(.+)/);
    if (m) {
      return m[1].trim() !== "false";
    }
  } catch {}
  return true;
}

const staticPaths = [
  "/categories",
  "/about",
  "/contact",
  "/tools",
  "/privacy",
  "/terms",
  "/blog",
];

const shouldIncludeDownloaders = includeDownloaderRoutes();

const collected = [
  ...staticPaths,
  ...extractRoutesFromApp(),
  ...extractToolPaths(),
  ...extractBlogCategoryRoutes(),
  ...extractBlogSlugRoutes(),
  ...extractAuthorSlugRoutes(),
];

const uniquePaths = new Set();
for (const p of collected) {
  if (!p || p === "*") continue;
  if (!shouldIncludeDownloaders && p.includes("downloader")) continue;
  uniquePaths.add(p.replace(/\/+$/, ""));
}

const entries = Array.from(uniquePaths)
  .sort()
  .map((p) => `<url><loc>${baseUrl}${p.replace(/^\//, "")}</loc></url>`) // ensure single slash
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>${baseUrl}</loc></url>\n${entries}\n</urlset>`;

const outputPath = path.join(__dirname, "public", "sitemap.xml");
fs.writeFileSync(outputPath, sitemap);
console.log(`✅ Sitemap generated at ${outputPath} with ${uniquePaths.size} routes.`);
