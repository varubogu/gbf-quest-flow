# エラーハンドリング

## 概要

このドキュメントでは、アプリケーションのエラーハンドリング機能について説明します。エラーハンドリングは、ユーザーエクスペリエンスを向上させるために重要な要素です。適切なエラーメッセージを表示し、可能な場合は回復手段を提供することで、ユーザーがアプリケーションを効果的に使用できるようにします。

## エラーハンドリングの構造

エラーハンドリングは以下の3つの層で構成されています：

1. **型定義層** (`src/types/error.types.ts`)
   - エラーの種類と重要度を定義
   - アプリケーション固有のエラー情報の構造を定義

2. **サービス層** (`src/core/services/errorService.ts`)
   - エラーファクトリ関数を提供
   - エラーメッセージのフォーマット機能を提供
   - エラーのログ出力機能を提供

3. **ファサード層** (`src/core/facades/errorFacade.ts`)
   - アプリケーション全体でエラーハンドリングを簡単に使用するためのインターフェースを提供
   - try-catchブロックでエラーをハンドリングするためのヘルパー関数を提供

4. **ストア層** (`src/core/stores/errorStore.ts`)
   - エラー状態を管理
   - エラーダイアログの表示状態を管理
   - リカバリーアクションの実行を管理

5. **UI層** (`src/components/organisms/ErrorDialog.tsx`)
   - エラーメッセージを表示
   - エラーの種類と重要度に応じた視覚的フィードバックを提供
   - リカバリーアクションの実行ボタンを提供

## エラーの種類

アプリケーションでは以下の種類のエラーを定義しています：

- **バリデーションエラー** (`ErrorType.VALIDATION`)
  - ユーザー入力が不正な場合に発生
  - 通常は警告レベル（`ErrorSeverity.WARNING`）
  - 回復可能

- **ネットワークエラー** (`ErrorType.NETWORK`)
  - ネットワーク通信に問題がある場合に発生
  - 通常はエラーレベル（`ErrorSeverity.ERROR`）
  - 回復不可能

- **ファイル操作エラー** (`ErrorType.FILE_OPERATION`)
  - ファイルの読み書きに問題がある場合に発生
  - 通常はエラーレベル（`ErrorSeverity.ERROR`）
  - 回復可能

- **不明なエラー** (`ErrorType.UNKNOWN`)
  - 予期しないエラーが発生した場合
  - 通常は重大レベル（`ErrorSeverity.CRITICAL`）
  - 回復不可能

## エラーの重要度

エラーの重要度は以下の4段階で定義しています：

- **情報** (`ErrorSeverity.INFO`)
  - 情報提供のみ
  - 青色で表示

- **警告** (`ErrorSeverity.WARNING`)
  - 注意が必要だが、操作は継続可能
  - 黄色で表示

- **エラー** (`ErrorSeverity.ERROR`)
  - 操作が失敗した
  - 赤色で表示

- **重大** (`ErrorSeverity.CRITICAL`)
  - システム全体に影響する重大な問題
  - 濃い赤色で表示

## エラーハンドリングの使用方法

### 基本的な使用方法

```typescript
import { errorFacade } from '@/core/facades/errorFacade';

// バリデーションエラーを表示
errorFacade.showValidationError('入力値が不正です', { field: 'username' });

// ネットワークエラーを表示
try {
  await fetch('https://api.example.com');
} catch (error) {
  if (error instanceof Error) {
    errorFacade.showNetworkError(error, { url: 'https://api.example.com' });
  }
}

// ファイル操作エラーを表示（リカバリーアクション付き）
try {
  await saveFile();
} catch (error) {
  if (error instanceof Error) {
    errorFacade.showFileOperationError(
      error,
      { path: '/path/to/file' },
      async () => {
        // リカバリーアクション
        await saveFileToAlternativeLocation();
      }
    );
  }
}
```

### try-catchヘルパーの使用方法

```typescript
import { errorFacade } from '@/core/facades/errorFacade';

// 基本的な使用方法
const result = await errorFacade.tryCatch(
  async () => {
    return await fetchData();
  }
);

// カスタムエラーハンドラーを使用
const result = await errorFacade.tryCatch(
  async () => {
    return await fetchData();
  },
  (error) => {
    // カスタムエラーハンドリング
    errorFacade.showNetworkError(error, { operation: 'fetchData' });
  }
);
```

## エラーダイアログのカスタマイズ

エラーダイアログは、エラーの種類と重要度に応じて自動的に外観が変化します：

- エラータイプに応じたアイコンが表示されます
- エラーの重要度に応じた背景色とテキスト色が適用されます
- リカバリーアクションが利用可能な場合は、リカバリーボタンが表示されます
- フローデータが存在する場合は、バックアップダウンロードボタンが表示されます

## 今後の改善点

1. **エラーのグループ化**
   - 同種のエラーをグループ化して表示する機能

2. **エラー頻度の追跡**
   - 特定のエラーが頻繁に発生する場合に通知する機能

3. **オフライン対応**
   - オフライン時のエラーキューイング機能

4. **エラーレポート機能**
   - ユーザーがエラーレポートを送信できる機能

5. **エラー予測と防止**
   - 潜在的なエラー状況を事前に検出して防止する機能