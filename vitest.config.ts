import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['e2e/**', '**/node_modules/**', '.bun/**', 'dist/**'],
    isolate: true,
    maxConcurrency: 1,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'e2e/**',
        '**/*.test.{ts,tsx}',
        '**/*.config.{ts,js}',
        'coverage/**',
        '.astro/**',
        '.bun/**',
        '.output/**',
        '.vscode/**',
        '.git/**',
        '.idea/**',
        '.cache/**',
        '.history/**',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
