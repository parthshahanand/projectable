import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Demo builds have no backend, so ship them as a plain static site
  ...(process.env.NEXT_PUBLIC_DEMO === 'true' && { output: 'export' }),
  turbopack: {
    root: process.cwd()
  }
};






export default nextConfig;
