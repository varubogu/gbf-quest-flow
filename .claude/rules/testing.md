---
paths:
  - "**/*.test.{ts,tsx}"
  - "**/*.spec.{ts,tsx}"
  - "e2e/**/*"
  - "src/test/**/*"
  - "vitest.config.ts"
  - "playwright.config.ts"
---

# テスト規約 (詳細: docs/rules/testing-rule.md)

## 単体・結合テスト (Vitest + React Testing Library)

- テスト対象と同フォルダに `foo.test.ts(x)` を置く。jsdom / globals有効。
  setup は `src/test/setup.ts`。共有モックは `src/test/mocks/` に配置。
- コンポーネントには必ず単体テストを書く。
- カバレッジ閾値: statements/branches/functions/lines 各80%(`bun run test:coverage`)。

## モックの書き方

- モジュールモックは `@/...` エイリアスパスで `vi.mock` すること。
  相対パスは階層ミスでモックが黙って適用されない事故が起きやすい(過去に実例あり)。
- zustand ストアのモックはセレクタ対応にする:
  `default: (selector) => selector(mockState)`
- `vi.resetAllMocks()` は `mockImplementation` まで消す。describe レベルで実装を
  定義したモックには `vi.clearAllMocks()` を使う。
- `react-i18next` をモックする場合、`@/lib/i18n` を経由するコンポーネントでは
  `initReactI18next: { type: '3rdParty', init: vi.fn() }` のエクスポートも必要。

## E2Eテスト (Playwright)

- `e2e/pages/`(ページ単位)、`e2e/scenario/`(シナリオ)、`e2e/test-data/`、`e2e/utils/`。
- テストサーバーは port **4322** を使用(開発用4321とは別。設定済み)。
- ページ単位の命名: `src/pages/aaa.astro` → `/aaa` → `e2e/pages/aaa.spec.ts`
