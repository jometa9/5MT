// Downloads the Swagger page exactly as a running 5MTrader-MT5-API serves it into public/swagger/.
// Start the API first (e.g. BRIDGE_DATA_DIR=/tmp/5mt-data dotnet run in that repo), then:
//   npm run sync-swagger [-- http://127.0.0.1:7778]
// The only change is pointing the spec URL at the copied swagger.json; "Try it out" has no backend here.
import { mkdirSync, writeFileSync } from "node:fs";

const base = (process.argv[2] || "http://127.0.0.1:7778").replace(/\/$/, "") + "/swagger/";
const files = [
  "index.html", "index.css", "index.js", "swagger-ui.css", "swagger-ui-bundle.js",
  "swagger-ui-standalone-preset.js", "favicon-16x16.png", "favicon-32x32.png", "v1/swagger.json",
];

mkdirSync(new URL("../public/swagger/v1/", import.meta.url), { recursive: true });
for (const file of files) {
  const res = await fetch(base + file);
  if (!res.ok) throw new Error(`${base + file}: HTTP ${res.status}`);
  let body = Buffer.from(await res.arrayBuffer());
  if (file === "index.js") {
    // Relative spec URL, resolved against the page so it works under any base path, with or without index.html.
    const specUrl = '"url":"/swagger/v1/swagger.json"';
    const resolve = 'item.url = window.location.href.replace("index.html", item.url).split(\'#\')[0];';
    const js = body.toString("utf8");
    if (!js.includes(specUrl) || !js.includes(resolve)) throw new Error("index.js changed: cannot find the spec URL");
    body = Buffer.from(js.replace(specUrl, '"url":"v1/swagger.json"').replace(resolve, "item.url = new URL(item.url, window.location.href).href;"));
  }
  writeFileSync(new URL("../public/swagger/" + file, import.meta.url), body);
  console.log("synced public/swagger/" + file);
}
