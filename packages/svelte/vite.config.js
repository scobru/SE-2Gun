import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";


export default defineConfig({
  plugins: [sveltekit()],
  define: {
    "process.env": {}, // polyfill for web3modal
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
  ssr: {
    noExternal: ['gun-avatar','vis-network','CanvasRenderingContext2D']
  },
  optimizeDeps: {
    include: ['gun-avatar']
  }
});
