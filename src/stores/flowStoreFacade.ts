import type { Flow, Action } from '@/types/models';
import type { FlowStore, BaseFlowStore, EditModeStore, FileOperationStore } from '@/types/flowStore.types';
import { create } from 'zustand';
import useFlowStore from './flowStore';
import useBaseFlowStore from './baseFlowStore';
import useEditModeStore from './editModeStore';
import useFileOperationStore from './fileOperationStore';
import useHistoryFacade, { type HistoryFacade } from '@/stores/historyFacade';

/**
 * フローストアのファサード
 *
 * このファサードは、複数のストアにアクセスするための統一されたインターフェースを提供します。
 * これにより、コンポーネントはストアの実装の詳細から切り離され、データアクセスの方法が変更されても
 * コンポーネント側の変更を最小限に抑えることができます。
 */
const useFlowStoreFacade = create<FlowStore>((_set, _get) => {
  // 元のflowStoreへの参照を取得するためのヘルパー関数
  const getOriginalStore = (): FlowStore => useFlowStore.getState();
  // 新しいbaseFlowStoreへの参照を取得するためのヘルパー関数
  const getBaseStore = (): BaseFlowStore => useBaseFlowStore.getState();
  // 新しいeditModeStoreへの参照を取得するためのヘルパー関数
  const getEditModeStore = (): EditModeStore => useEditModeStore.getState();
  // 新しいfileOperationStoreへの参照を取得するためのヘルパー関数
  const getFileOperationStore = (): FileOperationStore => useFileOperationStore.getState();
  // 新しいhistoryFacadeへの参照を取得するためのヘルパー関数
  const getHistoryFacade = (): HistoryFacade => useHistoryFacade.getState();

  return {
    // 状態（プロパティ）- 元のflowStoreと同期
    get flowData(): Flow | null { return getOriginalStore().flowData; },
    get originalData(): Flow | null { return getOriginalStore().originalData; },
    get currentRow(): number { return getOriginalStore().currentRow; },
    get isEditMode(): boolean { return getEditModeStore().isEditMode; },

    // BaseFlowStore関連のメソッド - baseFlowStoreから取得
    getFlowData: (): Flow | null => getBaseStore().getFlowData(),
    getActionById: (index: number): Action | undefined => getBaseStore().getActionById(index),
    setFlowData: (data: Flow | null): void => getOriginalStore().setFlowData(data),
    updateFlowData: (updates: Partial<Flow>): void => getOriginalStore().updateFlowData(updates),
    updateAction: (index: number, updates: Partial<Action>): void =>
      getOriginalStore().updateAction(index, updates),

    // EditModeStore関連のメソッド - editModeStoreから取得
    getIsEditMode: (): boolean => getEditModeStore().getIsEditMode(),
    setIsEditMode: (isEdit: boolean): void => getEditModeStore().setIsEditMode(isEdit),
    cancelEdit: (): void => getEditModeStore().cancelEdit(),
    createNewFlow: (): void => getEditModeStore().createNewFlow(),

    // CursorStore関連のメソッド
    getCurrentRow: (): number => getOriginalStore().getCurrentRow(),
    setCurrentRow: (row: number): void => getOriginalStore().setCurrentRow(row),

    // FileOperationStore関連のメソッド - fileOperationStoreから取得
    loadFlowFromFile: async (): Promise<void> => await getFileOperationStore().loadFlowFromFile(),
    saveFlowToFile: async (fileName?: string): Promise<void> =>
      await getFileOperationStore().saveFlowToFile(fileName),

    // 非推奨の履歴関連メソッド - historyFacadeに委譲
    pushToHistory: (data: Flow): void => {
      console.warn('flowStoreFacade.pushToHistory() is deprecated. Use historyFacade instead.');
      getHistoryFacade().pushToHistory(data);
    },
    undo: (): void => {
      console.warn('flowStoreFacade.undo() is deprecated. Use historyFacade instead.');
      getHistoryFacade().undo();
    },
    redo: (): void => {
      console.warn('flowStoreFacade.redo() is deprecated. Use historyFacade instead.');
      getHistoryFacade().redo();
    },
    clearHistory: (): void => {
      console.warn('flowStoreFacade.clearHistory() is deprecated. Use historyFacade instead.');
      getHistoryFacade().clearHistory();
    },
  };
});

export default useFlowStoreFacade;