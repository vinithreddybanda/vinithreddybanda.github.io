import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://vinithreddybanda.github.io",
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
});