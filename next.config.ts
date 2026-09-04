import type { NextConfig } from "next";

const isVercel = process.env.VERCEL === "1";

const nextConfig: NextConfig = isVercel
  ? {
      // Vercel runs the native Next.js build, where Cloudflare's runtime module
      // is unavailable. Keep the UI deployable and let database-backed routes
      // return their existing graceful "unavailable" response until a Vercel
      // database adapter is configured.
      turbopack: {
        resolveAlias: {
          "cloudflare:workers": "./lib/vercel-cloudflare-workers.ts",
        },
      },
      typescript: {
        tsconfigPath: "tsconfig.vercel.json",
      },
    }
  : {};

export default nextConfig;
