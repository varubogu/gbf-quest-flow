import type { Flow } from '@/types/models';
import { saveFlow } from '@/core/services/fileOperationService';
import { finishEdit, cancelEdit } from '@/core/services/editModeService';
import { newFlowDataSync } from '@/core/services/flowDataInitService';
import { updateUrlForNewFlow, updateUrlForViewMode } from '@/core/services/urlService';
import useFlowStore from '@/core/stores/flowStore';
import { announceToScreenReader, handleError } from '@/lib/utils/accessibility';

/**
 * フローの保存処理を実行する
 */
export const handleFlowSave = async (
  flowData: Flow,
  sourceId: string | null,
  clearHistory: () => void
): Promise<boolean> => {
  const success = await saveFlow(flowData, sourceId);
  if (success) {
    clearHistory();
    finishEdit();
    // 保存成功時にURLを更新
    updateUrlForViewMode(sourceId, flowData);
  }
  return success;
};

/**
 * 新規フロー作成処理を実行する
 */
export const handleNewFlow = (currentFlowData: Flow | null = null): void => {
  newFlowDataSync();
  // URLを更新
  updateUrlForNewFlow(currentFlowData);
  // アクセシビリティ通知
  announceToScreenReader('新しいフローを作成しました');
};

/**
 * 編集モードを終了する
 */
export const handleExitEditMode = async (
  hasChanges: boolean,
  clearHistory: () => void
): Promise<boolean> => {
  try {
    if (hasChanges) {
      const shouldDiscard = window.confirm(
        '変更内容が保存されていません。変更を破棄してもよろしいですか？'
      );
      if (!shouldDiscard) {
        return false;
      }
    }

    const originalData = useFlowStore.getState().originalData;
    if (originalData) {
      useFlowStore.getState().setFlowData(structuredClone(originalData));
    }
    cancelEdit();
    clearHistory();

    // 編集モード終了時にURLを更新
    const currentData = useFlowStore.getState().flowData;
    if (currentData) {
      updateUrlForViewMode(null, currentData);
    }

    announceToScreenReader('編集モードを終了しました');
    return true;
  } catch (error) {
    handleError(error, '編集モード終了中');
    return false;
  }
};

/**
 * 編集をキャンセルする
 */
export const handleCancel = async (
  hasChanges: boolean,
  clearHistory: () => void
): Promise<boolean> => {
  return handleExitEditMode(hasChanges, clearHistory);
};