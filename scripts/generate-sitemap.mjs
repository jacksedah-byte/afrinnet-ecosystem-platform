import { readFile, writeFile } from "node:fs/promises";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../src/convex/_generated/api.js";
import { defaultSiteUrl } from "./production-config.mjs";
import { createSitemap, extractSitemapPaths } from "./sitemap.mjs";

const convexUrl = process.env.VITE_CONVEX_URL;
if (!convexUrl) {
  throw new Error("VITE_CONVEX_URL is required to include published CMS routes in the sitemap.");
}

const siteUrl = process.env.VITE_SITE_URL || defaultSiteUrl;
const staticOnly = process.argv.includes("--static-only");
const client = staticOnly ? null : new ConvexHttpClient(convexUrl);
const cmsEntries = staticOnly
  ? []
  : await client.query(api.cms.sitemapEntries, {});
const sourceSitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
const output = createSitemap({
  siteUrl,
  staticPaths: extractSitemapPaths(sourceSitemap),
  cmsEntries,
});
const siteOrigin = new URL(siteUrl).origin;

await writeFile(new URL("../dist/sitemap.xml", import.meta.url), output);
for (const file of ["index.html", "robots.txt"]) {
  const path = new URL(`../dist/${file}`, import.meta.url);
  const content = await readFile(path, "utf8");
  await writeFile(path, content.replaceAll("https://afrinnet.org", siteOrigin));
}
