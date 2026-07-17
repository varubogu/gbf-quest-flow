---
paths:
  - "src/**/*.{ts,tsx,astro}"
---

# コーディング規約 (詳細: docs/rules/coding-rule.md)

- コンポーネントは関数コンポーネント。Props interface はファイル先頭に定義。JSDoc必須。
- `@typescript-eslint/explicit-function-return-type` が warn のため、関数には戻り値型を書く。
- `no-explicit-any` は error。テストでは `vi.mocked()` や `as unknown as T` を使う。
- パスエイリアス: `@/` → `src/`。
- 命名: フォルダ=kebab-case、コンポーネント/型/interface=PascalCase、関数/変数=camelCase、
  定数=UPPER_CASE。
