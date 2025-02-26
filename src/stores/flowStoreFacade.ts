import type { Flow, Action } from '@/types/models';
import type { FlowStore } from '@/types/flowStore.types';
import { create } from 'zustand';
import useFlowStore from './flowStore';

/**
 * flowStoreファサード
 * このファイルは将来的なflowStoreの分割のための準備として作成されています。
 * 現段階では元のflowStoreの関数をそのまま呼び出します。
 * 段階的にリファクタリングを進め、最終的には分割された各ストアをこのファサードを通して利用できるようにします。
 */
const useFlowStoreFacade = create<FlowStore>((_set, _get) => {
  // 元のflowStoreへの参照を取得するためのヘルパー関数
  const getOriginalStore = (): FlowStore => useFlowStore.getState();

  return {
    // 状態（プロパティ）
    get flowData(): Flow | null { return getOriginalStore().flowData; },
    get originalData(): Flow | null { return getOriginalStore().originalData; },
    get currentRow(): number { return getOriginalStore().currentRow; },
    get isEditMode(): boolean { return getOriginalStore().isEditMode; },

    // BaseFlowStore関連のメソッド
    getFlowData: (): Flow | null => getOriginalStore().flowData,
    getActionById: (index: number): Action | undefined => getOriginalStore().flowData?.flow[index],
    setFlowData: (data: Flow | null): void => getOriginalStore().setFlowData(data),
    updateFlowData: (updates: Partial<Flow>): void => getOriginalStore().updateFlowData(updates),
    updateAction: (index: number, updates: Partial<Action>): void =>
      getOriginalStore().updateAction(index, updates),

    // EditModeStore関連のメソッド
    getIsEditMode: (): boolean => getOriginalStore().isEditMode,
    setIsEditMode: (isEdit: boolean): void => getOriginalStore().setIsEditMode(isEdit),
    cancelEdit: (): void => getOriginalStore().cancelEdit(),
    createNewFlow: (): void => getOriginalStore().createNewFlow(),

    // CursorStore関連のメソッド
    getCurrentRow: (): number => getOriginalStore().currentRow,
    setCurrentRow: (row: number): void => getOriginalStore().setCurrentRow(row),

    // FileOperationStore関連のメソッド
    loadFlowFromFile: (): Promise<void> => getOriginalStore().loadFlowFromFile(),
    saveFlowToFile: async (_fileName?: string): Promise<void> => {
      // 現在の実装にはsaveFlowToFileがないため、将来的に実装予定
      console.warn('saveFlowToFileは現在実装されていません');
    },

    // 非推奨の履歴関連メソッド
    pushToHistory: (data: Flow): void => getOriginalStore().pushToHistory(data),
    undo: (): void => getOriginalStore().undo(),
    redo: (): void => getOriginalStore().redo(),
    clearHistory: (): void => getOriginalStore().clearHistory(),
  };
});

export default useFlowStoreFacade;