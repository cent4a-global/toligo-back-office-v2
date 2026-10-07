import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path"; // 1. Importer le module path

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 2. Définir le raccourci @ vers le dossier src
    },
  },
});
