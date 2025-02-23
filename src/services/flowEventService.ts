import type { Flow } from '@/types/models';
import { saveFlow, updateNewFlowState } from '@/utils/flowOperations';
import useFlowStore from '@/stores/flowStore';

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
    useFlowStore.getState().setIsEditMode(false);
  }
  return success;
};

/**
 * 新規フロー作成処理を実行する
 */
export const handleNewFlow = (currentFlowData: Flow | null = null): void => {
  useFlowStore.getState().createNewFlow();
  updateNewFlowState(currentFlowData);
};