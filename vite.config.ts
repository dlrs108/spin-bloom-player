// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.


// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path"; // 引入 path 模块

export default defineConfig({
  base: "/spin-bloom-player/", 
  plugins: [
    tanstackStart({
      target: "static", 
    }),
    react(), 
  ],
  // 👇 加上这一段，告诉 Vite @ 代表 src 目录
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
