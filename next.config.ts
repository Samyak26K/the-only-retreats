import os from "node:os";
import path from "node:path";
import type { NextConfig } from "next";

const windowsHomeTraceIgnore = "C:**";
const homeSegmentTraceIgnore = `**/${path.basename(os.homedir())}/**`;

const nextConfig: NextConfig = {
  staticPageGenerationTimeout: 120,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["@prisma/client"],
  experimental: {
    viewTransition: true,
  },
  // Next applies outputFileTracingExcludes after webpack compile. The webpack
  // TraceEntryPointsPlugin still globs os.homedir() during compile (NFT), which
  // hits Windows user-profile junctions like Cookies / Application Data.
  outputFileTracingExcludes: {
    "*": [windowsHomeTraceIgnore, homeSegmentTraceIgnore],
  },
  webpack: (config) => {
    for (const plugin of config.plugins ?? []) {
      if (plugin?.constructor?.name === "TraceEntryPointsPlugin") {
        plugin.traceIgnores = [
          ...(plugin.traceIgnores ?? []),
          windowsHomeTraceIgnore,
          homeSegmentTraceIgnore,
        ];
      }
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
