import type { Flow, Action } from '@/types/models';
import type { FlowStore, BaseFlowStore, EditModeStore, CursorStore } from '@/types/flowStore.types';
import { create } from 'zustand';
import useBaseFlowStore from '@/core/stores/baseFlowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import useCursorStore from '@/core/stores/cursorStore';
import { pushToHistory, undo, redo, clearHistory } from '@/core/services/historyService';
import { saveFlowToFile, loadFlowFromFile, newFlowData } from '@/core/services/fileService';
import { updateFlowData, updateAction } from '@/core/services/flowService';
import { setIsEditMode, cancelEdit } from '@/core/services/editModeService';

/**
 * フローストアのファサード
 *
 * このファサードは、複数のストアにアクセスするための統一されたインターフェースを提供します。
 * これにより、コンポーネントはストアの実装の詳細から切り離され、データアクセスの方法が変更されても
 * コンポーネント側の変更を最小限に抑えることができます。
 */
const useFlowStoreFacade = create<FlowStore>((set, get) => {
  // 初期状態を設定
  const initialState: Partial<FlowStore> = {
    flowData: useBaseFlowStore.getState().flowData,
    originalData: useBaseFlowStore.getState().originalData,
    currentRow: useCursorStore.getState().currentRow,
    isEditMode: useEditModeStore.getState().isEditMode,
  };

  // 他のストアを購読して変更を検知
  // BaseFlowStoreの変更を監視
  const unsubBaseFlow = useBaseFlowStore.subscribe((state) => {
    console.log('FlowStoreFacade: BaseFlowStoreの変更を検知しました', state.flowData?.title);
    set({
      flowData: state.flowData,
      originalData: state.originalData
    });
  });

  // EditModeStoreの変更を監視
  const unsubEditMode = useEditModeStore.subscribe((state) => {
    console.log('FlowStoreFacade: EditModeStoreの変更を検知しました', state.isEditMode);
    set({ isEditMode: state.isEditMode });
  });

  // CursorStoreの変更を監視
  const unsubCursor = useCursorStore.subscribe((state) => {
    console.log('FlowStoreFacade: CursorStoreの変更を検知しました', state.currentRow);
    set({ currentRow: state.currentRow });
  });

  return {
    // 状態（プロパティ）- 各ストアから初期化
    ...initialState as FlowStore,

    // BaseFlowStore関連のメソッド
    getFlowData: (): Flow | null => useBaseFlowStore.getState().getFlowData(),
    getActionById: (index: number): Action | undefined => useBaseFlowStore.getState().getActionById(index),
    setFlowData: (data: Flow | null): void => useBaseFlowStore.getState().setFlowData(data),
    updateFlowData: (updates: Partial<Flow>): void => {
      // flowServiceを使用
      updateFlowData(updates, useEditModeStore.getState().isEditMode);
    },
    updateAction: (index: number, updates: Partial<Action>): void => {
      // flowServiceを使用
      updateAction(index, updates, useEditModeStore.getState().isEditMode);
    },

    // EditModeStore関連のメソッド
    getIsEditMode: (): boolean => useEditModeStore.getState().getIsEditMode(),
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

    // CursorStore関連のメソッド
    getCurrentRow: (): number => useCursorStore.getState().getCurrentRow(),
    setCurrentRow: (row: number): void => useCursorStore.getState().setCurrentRow(row),

    // FileService関連のメソッド
    loadFlowFromFile: async (): Promise<void> => await loadFlowFromFile(),
    saveFlowToFile: async (fileName?: string): Promise<void> =>
      await saveFlowToFile(fileName),

    // 非推奨の履歴関連メソッド
    pushToHistory: (data: Flow): void => {
      console.warn('flowStoreFacade.pushToHistory() is deprecated. Use historyService instead.');
      pushToHistory(data);
    },
    undo: (): void => {
      console.warn('flowStoreFacade.undo() is deprecated. Use historyService instead.');
      undo();
    },
    redo: (): void => {
      console.warn('flowStoreFacade.redo() is deprecated. Use historyService instead.');
      redo();
    },
    clearHistory: (): void => {
      console.warn('flowStoreFacade.clearHistory() is deprecated. Use historyService instead.');
      clearHistory();
    },
  };
});

export default useFlowStoreFacade;