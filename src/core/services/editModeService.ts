import type { Flow } from '@/types/models';
import useBaseFlowStore from '@/core/stores/baseFlowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import { clearHistory } from './historyService';

/**
 * 編集モード関連のサービス
 *
 * このサービスは、編集モードの開始・終了・キャンセルなどの機能を提供します。
 */

// ロジック関数 - 編集モード開始時の処理
export function handleEditModeStart(flowData: Flow): { originalData: Flow } {
  // 編集モード開始時に現在のデータを保存
  return { originalData: structuredClone(flowData) };
}

// ロジック関数 - 編集モード終了時の処理
export function handleEditModeEnd(): void {
  // 編集モード終了時に履歴をクリア
  clearHistory();
}

// ロジック関数 - baseFlowStoreとの同期処理
function syncWithBaseFlowStore(data: Flow | null): void {
  useBaseFlowStore.getState().setFlowData(data);
}

// ロジック関数 - 編集キャンセル時の処理
export function handleCancelEdit(originalData: Flow): { flowData: Flow; isEditMode: boolean; originalData: null } {
  // 編集をキャンセルして元のデータに戻す
  const clonedData = structuredClone(originalData);

  // baseFlowStoreも同期
  syncWithBaseFlowStore(clonedData);

  // 履歴をクリア
  clearHistory();

  // 履歴を戻る（popstateイベントが発火してデータが復元される）
  history.back();

  return {
    flowData: clonedData,
    isEditMode: false,
    originalData: null,
  };
}

// 編集モードの設定
export function setIsEditMode(isEdit: boolean): void {
  const flowData = useBaseFlowStore.getState().getFlowData();

  if (isEdit && flowData) {
    // 編集モード開始時の処理
    const updates = handleEditModeStart(flowData);
    useBaseFlowStore.setState({ originalData: updates.originalData });
  }

  if (!isEdit) {
    // 編集モード終了時の処理
    handleEditModeEnd();
    useBaseFlowStore.setState({ originalData: null });
  }

  useEditModeStore.setState({ isEditMode: isEdit });
}

// 編集のキャンセル
export function cancelEdit(): void {
  const originalData = useBaseFlowStore.getState().originalData;
  if (originalData) {
    // 編集キャンセル時の処理
    const updates = handleCancelEdit(originalData);
    useBaseFlowStore.setState({ flowData: updates.flowData, originalData: updates.originalData });
    useEditModeStore.setState({ isEditMode: updates.isEditMode });
  }
}