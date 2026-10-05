# 使いやすさ改善ロードマップ

作成日: 2026-09-07
対象リポジトリ: `varubogu/gbf-quest-flow`

この文書は、ユーザビリティ改善要望に対する現状分析・方針・実施順をまとめた計画である。
実装は本計画の合意後、作業単位ごとにブランチを切って進める。

## 要望と既存 Issue の対応

| 要望 | 既存 Issue | 本計画での扱い |
| --- | --- | --- |
| 使用するライブラリの最新化 | なし（Dependabot は devcontainers のみ） | 新規作業 A |
| よりモダンなツールへの移行 | [#6 shadcn/ui の導入](https://github.com/varubogu/gbf-quest-flow/issues/6) | 新規作業 B（#6 を拡張） |
| スクロール周りで引っかかる現象 | なし | 新規作業 C（バグ修正） |
| デザインの強化 | #6 | 作業 B / D と一体で進める |
| 編成の入力候補（テキスト＋選択肢のハイブリッド） | [#2 一部項目に入力補助の実装](https://github.com/varubogu/gbf-quest-flow/issues/2) | 既存 #2 を実装 |
| スマホ・タブレット向けレイアウト | [#4 スマホ対応](https://github.com/varubogu/gbf-quest-flow/issues/4) | 既存 #4 を実装 |
| 公開クラウドデータの URL 読み込み | なし（[#5 投稿機能](https://github.com/varubogu/gbf-quest-flow/issues/5) は別件） | 新規作業 E |

関連するが今回のスコープ外:

- [#3 一覧表示機能](https://github.com/varubogu/gbf-quest-flow/issues/3) … 検索・タグ・属性フィルタ
- [#5 投稿機能](https://github.com/varubogu/gbf-quest-flow/issues/5) … 認証・D1・GitHub 同期。URL 読み込みは「他人が既に公開した JSON を開く」だけに限定し、投稿基盤は作らない

## 現状サマリ

### 技術スタック

すでに比較的新しい構成である。

- Astro 7.1.0（最新は 7.3.1）+ Vite 8 / Rolldown
- React 19.2 / Tailwind CSS 4.3 / Zustand 5 / i18next 26
- Bun + Cloudflare Pages
- UI は Headless UI v2（Dialog / Tab）+ 自前 Sheet + Radix Slot のみ
- `globals.css` に shadcn 風の CSS 変数と `.dark` があるが、ダークモードは未使用
- Atomic Design（atoms / molecules / organisms / templates）と `hooks → facades → services → stores` は維持する

### 編成入力

- `SuggestTextInput` は実装済みで、覚醒タイプにだけ使われている
- ジョブ名・特殊装備・アビリティ・キャラ名・武器名・召喚石は素の `<input>`
- `src/config/suggest.ts` の奥義/ガード候補（`〇` / `✖`）は未接続
- ジョブ名・アビリティ候補は `src/config/jobs.ts` と i18n に存在する
- Flow モデルには将来のサジェスト用 `key` フィールドが既にある（コミット `57099f2`）

### スクロール

閲覧モードの行動表は `useTableScroll` が `wheel` を `preventDefault` し、行選択に変換している。
タッチパッド判定（`deltaMode === 0`）と累積しきい値、ネストした `overflow`、sticky ヘッダーの `top-12` 固定、`useAutoResizeTextArea` の `window.scrollTo` が複合して「引っかかる」主因になりやすい。

### モバイル

レスポンシブ用の `sm:` / `md:` はほぼ未使用。ヘッダーボタン列・縦分割パネル・編成モーダルの横タブ・多列表は縦画面で破綻しやすい。

### データ読み込み

- リポジトリ内 JSON（Content Layer）→ `/articleId` または `/userId/userArticleId`
- ローカル JSON ファイルの選択読み込み
- `src/pages/index.astro` に `?d=sample` のコメントがあるが未実装
- 外部 URL からの fetch は存在しない

## 方針

1. **フレームワークは変えない。** Astro + React アイランド + Bun + Zustand + Vitest/Playwright は現状の用途（静的ホスティング + クライアント編集）に合う。Next.js への移行はコストに見合わない。
2. **UI 基盤は shadcn/ui（Base UI プリミティブ）へ寄せる。** 2026年7月以降 shadcn のデフォルトは Base UI。Combobox がハイブリッド入力に直結する。既存 #6 の方針（`src/components/ui` に置き、Atomic Design 層から使う）を踏襲する。
3. **一括 Prettier はしない。** リポジトリは完全準拠ではない。変更ファイルだけ整形する。
4. **破壊的なリンタ移行（Biome 全面置換など）はしない。** ESLint + Prettier を維持し、依存のパッチ/マイナー更新に留める。
5. **公開 URL 読み込みは投稿機能 (#5) と分離する。** Cloudflare Pages Function（または薄い Worker）で CORS/SSRF を吸収し、クライアントはクエリ `?url=` で開けるようにする。

## 実施順

依存が少なく、体感改善が大きい順。

```
A ライブラリ最新化
        ↓
C スクロール修正          ← 単独で先行可
        ↓
B shadcn/ui + Base UI 導入（#6） / デザイン強化
        ↓
D スマホ・タブレット最適化（#4）   ← B の Dialog/Sheet/Tabs を使う
E 編成サジェスト（#2）             ← B の Combobox を使う（既存 SuggestTextInput でも開始可）
F 公開 URL 読み込み               ← 独立。B/D と並行可
```

### A. ライブラリ最新化

目的: 既知のパッチを取り込み、後続の UI 移行の土台を揃える。

対象（2026-09 時点の差分）:

- `astro` 7.1.0 → 7.3.1
- `@astrojs/react` 6.0.1 → 6.0.5
- `react` / `react-dom` 19.2.0 → 19.2.8
- `i18next` 26.3.6 → 26.4.2
- `lucide-react` 1.24.0 → 1.42.0
- `zustand` 5.0.14 → 5.0.15
- その他パッチ（postcss, react-i18next, react-resizable-panels など）

作業:

1. `bun update` 相当で SemVer の範囲内を更新し、`bun.lock` を更新する
2. `bun run test -- --run` と `bun run build` を通す
3. Dependabot に `npm`（実態は bun.lock）を追加するか検討。現状は `devcontainers` のみ

やらないこと: メジャーアップグレードをこの作業に混ぜない。Headless UI の削除は B で行う。

受け入れ条件:

- 既存テストが通る
- Cloudflare Pages 向けビルドが通る
- 画面の目視回帰がない（トップ・閲覧・編集・編成モーダル）

### B. モダン UI 基盤（shadcn/ui + Base UI）とデザイン強化

既存 #6 を実装し、見た目と操作性を一段上げる。

導入方針:

- `src/components/ui/` に shadcn コンポーネントを置く
- `atoms` / `molecules` / `organisms` / `templates` は `ui` を使うラッパに留める（レイヤー規則は維持）
- プリミティブは **Base UI**（shadcn 2026年7月以降のデフォルト）。Radix は Slot 以外を増やさない
- Headless UI の Dialog / Tab を shadcn の Dialog / Tabs に置換したら `@headlessui/react` を削除する

最初に入れるコンポーネント:

- Button, Input, Textarea, Dialog, Tabs, Sheet, Dropdown Menu, Combobox, Tooltip, Badge, Separator

デザイン強化の具体項目:

- CSS 変数（`--primary` など）を実際のコンポーネントに接続する
- ヘッダー・サイドメニュー・モーダルの余白・タイポ・フォーカスリングを統一する
- 閲覧モードの選択行ハイライトをコントラスト比 WCAG AA 以上にする
- ダークモードは「変数は維持、テーマ切替は任意」。必須ではない
- グラブルらしい装飾（過度なゲーム UI 化）より、情報密度を保った読みやすさを優先する

受け入れ条件:

- 既存の編集/閲覧フローが同等に操作できる
- Headless UI 依存がゼロ、または移行計画が残件リストで明示されている
- ボタン・ダイアログ・タブのキーボード操作とフォーカスが通る

### C. スクロール引っかかりの解消

バグ修正。B より先でも後でもよいが、体感が大きいので A の直後を推奨。

想定原因（優先して検証）:

1. `src/core/hooks/ui/table/useTableScroll.ts`
   - 閲覧モードでコンテナ内のすべての `wheel` を `preventDefault`
   - タッチパッドを `deltaMode === 0` で判定し、累積 35px で行送り。慣性スクロールが「食われる」
   - `currentRow` 変更のたびに `scrollTo({ behavior: 'smooth' })` が走り、ユーザー操作と競合する
2. 二重スクロール
   - `FlowLayout` の Panel が `overflow-auto`
   - 内側の `Table` も `overflow-y-auto`
3. sticky ヘッダーの `top-12` 固定（コントロールバー高さ変動でズレる）
4. `useAutoResizeTextArea` が `window.scrollTo` でページジャンプを補正している（モーダル内では逆効果になりうる）
5. モバイルではホイールが無く、行送りがボタン/キーボード依存

修正方針:

- 閲覧モードの行送りは「ホイールを全部奪う」のではなく、テーブル領域にフォーカスがあるときだけ、または明示的な「行送りモード」にする
- タッチパッド/トラックパッドでは通常スクロールを優先し、行選択はクリック・キー・コントロールバーに任せる
- 自動 `scrollIntoView` は `smooth` を避け、選択行が隠れたときだけ補正する
- スクロールコンテナを1つに絞る（パネル側かテーブル側か）
- sticky オフセットは実測高さから計算する
- テキストエリア自動リサイズは親コンテナの `scrollTop` を保存/復元する

検証:

- マウスホイール、ノートPCトラックパッド、スマホタッチの3系統
- 閲覧 / 編集 / 編成モーダル / メモパネル開閉
- 既存 `useTableScroll.test.ts` を新仕様に合わせて更新

### D. スマホ・タブレット最適化（#4）

#4 の要件: 縦画面を主対象。横画面は現状でもおおむね使える。タブレットの分割表示も考慮。

ブレークポイント目安:

- 〜639px: スマートフォン縦
- 640〜1023px: タブレット / 分割画面
- 1024px〜: 現行デスクトップレイアウト

具体策:

1. **ヘッダー**
   - タイトルを省略表示
   - 保存/キャンセル/メモ/編成はアイコン優先、テキストは `md:` 以上
   - はみ出しはメニューへ退避
2. **メイン**
   - 狭い幅では `react-resizable-panels` の縦50/50をやめ、メモは折りたたみ（デフォルト閉じ）+ 行動表フルハイト
   - タブレット横/分割ではパネル分割を維持しつつ `minSize` を上げる
3. **行動表**
   - 横スクロールを明示（シャドウやスクロールヒント）
   - 編集時の +/- ボタンのタップ領域 44px 以上
   - 閲覧時の行送りボタンを大きくする
4. **編成モーダル**
   - 横タブが折り返す/スクロールする
   - 高さは `dvh`、セーフエリアを考慮
   - 表はカード型スタックに切り替え（ジョブ/キャラ/武器/召喚）
5. **サイドメニュー**
   - 幅を画面幅に近づける（現行 `w-[150px]` は狭い）

受け入れ条件:

- 390×844 と 768×1024 で、新規作成・ファイル読込・閲覧・編集・編成確認が最後までできる
- 横スクロールが必要な表は、本文と同時に縦スクロールがロックされない
- E2E にモバイル viewport ケースを少なくとも1本追加する

### E. 編成のハイブリッド入力（#2）

#2 の対象（編集モード）:

- 奥義（◯/×、手入力可）
- ガード（◯/×、手入力可）
- ジョブ、特殊装備、アビリティ（特殊装備・アビリティはジョブ依存。通常アビリティとジョブ専用の2種。JSON で持つ）
- キャラ覚醒タイプ（指定なし、バランス、攻撃、防御、連撃）… 一部実装済み
- スキル効果量
- その他情報のクエスト

追加で今回の要望に含める:

- キャラ名、武器名、召喚石名（候補があれば出す。無くても自由入力可）

実装方針:

- 自由入力を捨てない。候補選択はショートカット
- B 完了後は shadcn Combobox を第一候補。B より先に着手する場合は既存 `SuggestTextInput` でよい
- 候補データは `src/config/` と i18n、必要なら `src/content/settings/` に JSON として置く
- Flow の `key` にマスタ ID を保存し、`name` は表示用（未選択の自由入力は `key` 空、`name` のみ）
- ジョブ変更時に、紐づかない特殊装備/アビリティは消さず警告する（ユーザーデータを壊さない）

候補データの範囲:

- ジョブ・アビリティ: 既存 `jobs.ts` を JSON 化し、ジョブ→装備/アビリティの対応表を追加
- 覚醒: 既存 `characterAwakeTypeSuggest`
- 奥義/ガード: 既存 `chargeAttackSelect` / `guardSelect`
- スキル効果量: `skillEffects.json` の `key` をラベル化
- クエスト: `src/config/quests.ts`
- キャラ/武器/召喚: 全マスタを最初から完備しない。よく使うもの + ユーザーが一度入力した履歴（localStorage）から始める

受け入れ条件:

- 候補から選んでも、候補に無い文字列を確定しても保存できる
- キーボード（↓↑ Enter Esc Tab）とタップの両方で選べる
- 既存 JSON（`key` 空、`name` のみ）を壊さず開ける

### F. 公開クラウドストレージの URL 読み込み

#5（投稿・認証・D1）とは別機能。「リンクを知っている人は誰でも閲覧可」な JSON を、このサイトの URL を指定して開く。

想定ソース:

| ソース | 例 | 備考 |
| --- | --- | --- |
| 汎用 HTTPS | `https://example.com/flow.json` | CORS が許可されていれば直接 fetch |
| Google Drive | `https://drive.google.com/file/d/<id>/view?usp=sharing` | ブラウザ直 fetch は CORS で失敗しやすい |
| Dropbox | `...&dl=0` 共有リンク | raw URL へ正規化 |
| GitHub / Gist raw | `https://raw.githubusercontent.com/...` | 比較的素直 |
| OneDrive | 共有リンク | 正規化が必要。初期は「可能なら」 |

UX:

- 共有用: `https://<本サイト>/?url=<encodeURIComponent(元URL)>`
- 空画面とサイドメニューに「URL から開く」
- 成功時は閲覧モード。失敗時は理由を表示（CORS、JSON 不正、サイズ超過、非 HTTPS）
- `index.astro` の未実装コメント `?d=sample` は、リポジトリ内コンテンツ用のショートカットとして別途実装してよい（`?d=` は内部 ID、`?url=` は外部）

技術:

- クライアント直 fetch を試し、CORS 失敗時は Pages Function `/api/fetch-flow?url=` にフォールバック
- サーバ側制約:
  - HTTPS のみ
  - プライベート IP / メタデータ IP 禁止（SSRF）
  - リダイレクト回数上限
  - レスポンス上限（例: 1MB）
  - `Content-Type` が JSON 系であること
  - `flowSchema` で validate
- Google Drive は file id を `uc?export=download&id=` に正規化する
- 読み取り専用。他人の Drive へ書き込まない
- Function はキャッシュしてよい（短 TTL）

受け入れ条件:

- 公開 JSON の URL を `?url=` 付きで開くと行動表が表示される
- 不正 JSON / 非公開リンク / 巨大ファイルはアプリが落ちずエラー表示
- 既存のローカルファイル読み込みと Content Layer ルートは壊さない

セキュリティメモ: プロキシはオープンリレーにしない（許可ホストの allowlist か、サイズ・回数制限）。ユーザー入力 URL をそのまま HTML に埋め込まない。

## やらないこと（今回）

- Next.js / Remix へのフレームワーク移行
- Zustand 廃止
- Biome へのリンタ一括移行、リポジトリ全体の Prettier
- #5 の投稿・認証・D1・GitHub 自動コミット
- #3 の一覧検索
- キャラ/武器/召喚の完全マスタ整備（公式全件スクレイピングはしない）
- ネイティブアプリ化

## テスト方針

既存規約（Vitest 単体・結合、Playwright E2E、カバレッジ閾値 80%）に従う。

追加したいケース:

- C: ホイールを preventDefault しない経路、行が画面内にあるときは auto-scroll しない
- D: モバイル viewport での新規作成と編成モーダル開閉
- E: 候補選択と自由入力の両方が Flow JSON に残る
- F: モック HTTP で成功・CORS 失敗・スキーマ不正

ブラウザ確認（UI 変更がある B/C/D/E/F）:

- デスクトップとモバイル相当幅の両方
- 閲覧と編集、メモ開閉、編成タブ一通り

## 提案する GitHub Issue 文面

CLI からは Issue を作成できないため、以下をコピーして Issue 化できる。

### 新規: ライブラリを最新安定版へ更新

本文: 本計画の作業 A。Astro 7.3.x、React 19.2.x など SemVer 範囲内の更新。メジャー移行は含めない。

### 新規: 行動表のスクロール引っかかりを修正

本文: 本計画の作業 C。`useTableScroll` の wheel 奪取、二重 overflow、sticky オフセット、textarea 自動リサイズを調査して修正する。

### 新規: 公開 URL から行動表 JSON を開く

本文: 本計画の作業 F。`?url=` とメニュー。Drive/Dropbox/Gist など「リンクを知っている人は閲覧可」な JSON。#5 の投稿機能とは独立。

### 既存 Issue へのコメント案

- #2: SuggestTextInput が覚醒タイプのみ。奥義/ガード候補は未接続。Combobox 化は #6 の後が望ましいが、既存コンポーネントでも着手可能。
- #4: ヘッダー密集、縦パネル 50/50、編成モーダル横タブが主対象。#6 の Sheet/Dialog 後に実装すると手戻りが少ない。
- #6: プリミティブは Base UI を推奨。Headless UI 置換と Combobox 導入が #2/#4 の前提になる。
