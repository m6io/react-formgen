import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "@react-formgen/json-schema",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [
        "react",
        // "ajv", //todo: decouple
        // "ajv-formats",
        // "zustand",
        // "json-schema",
      ],
      output: {
        globals: {
          react: "React",
          // ajv: "Ajv", //todo: decouple
          // "ajv-formats": "AjvFormats",
          // zustand: "Zustand",
          // "json-schema": "JsonSchema",
        },
      },
    },
    minify: true,
  },
  plugins: [
    react(),
    visualizer({
      filename: "dist/stats.html",
      open: true,
    }),
  ],
});
