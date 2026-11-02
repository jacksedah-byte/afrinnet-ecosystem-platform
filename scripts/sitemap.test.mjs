import assert from "node:assert/strict";
import test from "node:test";
import { createSitemap, extractSitemapPaths } from "./sitemap.mjs";

test("sitemap combines static and published CMS paths using the configured origin", () => {
  const xml = createSitemap({
    siteUrl: "https://afrinnet.org/",
    staticPaths: ["/", "/about"],
    cmsEntries: [
      { path: "/updates/new-programme", updatedAt: Date.UTC(2026, 9, 1) },
      { path: "/about", updatedAt: Date.UTC(2026, 9, 2) },
    ],
  });

  assert.match(xml, /https:\/\/afrinnet\.org\/updates\/new-programme/);
  assert.match(xml, /<lastmod>2026-10-01<\/lastmod>/);
  assert.equal((xml.match(/<loc>/g) ?? []).length, 3);
});

test("sitemap rejects unsafe CMS paths and escapes URL content", () => {
  const xml = createSitemap({
    siteUrl: "https://afrinnet.org",
    staticPaths: ["/safe"],
    cmsEntries: [
      { path: "//external.example/path", updatedAt: 0 },
      { path: "https://external.example/path", updatedAt: 0 },
    ],
  });

  assert.equal((xml.match(/<loc>/g) ?? []).length, 1);
  assert.doesNotMatch(xml, /external\.example/);
});

test("static sitemap paths are read without retaining their old hostname", () => {
  assert.deepEqual(
    extractSitemapPaths("<urlset><url><loc>https://old.example/about</loc></url></urlset>"),
    ["/about"],
  );
});
