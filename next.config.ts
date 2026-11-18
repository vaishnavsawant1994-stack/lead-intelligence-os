import type { NextConfig } from "next";

// Tailwind CSS v4 uses the installed Turbopack loader. Without this rule,
// @import "tailwindcss" is left uncompiled and all utility classes are inert.
// Keep the CSS resource type unchanged so CSS modules keep working.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
      },
    },
  },
};

export default nextConfig;
