export function createSitemap({ siteUrl, staticPaths, cmsEntries }) {
  const origin = new URL(siteUrl).origin;
  const entries = new Map();
  for (const path of [...staticPaths, ...cmsEntries.map((entry) => entry.path)]) {
    if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) {
      continue;
    }
    const url = new URL(path, origin);
    if (url.origin === origin) entries.set(url.pathname, url.toString());
  }

  const lastModified = new Map(
    cmsEntries
      .filter(
        (entry) =>
          typeof entry.path === "string" &&
          typeof entry.updatedAt === "number" &&
          Number.isFinite(entry.updatedAt),
      )
      .map((entry) => [entry.path, new Date(entry.updatedAt).toISOString().slice(0, 10)]),
  );
  const urls = [...entries.keys()].sort().map((path) => {
    const lastmod = lastModified.get(path);
    return `  <url><loc>${escapeXml(entries.get(path))}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}

export function extractSitemapPaths(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, value]) => {
    try {
      return new URL(value).pathname;
    } catch {
      return null;
    }
  }).filter((path) => path !== null);
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
