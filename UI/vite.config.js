// vite.config.js — from theme.docx vite.config.js pattern
// Key concept: proxy rewrites /api → http://localhost:5000
// So every fetch("/api/user/login") in React becomes http://localhost:5000/user/login
// NO hardcoded backend URLs in any component — just /api/...

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
