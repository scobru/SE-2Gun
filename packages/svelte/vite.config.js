import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import commonjs from "@rollup/plugin-commonjs";

export default defineConfig({
  plugins: [sveltekit(), commonjs()],
  define: {
    "process.env": {}, // polyfill for web3modal
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
});
