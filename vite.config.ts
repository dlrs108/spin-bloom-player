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

export default defineConfig({
  base: "/spin-bloom-player/", 
  plugins: [
    tanstackStart({
      // 👇 加上这一段，强制开启静态预渲染
      prerender: {
        enabled: true, 
      },
    }),
    react(), 
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 别忘了你之前的路径别名
    },
  },
});
