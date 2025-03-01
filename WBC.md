# Work Breakdown Chart (WBC)

## 2024-03-01

### 完了したタスク
- settingsStoreFacadeのテスト修正
  - `__mockSubscribe`の問題を解決するために`vi.spyOn`を使用
  - テストファイルの型エラーを修正
    - `any`型を`Record<string, unknown>`に置き換え
    - `facade`変数に明示的に`SettingsStoreFacade`型を指定
    - 未使用の引数名の先頭に`_`を追加して警告を抑制
    - `SettingsStoreFacade`インターフェースを追加して型安全性を向上

### 進行中のタスク
- テストファイルの修正と改善

### 次のタスク
- 他のテストファイルの確認と修正