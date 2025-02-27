import type { Flow, Action } from '@/types/models';
import type { FlowStore, BaseFlowStore, EditModeStore, CursorStore } from '@/types/flowStore.types';
import { create } from 'zustand';
import useBaseFlowStore from './baseFlowStore';
import useEditModeStore from './editModeStore';
import useCursorStore from './cursorStore';
import { pushToHistory, undo, redo, clearHistory } from '@/core/services/historyService';
import { saveFlowToFile, loadFlowFromFile, newFlowData } from '../services/fileService';
import { updateFlowData, updateAction } from '../services/flowService';
import { setIsEditMode, cancelEdit } from '../services/editModeService';

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
  // 新しいhistoryServiceへの参照を取得するためのヘルパー関数
  const getHistoryService = () => ({ pushToHistory, undo, redo, clearHistory });
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
    updateFlowData: (updates: Partial<Flow>): void => {
      // flowServiceを使用
      updateFlowData(updates, getEditModeStore().isEditMode);
    },
    updateAction: (index: number, updates: Partial<Action>): void => {
      // flowServiceを使用
      updateAction(index, updates, getEditModeStore().isEditMode);
    },

    // EditModeStore関連のメソッド - editModeServiceを使用
    getIsEditMode: (): boolean => getEditModeStore().getIsEditMode(),
    setIsEditMode: (isEdit: boolean): void => {
      // editModeServiceを使用
      setIsEditMode(isEdit);
    },
    cancelEdit: (): void => {
      // editModeServiceを使用
      cancelEdit();
    },
    createNewFlow: (): void => {
      // fileServiceを使用
      newFlowData();
    },

    // CursorStore関連のメソッド - cursorStoreから取得
    getCurrentRow: (): number => getCursorStore().getCurrentRow(),
    setCurrentRow: (row: number): void => getCursorStore().setCurrentRow(row),

    // FileService関連のメソッド - FileServiceから取得
    loadFlowFromFile: async (): Promise<void> => await loadFlowFromFile(),
    saveFlowToFile: async (fileName?: string): Promise<void> =>
      await saveFlowToFile(fileName),

    // 非推奨の履歴関連メソッド - historyServiceに委譲
    pushToHistory: (data: Flow): void => {
      console.warn('flowStoreFacade.pushToHistory() is deprecated. Use historyService instead.');
      getHistoryService().pushToHistory(data);
    },
    undo: (): void => {
      console.warn('flowStoreFacade.undo() is deprecated. Use historyService instead.');
      getHistoryService().undo();
    },
    redo: (): void => {
      console.warn('flowStoreFacade.redo() is deprecated. Use historyService instead.');
      getHistoryService().redo();
    },
    clearHistory: (): void => {
      console.warn('flowStoreFacade.clearHistory() is deprecated. Use historyService instead.');
      getHistoryService().clearHistory();
    },
  };
});

export default useFlowStoreFacade;