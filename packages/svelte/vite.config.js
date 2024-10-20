import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  define: {
    "process.env": {}, // polyfill for web3modal
  },
  server: {
    fs: {
      allow: [".."], // Allow access to parent directories
    },
  },
  ssr: {
    noExternal: ['gun-avatar', 'vis-network', 'CanvasRenderingContext2D']
  },
  optimizeDeps: {
    include: ['ws']
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/]
    }
  }
});