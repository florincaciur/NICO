import fs from "node:fs";
import path from "node:path";

const root = path.resolve("NICO");
const origin = "https://psihoterapeutnicoletaamihaesi.ro";
const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith(".html")).sort();
const errors = [];
const pages = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const canonicals = [...html.matchAll(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/gi)].map((match) => match[1]);
  const titles = [...html.matchAll(/<title>([\s\S]*?)<\/title>/gi)].map((match) => match[1].trim());
  const h1Count = [...html.matchAll(/<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/gi)].length;
  const robots = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i)?.[1] ?? "";

  if (canonicals.length !== 1) errors.push(`${file}: expected one canonical, found ${canonicals.length}`);
  if (titles.length !== 1) errors.push(`${file}: expected one title, found ${titles.length}`);
  if (h1Count !== 1) errors.push(`${file}: expected one H1, found ${h1Count}`);
  if (!/index/i.test(robots) || !/follow/i.test(robots)) errors.push(`${file}: robots must allow index and follow`);
  if (/href=["']index\.html(?:[#"'])/i.test(html)) errors.push(`${file}: links to duplicate /index.html instead of /`);

  const expectedCanonical = file === "index.html" ? `${origin}/` : `${origin}/${file}`;
  if (canonicals[0] && canonicals[0] !== expectedCanonical) {
    errors.push(`${file}: canonical is ${canonicals[0]}, expected ${expectedCanonical}`);
  }

  const ids = [...html.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicateIds.length) errors.push(`${file}: duplicate IDs ${duplicateIds.join(", ")}`);

  for (const [index, match] of [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].entries()) {
    try {
      const data = JSON.parse(match[1]);
      const nodes = data["@graph"] ?? [data];
      for (const node of nodes) {
        if (node["@type"] === "ProfilePage" &&
            (node.mainEntity?.["@type"] !== "Person" || !node.mainEntity?.name)) {
          errors.push(`${file}: ProfilePage mainEntity must be a named Person`);
        }
        if (node["@type"] === "ContactPage" && !node.mainEntity?.["@type"]) {
          errors.push(`${file}: ContactPage mainEntity must have an explicit type`);
        }
        if (node["@type"] === "CollectionPage" && node.author &&
            (!node.author["@type"] || !node.author.name)) {
          errors.push(`${file}: CollectionPage author must have an explicit type and name`);
        }
      }
    } catch (error) {
      errors.push(`${file}: invalid JSON-LD block ${index + 1}: ${error.message}`);
    }
  }

  for (const match of html.matchAll(/href=["']([^"']+)["']/gi)) {
    const href = match[1];
    if (/^(mailto:|tel:|sms:|javascript:)/i.test(href)) continue;

    let url;
    try {
      url = new URL(href, `${origin}/${file === "index.html" ? "" : file}`);
    } catch {
      errors.push(`${file}: invalid link ${href}`);
      continue;
    }

    if (url.origin !== origin) continue;
    const relativeTarget = url.pathname === "/" ? "index.html" : url.pathname.replace(/^\//, "");
    const target = path.join(root, relativeTarget);
    if (!fs.existsSync(target)) {
      errors.push(`${file}: missing internal target ${href}`);
      continue;
    }

    if (url.hash) {
      const targetHtml = fs.readFileSync(target, "utf8");
      const escapedId = url.hash.slice(1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (!new RegExp(`\\sid=["']${escapedId}["']`).test(targetHtml)) {
        errors.push(`${file}: missing fragment target ${href}`);
      }
    }
  }

  for (const match of html.matchAll(/\ssrc=["']([^"']+)["']/gi)) {
    const source = match[1];
    if (/^(data:|https?:\/\/)/i.test(source)) continue;
    const sourceUrl = new URL(source, `${origin}/${file === "index.html" ? "" : file}`);
    const relativeSource = sourceUrl.pathname.replace(/^\//, "");
    if (!fs.existsSync(path.join(root, relativeSource))) {
      errors.push(`${file}: missing local resource ${source}`);
    }
  }

  pages.push({ file, canonical: canonicals[0], title: titles[0] });
}

const canonicalUrls = pages.map((page) => page.canonical);
if (new Set(canonicalUrls).size !== canonicalUrls.length) errors.push("Duplicate canonical URLs detected");
const titles = pages.map((page) => page.title);
if (new Set(titles).size !== titles.length) errors.push("Duplicate page titles detected");

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (new Set(sitemapUrls).size !== sitemapUrls.length) errors.push("Duplicate URLs detected in sitemap.xml");
for (const canonical of canonicalUrls) {
  if (!sitemapUrls.includes(canonical)) errors.push(`Canonical missing from sitemap.xml: ${canonical}`);
}
for (const sitemapUrl of sitemapUrls) {
  if (!canonicalUrls.includes(sitemapUrl)) errors.push(`Non-canonical URL in sitemap.xml: ${sitemapUrl}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Site audit passed: ${htmlFiles.length} pages, ${canonicalUrls.length} unique canonicals, ${sitemapUrls.length} sitemap URLs.`);
