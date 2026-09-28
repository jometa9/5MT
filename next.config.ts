import type { NextConfig } from "next";

// Static export: `next build` writes a plain HTML site to out/, deployable anywhere.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
