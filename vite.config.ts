import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  // Ruta relativa: funciona en GitHub Pages (usuario.github.io/repositorio/) sin importar el nombre del repo
  base: "./",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
