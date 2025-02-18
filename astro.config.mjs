// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        external: [
          /\.test\.(ts|tsx)$/,
          /\.spec\.(ts|tsx)$/,
          /__tests__/,
          /__mocks__/,
          /src\/mocks\//,
          /vitest\.(config|setup)\.(ts|js)$/,
          /playwright\.config\.(ts|js)$/,
        ],
      },
    },
  },
});
