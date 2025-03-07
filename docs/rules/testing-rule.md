# testing

## 自動テストについて

テストは以下の分類とする

1. 単体テスト
  - 単一の関数などのロジックを１つのみテストする
  - テストフレームワークとしてvitestを使用する（jestは使用しない）
  - 配置場所については、テスト対象のファイルと同一フォルダ内に同名＋.test.tsという命名のファイルを作成する
    - 例：`aaa.ts` → `aaa.test.ts`  `bbb.tsx` → `bbb.test.tsx`
  - テスト対象のコンポーネントでimportするケースについてはそのimport対象をmock化する（mockは`src/test/mocks`に配置する）

2. 結合テスト
  - コンポーネントなど、複数の要素が組み合わさってそれらが連携するか（プロジェクト内部で確認できる範囲）を確認する
  - コンポーネント内部のロジックはそのまま使用する
  - プロジェクト内に存在しないものにアクセスする場合、mock化してテストを実行する（モックは`src/test/mocks`に配置する）
  - テストコードの配置場所は元のコードファイルが`src/components/`なら`src/test/components/`に配置する
    - 例：`src/components/aaa.tsx` → `src/test/components/aaa.test.tsx`
  - テストフレームワークとしてvitestとReact Testing Libraryを使用する（jestは使用しない）

3. E2Eテスト
  - シナリオに沿ってユーザー操作とブラウザ表示をエミュレートし、全体を通して正常に動作するか確認する
  - テストフレームワークとしてPlayWrightを使用する
  - テストにあたってサーバーを起動するが、その際デバッグ起動用ポート（4321）は使用せず、テストサーバー用ポート（4322）を使用する。※設定済み

  - テストコードの配置場所は`src/e2e/`の配下に下記ディレクトリ構成で配置する
    - ページ単位のテスト -> `src/e2e/pages/`
    - シナリオベースのテスト -> `src/e2e/scenario/`
    - テスト用データ -> `src/e2e/test-data/`
    - テスト用ユーティリティ -> `src/e2e/utils/`
  - テストファイルの命名規則
    - ページ単位の場合: `src/pages/aaa.astro` -> (実際のURL)`/aaa` -> `src/e2e/pages/aaa.spec.ts`
    - シナリオベースの場合: `src/e2e/scenario/edit-complete.spec.ts`
    - テスト用データ -> `src/e2e/test-data/sample.json`
    - テスト用ユーティリティ -> `src/e2e/utils/xxx.spec.ts`

### テストに使用するコマンドについて

- vitestの場合、`bun run test`で実行する
- Playwrightの場合、`bun run test:e2e`で実行する
- npm系のテスト（`npm test`, `npm run test`）や、bunのtest（`bun test`）は使用しないこと

