import type { NextConfig } from "next";

// GitHub Pages serves the site under /<repo>/; the deploy workflow passes that prefix in
// PAGES_BASE_PATH. Locally it is empty and the site is served from /.
const basePath = process.env.PAGES_BASE_PATH || "";

// Static export: `next build` writes a plain HTML site to out/, deployable anywhere.
const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  // Plain <img>/<iframe> paths and metadata icons do not get basePath added automatically.
  env: { BASE_PATH: basePath },
};

export default nextConfig;
