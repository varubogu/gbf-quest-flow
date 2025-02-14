import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    exclude: [
      'e2e/**',
      '**/node_modules/**',
      '.bun/**',
      'dist/**'
    ],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'astro:content': resolve(__dirname, './src/test/mocks/content.ts'),
    },
  },
});
