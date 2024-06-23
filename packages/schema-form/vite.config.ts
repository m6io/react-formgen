import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@m6oss/schema-form',
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
  plugins: [react()],
});
