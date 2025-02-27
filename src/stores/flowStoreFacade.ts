import type { Flow, Action } from '@/types/models';
import type { FlowStore, BaseFlowStore, EditModeStore, FileOperationStore, CursorStore } from '@/types/flowStore.types';
import { create } from 'zustand';
import useBaseFlowStore from './baseFlowStore';
import useEditModeStore from './editModeStore';
import useFileOperationStore from './fileOperationStore';
import useCursorStore from './cursorStore';
import useHistoryFacade, { type HistoryFacade } from '@/stores/historyFacade';

/**
 * フローストアのファサード
 *
 * このファサードは、複数のストアにアクセスするための統一されたインターフェースを提供します。
 * これにより、コンポーネントはストアの実装の詳細から切り離され、データアクセスの方法が変更されても
 * コンポーネント側の変更を最小限に抑えることができます。
 */
const useFlowStoreFacade = create<FlowStore>((_set, _get) => {
  // 新しいbaseFlowStoreへの参照を取得するためのヘルパー関数
  const getBaseStore = (): BaseFlowStore => useBaseFlowStore.getState();
  // 新しいeditModeStoreへの参照を取得するためのヘルパー関数
  const getEditModeStore = (): EditModeStore => useEditModeStore.getState();
  // 新しいfileOperationStoreへの参照を取得するためのヘルパー関数
  const getFileOperationStore = (): FileOperationStore => useFileOperationStore.getState();
  // 新しいhistoryFacadeへの参照を取得するためのヘルパー関数
  const getHistoryFacade = (): HistoryFacade => useHistoryFacade.getState();
  // 新しいcursorStoreへの参照を取得するためのヘルパー関数
  const getCursorStore = (): CursorStore => useCursorStore.getState();

  return {
    // 状態（プロパティ）- 元のflowStoreと同期
    get flowData(): Flow | null { return getBaseStore().flowData; },
    get originalData(): Flow | null { return getBaseStore().originalData; },
    get currentRow(): number { return getCursorStore().currentRow; },
    get isEditMode(): boolean { return getEditModeStore().isEditMode; },

    // BaseFlowStore関連のメソッド - baseFlowStoreから取得
    getFlowData: (): Flow | null => getBaseStore().getFlowData(),
    getActionById: (index: number): Action | undefined => getBaseStore().getActionById(index),
    setFlowData: (data: Flow | null): void => getBaseStore().setFlowData(data),
    updateFlowData: (updates: Partial<Flow>): void => getBaseStore().updateFlowData(updates),
    updateAction: (index: number, updates: Partial<Action>): void =>
      getBaseStore().updateAction(index, updates),

    // EditModeStore関連のメソッド - editModeStoreから取得
    getIsEditMode: (): boolean => getEditModeStore().getIsEditMode(),
    setIsEditMode: (isEdit: boolean): void => getEditModeStore().setIsEditMode(isEdit),
    cancelEdit: (): void => getEditModeStore().cancelEdit(),
    createNewFlow: (): void => getEditModeStore().createNewFlow(),

    // CursorStore関連のメソッド - cursorStoreから取得
    getCurrentRow: (): number => getCursorStore().getCurrentRow(),
    setCurrentRow: (row: number): void => getCursorStore().setCurrentRow(row),

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