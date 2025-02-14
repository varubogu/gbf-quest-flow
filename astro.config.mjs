// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        external: [
          /\.test\.(ts|tsx)$/,
          /\.spec\.(ts|tsx)$/,
          /__tests__/,
          /src\/mocks\//, // モックファイルも除外
          /vitest\.(config|setup)\.(ts|js)$/, // Vitestの設定ファイルも除外
          /playwright\.config\.(ts|js)$/, // Playwrightの設定ファイルも除外
        ],
      },
    },
  },
});