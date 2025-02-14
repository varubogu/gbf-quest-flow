import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'http://localhost:4321', // 適切なベースURLを設定
    // ナビゲーションのタイムアウトを設定
    navigationTimeout: 60000,
    // アクションのタイムアウトを設定
    actionTimeout: 60000,
  },
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    // サーバー起動のタイムアウトを設定
    timeout: 120000,
  },
  testDir: './e2e',
  /* テストファイルのパターン */
  testMatch: '**/*.spec.ts',
  // テスト全体のタイムアウトを設定
  timeout: 60000,
  // リトライを設定
  retries: process.env.CI ? 2 : 0,
});
