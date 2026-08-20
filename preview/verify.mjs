import puppeteer from "puppeteer-core";
import { pathToFileURL } from "node:url";
import { join } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const url = pathToFileURL(join(process.cwd(), "preview", "out", "index.html")).href;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new" });
let failures = 0;

function check(label, actual, expected) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}: ${actual}${ok ? "" : `  (expected ${expected})`}`);
}

for (const scheme of ["light", "dark"]) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: scheme }]);
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);

  const r = await page.evaluate(() => {
    const pick = (sel) => document.querySelector(sel);
    const bg = (el) => (el ? getComputedStyle(el).backgroundColor : "missing");
    const bc = (el) => (el ? getComputedStyle(el).borderTopColor : "missing");
    return {
      lightSider: bg(pick("#staff-light .ant-layout-sider")),
      lightCard: bg(pick("#staff-light .ant-card")),
      lightCardBorder: bc(pick("#staff-light .ant-card")),
      darkSider: bg(pick("#staff-dark .ant-layout-sider")),
      darkCard: bg(pick("#staff-dark .ant-card")),
      customerCardBorder: bc(pick("#customer-estore .ant-card")),
      customerInputBorder: bc(pick("#customer-estore .ant-input")),
    };
  });

  console.log(`\n--- prefers-color-scheme: ${scheme} ---`);
  // The bug: light and dark surfaces sharing a CSS-variable key made the light
  // one render dark. These four assertions are what would have caught it.
  check("staff light sidebar is white", r.lightSider, "rgb(255, 255, 255)");
  check("staff light card is white", r.lightCard, "rgb(255, 255, 255)");
  check("staff dark sidebar is #141414", r.darkSider, "rgb(20, 20, 20)");
  check("staff dark card is #212121", r.darkCard, "rgb(33, 33, 33)");
  // Ant Design draws the card edge from the SECONDARY border token, so staff
  // cards land on the quietest value in the set and customer cards are lifted
  // to the full-strength one.
  check("staff card border is #eef2f7", r.lightCardBorder, "rgb(238, 242, 247)");
  check("customer card border is #cbd5e1", r.customerCardBorder, "rgb(203, 213, 225)");

  await page.close();
}

console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);

try {
  await browser.close();
} catch (err) {
  console.warn("cleanup:", err.message);
}
process.exit(failures === 0 ? 0 : 1);
