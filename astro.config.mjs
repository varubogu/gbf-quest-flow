// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [
      tailwindcss(),
      // {
      //   // 「data-testid="***"」を削除するプラグイン
      //   name: 'remove-data-testid',
      //   enforce: 'post', // トランスパイル後に適用
      //   apply: 'build', // ビルド時のみ適用（開発時は適用しない）

      //   transform(code, id) {

      //     // HTML、Astro、JSX、TSXファイルのみを処理
      //     if (!/\.(html|astro|jsx|tsx)$/.test(id)) {
      //       return code;
      //     }

      //     // HTMLファイルまたはAstroコンポーネントの場合
      //     if (/\.(html|astro)$/.test(id)) {
      //       // 複数行にまたがるタグも処理できるように改良した正規表現
      //       return code.replace(/(<[^>]*?)data-testid\s*=\s*(?<quote>["']).*?\k<quote>([^>]*?>)/gs, (match, before, _, after) => {
      //         // 前後の余分な空白を最適化
      //         return `${before.trimEnd()} ${after.trimStart()}`.replace(/\s{2,}/g, ' ');
      //       });
      //     }

      //     // JSX/TSXファイルの場合
      //     if (/\.(jsx|tsx)$/.test(id)) {
      //       try {
      //         // JSXタグ内のdata-testid属性を検出して削除
      //         // 注: 文字列内のdata-testidリテラルは影響を受けないよう配慮

      //         // JSXタグを検出するための正規表現
      //         const jsxTagRegex = /<[A-Za-z0-9_$.-]+[^>]*?>/gs;

      //         return code.replace(jsxTagRegex, (tag) => {
      //           // JSXタグ内のdata-testid属性を削除
      //           return tag.replace(/\s+data-testid\s*=\s*(?:\{.*?\}|(?<quote>["']).*?\k<quote>)/g, '');
      //         });
      //       } catch (e) {
      //         // eslint-disable-next-line no-undef
      //         console.warn(`Failed to process JSX in file ${id}:`, e);
      //         // エラーが発生した場合は元のコードを返す
      //         return code;
      //       }
      //     }
      //     return code;
      //   }
      // }
    ],
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
