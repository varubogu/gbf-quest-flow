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
    // テスト間の分離を強化
    isolate: true,
    // テストの並列実行を完全に無効化
    maxConcurrency: 1
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'astro:content': resolve(__dirname, './src/test/mocks/content.ts'),
    },
  },
});
