---
paths:
  - "src/**/*"
---

# アーキテクチャ規則

## レイヤー構造 (ESLint の `import/no-restricted-paths` で強制)

```
components / hooks → facades → services → stores (zustand)
```

- **components** (`src/components/`): services を直接参照禁止。facade 経由で呼ぶ。
  状態の「読み込み」だけは stores を直接参照してよい(セレクタで購読)。
- **facades** (`src/core/facades/`): components/hooks から呼ばれる窓口。stores 直接参照は禁止
  (service 経由にする)。
- **services** (`src/core/services/`): ビジネスロジック。facades/hooks/components への逆参照禁止。
- **stores** (`src/core/stores/`): zustand ストア。上位レイヤーへの参照禁止。
  `settingsStore` は `persist` ミドルウェアで localStorage(`app-settings`)に保存。

## コンポーネント構成

Atomic Design: `atoms / molecules / organisms / templates`、各層に `common`(汎用) と
`specific`(グラブル固有) のサブフォルダ。レイアウト(`src/layouts/`)は Astro と React 混在。

## ルーティングとデータ

- コンテンツは Content Layer API のコレクション(`src/content.config.ts`、glob loader)。
  `src/content/flows/` 配下の JSON が記事データで、動的ルーティングで表示される:
  - `src/content/flows/abc.json` → `/abc` (`src/pages/[articleId].astro`)
  - `src/content/flows/user1/xyz.json` → `/user1/xyz` (`src/pages/[userId]/[userArticleId].astro`)
  - パス生成ロジックは `src/lib/utils/routing.ts`(エントリの `filePath` を解析)
- Astro ページは `BaseLayout.astro` → React の `BodyLayout`(`client:load`)を挟んで
  ほぼ全UIをReactで描画する構成。

## i18n

- `src/lib/i18n/index.ts` で i18next を初期化(ja/en、リソースは locales/*.json を束ねる)。
- Astro側(サーバー)は `src/lib/i18n` のインスタンス、React側は `react-i18next` の
  `useTranslation` を使う。言語設定は `settingsStore` の `language`('日本語' | 'English')。

## ビルドの特殊処理

- `astro.config.ts` に本番ビルド時のみ `data-testid` 属性を全て除去するカスタム vite プラグインあり。
  テストはこの属性に依存してよいが、本番HTMLには残らない。
- Tailwind 4 は `@tailwindcss/vite` プラグイン経由(旧 `@astrojs/tailwind` は不使用)。
