import type { Flow } from '@/types/models';
import { saveFlow, updateNewFlowState } from '@/lib/utils/flowOperations';
import useFlowStore from '@/core/stores/flowStore';
import { setIsEditMode, createNewFlow } from '@/core/services/editModeService';
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
    setIsEditMode(false);
  }
  return success;
};

/**
 * 新規フロー作成処理を実行する
 */
export const handleNewFlow = (currentFlowData: Flow | null = null): void => {
  createNewFlow();
  // 旧flowStoreも更新（後方互換性のため）- createNewFlowはfileServiceで両方更新されるため不要
  updateNewFlowState(currentFlowData);
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
    setIsEditMode(false);
    clearHistory();
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