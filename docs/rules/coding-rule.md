# コーディングルール

## 命名規則

ほとんどは一般的なJavaScript/TypeScript/Reactの命名規則に従う

### ファイル・フォルダ名

- フォルダ名はkebab-caseで記述する
- ファイル名はそのファイルの種類によって以下の通り
  - コンポーネントの場合、PascalCaseで記述する
  - 関数の場合、camelCaseで記述する
  - 型の場合、PascalCaseで記述する
  - インターフェースの場合、PascalCaseで記述する
  - 定数の場合、UPPER_CASEで記述する

### ファイルの中

- コンポーネント関数名はPascalCaseで記述する
- 関数名はcamelCaseで記述する
- 変数名はcamelCaseで記述する
- 定数名はUPPER_CASEで記述する ※enumのプロパティは定数扱いとする
- 型名はPascalCaseで記述する
- インターフェース名はPascalCaseで記述する
- 型やインターフェースで使用する変数名はcamelCaseで記述する

## コーディング規則

- コンポーネントは必ず単体テストを書く（docs/rules/testing-rule.md参照）
- コンポーネントは必ずJSDocを書く
  - 全て共通-> 概要、使用例
  - 関数の場合、概要、パラメータ、返り値、注意点、使用例
  - class、type、interfaceの場合、概要、使用例
  - class、type、interfaceの属するプロパティの場合、概要、型、デフォルト値、使用例
- コンポーネントは関数コンポーネントで記述する
- コンポーネントのパラメータについて、同ファイルの先頭にinterfaceを作成する
