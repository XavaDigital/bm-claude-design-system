/**
 * Renders the preview screens to a single self-contained HTML file.
 *
 * Server-side rendering with real Ant Design components rather than a mockup,
 * so what the file shows is what the package actually produces. Fonts are
 * embedded as data URIs because the output has to open anywhere with no
 * network access.
 */

import { renderToStaticMarkup } from "react-dom/server";
import { StyleProvider, createCache, extractStyle } from "@ant-design/cssinjs";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import * as React from "react";
import { StaffLight, StaffDark, CustomerEstore, CustomerGotyaback } from "./screens.js";
import { emitVarsCss, emitGlobalCss } from "../src/emit/css.js";
import { surfaces } from "../src/tokens/surfaces.js";

const ROOT = process.cwd();

function fontFace(family: string, pkg: string, file: string): string {
  const path = join(ROOT, "node_modules", pkg, "files", file);
  const b64 = readFileSync(path).toString("base64");
  return `@font-face {
  font-family: "${family}";
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  src: url(data:font/woff2;base64,${b64}) format("woff2-variations");
}`;
}

const fonts = [
  fontFace("Archivo Variable", "@fontsource-variable/archivo", "archivo-latin-wght-normal.woff2"),
  fontFace("Montserrat Variable", "@fontsource-variable/montserrat", "montserrat-latin-wght-normal.woff2"),
  fontFace("Inter Variable", "@fontsource-variable/inter", "inter-latin-wght-normal.woff2"),
].join("\n\n");

const cache = createCache();

function render(node: React.ReactElement): string {
  return renderToStaticMarkup(
    React.createElement(StyleProvider, { cache }, node),
  );
}

// Render every variant against ONE cache, so a single extracted stylesheet
// covers them all and the file has no duplicate rules.
const sections = [
  {
    id: "staff-light",
    title: "Staff tools — light",
    note: "bm-sales, MailFlow, DesignFlow, Team Games, the configurator. Indigo accent, Inter body, Archivo headings.",
    bg: surfaces.light.page,
    html: render(React.createElement(StaffLight)),
  },
  {
    id: "staff-dark",
    title: "Staff tools — dark",
    note: "The same screen on the four-step ramp: chrome #141414 behind the sidebar, page #191919, panels #212121, popups #2a2a2a.",
    bg: surfaces.dark.page,
    html: render(React.createElement(StaffDark)),
  },
  {
    id: "customer-estore",
    title: "Customer-facing — BM-estore",
    note: "Brand red #bf272d, Montserrat body, Archivo headings. Note the buttons at the bottom: only the affirmative action is a solid fill.",
    bg: surfaces.light.page,
    html: render(React.createElement(CustomerEstore)),
  },
  {
    id: "customer-gotyaback",
    title: "Customer-facing — GotYaBack",
    note: "The same layout on the other brand red #C8102E. Everything except the accent is shared with the screen above.",
    bg: surfaces.light.page,
    html: render(React.createElement(CustomerGotyaback)),
  },
];

const antdStyle = extractStyle(cache);

const page = `<!doctype html>
<html lang="en-NZ">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>BeastMode design system preview</title>
<style>
${fonts}
</style>
<style>
${emitVarsCss()}
</style>
${antdStyle}
<style>
${emitGlobalCss()}
</style>
<style>
  /*
    Every rule here is class-scoped and none reaches inside .pv-frame.
    Bare element selectors leak: an earlier version styled the page's own jump
    links with a nav-descendant rule, which also captured Ant Design's
    Breadcrumb (it renders inside a nav element) and drew a pill around the link
    with the text pushed to the bottom. A section-descendant paragraph rule
    likewise overrode the customer screen's body size. The same hazard applies
    to any app adopting the package with global element styles.
  */
  body { margin: 0; }
  .pv-page {
    background: #0d0d0f;
    font-family: "Inter Variable", system-ui, sans-serif;
    color: #e2e8f0;
    min-height: 100%;
  }
  .pv-shell { max-width: 1240px; margin: 0 auto; padding: 40px 20px 80px; }
  .pv-masthead { padding: 20px 0 34px; }
  .pv-title {
    font-family: "Archivo Variable", system-ui, sans-serif;
    font-size: 38px; font-weight: 700; letter-spacing: -.022em; margin: 0 0 10px;
  }
  .pv-lede { margin: 0 0 10px; max-width: 70ch; line-height: 1.6; color: #94a3b8; }
  .pv-sec { margin-bottom: 46px; }
  .pv-sec-head { padding: 0 0 12px; }
  .pv-sec-title {
    font-family: "Archivo Variable", system-ui, sans-serif;
    font-size: 19px; font-weight: 600; letter-spacing: -.012em; margin: 0 0 5px;
  }
  .pv-sec-note { margin: 0; font-size: 14px; line-height: 1.55; color: #94a3b8; max-width: 84ch; }
  .pv-frame {
    border: 1px solid #2e2e2e; border-radius: 10px; overflow: hidden;
    box-shadow: 0 16px 40px -8px rgba(2,6,23,.52);
  }
  .pv-nav { display: flex; flex-wrap: wrap; gap: 8px; padding-bottom: 30px; }
  .pv-nav > a {
    font-size: 13px; color: #a5b4fc; text-decoration: none;
    border: 1px solid #333; border-radius: 999px; padding: 5px 13px;
  }
  .pv-nav > a:hover { border-color: #6366f1; }
  .pv-foot { color: #737373; font-size: 13px; line-height: 1.6; border-top: 1px solid #2e2e2e; padding-top: 22px; max-width: 80ch; }
</style>
</head>
<body class="pv-page">
<div class="pv-shell">
  <div class="pv-masthead">
    <div class="pv-title">BeastMode design system preview</div>
    <p class="pv-lede">Real Ant Design components rendered through <code>@beastmode/ui</code> — not a mockup. The fonts, colours, corner radii and spacing below are exactly what the package produces today.</p>
    <p class="pv-lede">These are static snapshots, so nothing is clickable and hover states do not fire. Everything else is live output.</p>
  </div>

  <div class="pv-nav">
${sections.map((s) => `    <a href="#${s.id}">${s.title}</a>`).join("\n")}
  </div>

${sections
  .map(
    (s) => `  <section class="pv-sec" id="${s.id}">
    <div class="pv-sec-head">
      <div class="pv-sec-title">${s.title}</div>
      <p class="pv-sec-note">${s.note}</p>
    </div>
    <div class="pv-frame" style="background:${s.bg}">${s.html}</div>
  </section>`,
  )
  .join("\n\n")}

  <div class="pv-foot">
    Generated from the package source. Typography is Archivo for headings throughout, with Inter for staff body text and Montserrat for customer body text — all three embedded in this file, so what you see is the real typeface rather than a system substitute.
  </div>
</div>
</body>
</html>
`;

mkdirSync(join(ROOT, "preview", "out"), { recursive: true });
const outPath = join(ROOT, "preview", "out", "index.html");
writeFileSync(outPath, page, "utf8");
console.log(`wrote ${outPath} (${(page.length / 1024).toFixed(0)} KB)`);

/*
 * A second copy for publishing, which supplies its own document skeleton — so
 * this one emits body content only. The page chrome moves from <body> onto a
 * wrapper element, because a host page may own the body background.
 */
const fragment = page
  .replace(/^[\s\S]*?<title>/, "<title>")
  .replace(/<\/head>\s*<body class="pv-page">/, "")
  .replace(/<\/body>\s*<\/html>\s*$/, "")
  // The host supplies <body>, so the page chrome hangs off the wrapper instead.
  .replace(/<div class="pv-shell">/, '<div class="pv-page"><div class="pv-shell">')
  .replace(/<\/div>\s*$/, "</div></div>");

const fragPath = join(ROOT, "preview", "out", "artifact.html");
writeFileSync(fragPath, fragment, "utf8");
console.log(`wrote ${fragPath} (${(fragment.length / 1024).toFixed(0)} KB)`);
