import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["typeflow-icon.svg"],
      manifest: {
        name: "TypeFlow",
        short_name: "TypeFlow",
        description: "An accessible writing space that keeps your work on your device.",
        theme_color: "#f7f8fc",
        background_color: "#f7f8fc",
        display: "standalone",
        start_url: "/",
        icons: [{ src: "/typeflow-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }]
      },
      workbox: { globPatterns: ["**/*.{js,css,html,svg,ico,png,woff2}"] }
    })
  ]
});
