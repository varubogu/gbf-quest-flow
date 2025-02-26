import type { Flow, Action } from '@/types/models';
import type { FlowStore } from '@/types/flowStore.types';
import { create } from 'zustand';
import useFlowStore from './flowStore';
import useBaseFlowStore from './baseFlowStore';

/**
 * flowStoreファサード
 * このファイルは将来的なflowStoreの分割のための準備として作成されています。
 * 段階的にリファクタリングを進め、最終的には分割された各ストアをこのファサードを通して利用できるようにします。
 */
const useFlowStoreFacade = create<FlowStore>((_set, _get) => {
  // 元のflowStoreへの参照を取得するためのヘルパー関数
  const getOriginalStore = (): FlowStore => useFlowStore.getState();
  // 新しいbaseFlowStoreへの参照を取得するためのヘルパー関数
  const getBaseStore = (): FlowStore => useBaseFlowStore.getState();

  return {
    // 状態（プロパティ）
    get flowData(): Flow | null { return getBaseStore().flowData; },
    get originalData(): Flow | null { return getOriginalStore().originalData; },
    get currentRow(): number { return getOriginalStore().currentRow; },
    get isEditMode(): boolean { return getOriginalStore().isEditMode; },

    // BaseFlowStore関連のメソッド - 新しいbaseFlowStoreから取得
    getFlowData: (): Flow | null => getBaseStore().getFlowData(),
    getActionById: (index: number): Action | undefined => getBaseStore().getActionById(index),
    setFlowData: (data: Flow | null): void => {
      getBaseStore().setFlowData(data);
      getOriginalStore().setFlowData(data);
    },
    updateFlowData: (updates: Partial<Flow>): void => {
      getOriginalStore().updateFlowData(updates);
      // baseFlowStoreも同期させるが、履歴追加などの副作用はoriginalStoreに任せる
      const flowData = getOriginalStore().getFlowData();
      if (flowData) {
        getBaseStore().setFlowData(flowData);
      }
    },
    updateAction: (index: number, updates: Partial<Action>): void => {
      getOriginalStore().updateAction(index, updates);
      // baseFlowStoreも同期させる
      const flowData = getOriginalStore().getFlowData();
      if (flowData) {
        getBaseStore().setFlowData(flowData);
      }
    },

    // EditModeStore関連のメソッド
    getIsEditMode: (): boolean => getOriginalStore().getIsEditMode(),
    setIsEditMode: (isEdit: boolean): void => getOriginalStore().setIsEditMode(isEdit),
    cancelEdit: (): void => getOriginalStore().cancelEdit(),
    createNewFlow: (): void => {
      getOriginalStore().createNewFlow();
      // baseFlowStoreも同期させる
      const flowData = getOriginalStore().getFlowData();
      if (flowData) {
        getBaseStore().setFlowData(flowData);
      }
    },

    // CursorStore関連のメソッド
    getCurrentRow: (): number => getOriginalStore().getCurrentRow(),
    setCurrentRow: (row: number): void => getOriginalStore().setCurrentRow(row),

    // FileOperationStore関連のメソッド
    loadFlowFromFile: async (): Promise<void> => {
      await getOriginalStore().loadFlowFromFile();
      // baseFlowStoreも同期させる
      const flowData = getOriginalStore().getFlowData();
      if (flowData) {
        getBaseStore().setFlowData(flowData);
      }
    },
    saveFlowToFile: async (fileName?: string): Promise<void> =>
      await getOriginalStore().saveFlowToFile(fileName),

    // 非推奨の履歴関連メソッド
    pushToHistory: (data: Flow): void => getOriginalStore().pushToHistory(data),
    undo: (): void => getOriginalStore().undo(),
    redo: (): void => getOriginalStore().redo(),
    clearHistory: (): void => getOriginalStore().clearHistory(),
  };
});

export default useFlowStoreFacade;