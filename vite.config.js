import { defineConfig } from "vite";

export default defineConfig({
  base: "/daffodil/",
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
