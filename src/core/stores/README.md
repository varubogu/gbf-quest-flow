# ストア使用ガイド

## 重要な変更点: ファサードパターンの導入

このプロジェクトでは、ストアの使用方法が変更されました。以下のガイドラインに従ってください。

## 推奨される使用方法

### FlowStoreFacadeの使用

コンポーネントからは、直接個別のストアを使用せず、`flowStoreFacade`を使用してください。

```typescript
// 推奨される使用方法
import useFlowStoreFacade from '@/core/stores/flowStoreFacade';

function MyComponent() {
  // ファサード経由でストアの状態を取得
  const flowData = useFlowStoreFacade(state => state.flowData);
  const isEditMode = useFlowStoreFacade(state => state.isEditMode);

  // ファサード経由でメソッドを呼び出し
  const handleSave = () => {
    useFlowStoreFacade.getState().saveFlowToFile();
  };

  // ...
}
```

### サービスの直接使用

特定の機能だけを使用する場合は、対応するサービスを直接インポートして使用することもできます。

```typescript
// 特定の機能だけを使用する場合
import { loadFlowFromFile, saveFlowToFile } from '@/core/services/fileService';

function FileOperationComponent() {
  const handleLoad = async () => {
    await loadFlowFromFile();
  };

  const handleSave = async () => {
    await saveFlowToFile('my-flow.json');
  };

  // ...
}
```

## 非推奨の使用方法

### flowStoreの直接使用（非推奨）

`flowStore`は非推奨となり、将来のバージョンで削除される予定です。直接使用しないでください。

```typescript
// ❌ 非推奨の使用方法
import useFlowStore from '@/core/stores/flowStore';

function MyComponent() {
  // 非推奨: flowStoreを直接使用
  const flowData = useFlowStore(state => state.flowData);

  // ...
}
```

## ストア構造の概要

現在のストア構造は以下のようになっています：

1. **BaseFlowStore**: フローデータの基本操作（setFlowData, updateFlowData, updateAction）
2. **EditModeStore**: 編集モードの管理（setIsEditMode, cancelEdit, createNewFlow）
3. **CursorStore**: カーソル位置管理（getCurrentRow, setCurrentRow）
4. **FlowStoreFacade**: 上記すべてのストアへの統一インターフェース

## サービス構造の概要

ビジネスロジックは以下のサービスに分割されています：

1. **fileService**: ファイル操作関連（loadFlowFromFile, saveFlowToFile, newFlowData）
2. **flowService**: フローデータ操作関連（updateFlowData, updateAction）
3. **editModeService**: 編集モード関連（setIsEditMode, cancelEdit）
4. **historyService**: 履歴管理関連（pushToHistory, undo, redo, clearHistory）
5. **organizationService**: 組織データ関連（adjustOrganizationData）

## 移行ガイド

既存のコードを新しい構造に移行する際は、以下の手順に従ってください：

1. `useFlowStore`のインポートを`useFlowStoreFacade`に置き換える
2. 必要に応じて、特定のサービスをインポートする
3. ストアの状態を直接変更するコードを、ファサードのメソッド呼び出しに置き換える

例：
```typescript
// 変更前
import useFlowStore from '@/core/stores/flowStore';
const { flowData } = useFlowStore.getState();
useFlowStore.getState().updateFlowData({ title: '新しいタイトル' });

// 変更後
import useFlowStoreFacade from '@/core/stores/flowStoreFacade';
const { flowData } = useFlowStoreFacade.getState();
useFlowStoreFacade.getState().updateFlowData({ title: '新しいタイトル' });
```