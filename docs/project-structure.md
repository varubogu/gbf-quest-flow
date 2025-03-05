# プロジェクトのフォルダ構造

```
.
├── astro.config.ts       # Astroの設定ファイル
├── bun.lock              # Bunパッケージマネージャのロックファイル
├── dist                  # ビルド後の成果物が格納されるディレクトリ（gitignore）
├── docs                  # プロジェクトのドキュメント
│   ├── error-handling.md # エラーハンドリングに関するドキュメント
│   ├── info.drawio       # 情報設計図
│   ├── main.drawio       # メインフロー図
│   ├── organization.drawio # 組織図
│   ├── project-arch.md   # プロジェクト構造のドキュメント（このファイル）
│   ├── prompt.md         # プロンプト関連のドキュメント
│   └── sample_data.json  # サンプルデータ
│
├── e2e                   # エンドツーエンドテスト(Playwright)
│   ├── pages             # ページ単位のテスト
│   ├── scenario          # シナリオベースのテスト
│   ├── test-data         # テスト用データ
│   └── utils             # テスト用Playwrightユーティリティ
│
├── eslint.config.js      # ESLintの設定ファイル
├── LICENSE               # ライセンスファイル
├── package.json          # パッケージ設定ファイル
├── playwright.config.ts  # Playwrightの設定ファイル
├── postcss.config.mjs    # PostCSSの設定ファイル
├── public                # Astroビルドにより配置される静的ファイル
│   ├── favicon.svg       # ファビコン
│   └── locales           # 多言語化リソース
│       ├── en            # 英語リソース
│       └── ja            # 日本語リソース
│
├── README.md             # プロジェクト概要
├── src                   # ソースコード
│   ├── assets            # 画像などの静的アセット
│   ├── components        # コンポーネント（主にsrc/core/hooksとsrc/core/facadesの呼び出し、src/core/storesの参照）
│   │   │
│   │   ├── atoms         # 最小単位のコンポーネント
│   │   │   ├── common    # 汎用的な最小単位のコンポーネント（ボタン、テキスト、メニューアイテムなど）
│   │   │   └── specific  # 特定の目的に特化した最小単位のコンポーネント（編成確認ボタン、メモ開閉ボタンなど）
│   │   │
│   │   ├── molecules     # 最小コンポーネントをいくつか組みあせて１つの目的で統合した中サイズのコンポーネント
│   │   │   ├── common    # 汎用的な中サイズのコンポーネント（テーブルテキストセル、テーブルヘッダー、など）
│   │   │   └── specific  # 特定の目的に特化した中サイズのコンポーネント
│   │   │
│   │   ├── organisms     # 特定のエリアを占めるような大きなコンポーネント（フォーム、テーブルなど）
│   │   │   ├── common    # 汎用的な大きなコンポーネント（テーブル、フォームなど）
│   │   │   └── specific  # 特定の目的に特化した大きなコンポーネント（
│   │   │
│   │   ├── templates     # ページのレイアウト（テンプレート）を構成するための一部エリアを占めるコンポーネント（ヘッダー、フッター、モーダル、サイドメニューなど）
│   │   │   ├── common    # 汎用的な大きなコンポーネント（ヘッダー、フッター、モーダル、サイドメニューなど）
│   │   │   └── specific  # 特定の目的に特化した大きなコンポーネント（武器パネル）
│   │   │
│   │   ├── styles        # スタイル定義（JavaScriptの文字列ベースでTailwind CSSのスタイルを定義する）
│   │   └── I18nProvider.tsx # 国際化プロバイダー
│   │
│   ├── config            # 設定ファイル
│   ├── const.ts          # 定数定義
│   ├── content           # コンテンツ関連
│   │   ├── config.ts     # コンテンツ設定
│   │   ├── flows         # フロー定義（内容は動的ルーティングで表示します。例：src/content/flows/abc.tsx → /abc ）
│   │   └── settings      # アプリ設定情報
│   │
│   ├── core              # コアロジック
│   │   ├── facades       # ファサードパターン実装（主にcomponents、hooksから呼び出す）
│   │   ├── hooks         # Reactフック
│   │   ├── services      # サービス層（主にfacades、またはservicesから呼び出す）
│   │   └── stores        # 状態管理（zustandを使用。読込処理の場合は直接参照し、更新処理の場合はservicesから呼び出す）
│   │
│   ├── layouts           # レイアウトコンポーネント（ページテンプレート）
│   │
│   ├── lib               # ライブラリ
│   │   ├── i18n          # 国際化関連
│   │   └── utils         # ユーティリティ関数（プログラミング言語を拡張したような関数を定義するなど）
│   │
│   ├── pages             # ページコンポーネント（Astroによりルーティングされます。例：src/pages/xyz.tsx → /xyz ）
│   │
│   ├── styles            # スタイル定義（Tailwind CSS）
│   │
│   ├── test              # 結合テストコード、モック関連
│   │   ├── mocks         # モックデータ
│   │
│   └── types             # 型定義
│
├── tailwind.config.js    # Tailwind CSSの設定
│
├── test-results          # テスト結果（gitignore）
│   └── screenshots       # スクリーンショット
│
├── tsconfig.json         # TypeScriptの設定
└── vitest.config.ts      # Vitestの設定
```

## 主要ディレクトリの説明

- **src**: アプリケーションのソースコードが格納されています
  - **components**: UIコンポーネントを階層的に管理（atoms, molecules, organisms）
  - **core**: ビジネスロジックやデータ管理の中核部分
  - **layouts**: ページレイアウトを定義するコンポーネント
  - **pages**: Astroのページコンポーネント
  - **types**: TypeScriptの型定義

- **e2e**: エンドツーエンドテスト関連のファイル
  - **pages**: 個別ページのテスト
  - **scenario**: ユーザーシナリオに基づくテスト
  - **utils**: テスト用のユーティリティ関数

- **public**: 静的ファイルやローカライズリソース

- **docs**: プロジェクトのドキュメント


