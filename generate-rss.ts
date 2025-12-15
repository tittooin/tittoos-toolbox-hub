
import fs from 'fs';
import path from 'path';
import { DEFAULT_BLOG_POSTS } from './src/data/blogs';

const RSS_PATH = path.join(process.cwd(), 'public', 'rss.xml');
const BASE_URL = 'https://axevora.com';

const generateRSS = () => {
    const items = DEFAULT_BLOG_POSTS.map((post) => {
        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid>${BASE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <author>admin@axevora.com (${post.author})</author>
    </item>`;
    }).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Axevora Blog</title>
    <link>${BASE_URL}</link>
    <description>Latest tools, guides, and tech insights from Axevora.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

    fs.writeFileSync(RSS_PATH, rss);
    console.log(`✅ RSS feed generated at ${RSS_PATH}`);
};

generateRSS();
