// Copies the real web panel from the 5MTrader-MT5-API repo into public/panel/,
// adding only the mock backend script. Run after changing the panel: npm run sync-panel
import { readFileSync, writeFileSync } from "node:fs";

const src = new URL("../../5MTrader-MT5-API/wwwroot/index.html", import.meta.url);
const dest = new URL("../public/panel/index.html", import.meta.url);
const anchor = "</main>\n<script>\n";

const html = readFileSync(src, "utf8");
if (html.split(anchor).length !== 2) throw new Error("panel layout changed: cannot find where to inject mock.js");
writeFileSync(dest, html.replace(anchor, '</main>\n<script src="/panel/mock.js"></script>\n' + anchor.slice(8)));
console.log("synced public/panel/index.html");
