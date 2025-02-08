// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),

  ],
  vite: {
    // Bunを使用する設定
    server: {
      force: true
    },

    plugins: [tailwindcss()]
  }
});