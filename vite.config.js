import path from "path"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"
import react from "@vitejs/plugin-react-swc"

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  build: {
    minify: mode === "production",
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, "./src/assets"),
      components: path.resolve(__dirname, "./src/js/components"),
      config: path.resolve(__dirname, "./src/js/config"),
      styles: path.resolve(__dirname, "./src/styles"),
      services: path.resolve(__dirname, "./src/js/services"),
      utils: path.resolve(__dirname, "./src/js/utils"),
    },
  },
  plugins: [svgr(), react()],
  server: {
    port: 3000,
  },
}))
