import puppeteer from "puppeteer-core";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import { mkdirSync } from "node:fs";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const page_url = pathToFileURL(join(process.cwd(), "preview", "out", "index.html")).href;
const outDir = join(process.cwd(), "preview", "out");
mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--allow-file-access-from-files", "--font-render-hinting=none"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 1000, deviceScaleFactor: 2 });
await page.goto(page_url, { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);

const ids = ["staff-light", "staff-dark", "customer-estore", "customer-gotyaback"];
for (const id of ids) {
  const el = await page.$(`#${id} .pv-frame`);
  if (!el) {
    console.log(`MISSING: ${id}`);
    continue;
  }
  const file = join(outDir, `${id}.png`);
  await el.screenshot({ path: file });
  const box = await el.boundingBox();
  console.log(`${id}: ${Math.round(box.width)}x${Math.round(box.height)} -> ${file}`);
}

// Sanity check: did the fonts actually apply, or did we silently fall back?
const fontCheck = await page.evaluate(() => {
  const h = document.querySelector("#staff-light h3");
  const cell = document.querySelector("#staff-light .ant-table-cell");
  const out = {
    headingFamily: h ? getComputedStyle(h).fontFamily : "no heading found",
    bodyFamily: cell ? getComputedStyle(cell).fontFamily : "no cell found",
    archivoLoaded: document.fonts.check('700 22px "Archivo Variable"'),
    interLoaded: document.fonts.check('400 14px "Inter Variable"'),
    montserratLoaded: document.fonts.check('400 16px "Montserrat Variable"'),
  };
  return out;
});
console.log("font check:", JSON.stringify(fontCheck, null, 2));

// Windows holds a lock on the temp profile, so puppeteer's cleanup throws
// EPERM after the work is already done. Failing the script on that would make
// a successful run look broken.
try {
  await browser.close();
} catch (err) {
  console.warn("browser cleanup failed (screenshots are already written):", err.message);
}
