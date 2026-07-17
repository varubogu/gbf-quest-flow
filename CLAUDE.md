# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

グラブル(グランブルーファンタジー)のクエスト行動表を作成・閲覧するサイト。
Astro(静的ビルド) + React(アイランド) + TypeScript + Tailwind CSS 4 + Zustand + i18next。
ランタイム・パッケージ管理は **Bun**。本番ホスティングは Cloudflare Pages。

アーキテクチャは `components/hooks → facades → services → stores` のレイヤー構造
(ESLintで強制)。詳細な規約は `.claude/rules/` に分離してある:

- `architecture.md` — レイヤー規則、ルーティング、i18n、ビルド特殊処理 (src/** を触ると適用)
- `coding-style.md` — 命名・型・JSDoc規約 (src/**/*.{ts,tsx,astro})
- `testing.md` — テスト・モック規約 (テストファイル・e2e)

## コマンド

```bash
bun install              # 依存関係のインストール
bun run dev              # 開発サーバー起動 (port 4321)
bun run build            # ビルド (postbuildで src/content/flows を dist/content/ へコピー)

# テスト
bun run test -- --run    # 単体・結合テスト (Vitest) を一度だけ実行
bun run test:watch       # watchモード
bunx vitest --run src/path/to/foo.test.tsx   # 単一ファイルのテスト実行
bun run test:coverage    # カバレッジ (閾値80%)
bun run test:e2e         # E2Eテスト (Playwright, port 4322 でサーバー起動)

# lint / format
bun run lint             # ESLint (flat config)
bun run check            # format:check + lint
bun run fix              # prettier --write + eslint --fix
```

## ハマりどころ

- ローカル実行には `.env` が必要(`.env.example` をコピー)。`PUBLIC_SITE_URL` 未設定だと
  `BaseLayout.astro` の `new URL(..., Astro.site)` がビルド時に落ちる。
- リポジトリ全体は Prettier 完全準拠ではない(format:check は多数のファイルで失敗する)。
  一括整形はせず、変更したファイルだけ `bunx prettier --write <file>` すること。

## その他のドキュメント

- `docs/project-structure.md` — フォルダ構造の詳細
- `docs/rules/coding-rule.md` / `docs/rules/testing-rule.md` — 規約の原典
- `docs/design/error-handling.md` — エラーハンドリング設計
