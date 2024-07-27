import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "@react-formgen/yup",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "yup"],
      output: {
        globals: {
          react: "React",
          yup: "Yup",
        },
      },
    },
    minify: true,
  },
  plugins: [
    react(),
    visualizer({
      filename: "stats.html",
      open: false, // true to open stats page on build
    }),
  ],
});
