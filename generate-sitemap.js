// generate-sitemap.js
const fs = require("fs");
const path = require("path");

const baseUrl = "https://tittoos.online/";
const toolsDir = path.join(__dirname, "tools");

const getHtmlFiles = (dir) =>
  fs.readdirSync(dir)
    .filter(file => file.endsWith(".html"))
    .map(file => `<url><loc>${baseUrl}tools/${file}</loc></url>`);

let urls = getHtmlFiles(toolsDir).join("\n");

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>${baseUrl}</loc></url>\n${urls}\n</urlset>`;

fs.writeFileSync("sitemap.xml", sitemap);
console.log("✅ Sitemap generated!");
