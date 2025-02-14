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
    maxConcurrency: 1,
    // カバレッジレポートの設定
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.{ts,tsx}',
        '**/*.d.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      }
    },
    // テストのタイムアウト設定
    testTimeout: 10000,
    // スナップショットの設定
    snapshotFormat: {
      printBasicPrototype: false,
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'astro:content': resolve(__dirname, './src/test/mocks/content.ts'),
    },
  },
});
