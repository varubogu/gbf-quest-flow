import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'http://localhost:4321', // 適切なベースURLを設定
  },
});
