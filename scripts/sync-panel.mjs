// Copies the real web panel pages (dashboard and history) from the 5MTrader-MT5-API repo into
// public/panel/, adding only the mock backend script and making asset paths relative (the site may
// live under a sub-path). Run after changing the panel: npm run sync-panel
import { readFileSync, writeFileSync } from "node:fs";

const anchor = "</main>\n<script>\n";

for (const page of ["index.html", "history.html"]) {
  const src = new URL("../../5MTrader-MT5-API/wwwroot/" + page, import.meta.url);
  const dest = new URL("../public/panel/" + page, import.meta.url);

  const html = readFileSync(src, "utf8");
  if (html.split(anchor).length !== 2) throw new Error(page + " layout changed: cannot find where to inject mock.js");
  const out = html
    .replace(anchor, '</main>\n<script src="mock.js"></script>\n' + anchor.slice(8))
    .replaceAll('"/cube.svg"', '"../cube.svg"')
    // The API button opens the Swagger page, which the landing serves as a static copy (npm run sync-swagger).
    .replaceAll("location.href='/swagger'", "location.href='../swagger/index.html'");
  writeFileSync(dest, out);
  console.log("synced public/panel/" + page);
}
