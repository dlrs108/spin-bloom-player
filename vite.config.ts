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
import tailwindcss from "@tailwindcss/vite";
// 👇 补上这两个 Node.js 核心模块的引入
import path from "node:path";
import { fileURLToPath } from "node:url";

// 👇 在 ESM 环境中重新定义 __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/spin-bloom-player/", 
  plugins: [
    tanstackStart({
      // 👇 强制开启预渲染，这样才会生成 index.html
      prerender: {
        enabled: true,
        crawlLinks: true, 
      },
      // 👇 之前报错提示缺少 Lovable context，加上这个强制开启静态打包
      nitro: {
        preset: 'static'
      }
    }),
    react(), 
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
