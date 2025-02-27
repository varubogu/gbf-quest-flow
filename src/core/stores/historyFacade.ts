import { create } from 'zustand';
import type { Flow } from '@/types/models';
import type { HistoryState, HistoryStore } from '@/core/stores/historyStore';
import useHistoryStore from '@/core/stores/historyStore';
import useBaseFlowStore from '@/core/stores/baseFlowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import type { BaseFlowStore, EditModeStore } from '@/types/flowStore.types';

/**
 * 履歴操作と各ストアの連携を管理するファサード
 *
 * このファサードは、historyStoreと他のストアとの間の連携を改善します。
 * コンポーネントはこのファサード経由で履歴操作を行うことで、
 * 各ストア間の一貫性を保つことができます。
 */
export interface HistoryFacade {
  // 基本的な履歴状態の取得
  getHistoryState: () => HistoryState;

  // 履歴の操作
  pushToHistory: (_data: Flow) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;

  // 履歴の状態確認
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const useHistoryFacade = create<HistoryFacade>(() => {
  // 各ストアの参照を取得するヘルパー関数
  const getHistoryStore = (): HistoryStore => useHistoryStore.getState();
  const getBaseFlowStore = (): BaseFlowStore => useBaseFlowStore.getState();
  const getEditModeStore = (): EditModeStore => useEditModeStore.getState();

  return {
    // 履歴状態の取得
    getHistoryState: (): HistoryState => getHistoryStore().getHistoryState(),

    // 履歴への追加
    pushToHistory: (data: Flow): void => {
      // 編集モード中のみ履歴に追加する
      if (getEditModeStore().isEditMode) {
        getHistoryStore().pushToHistory(structuredClone(data));
      }
    },

    // 取り消し操作
    undo: (): void => {
      const historyStore = getHistoryStore();
      const baseFlowStore = getBaseFlowStore();
      const currentData = baseFlowStore.getFlowData();
      const originalData = baseFlowStore.originalData;

      if (!currentData) {
        return;
      }

      // historyStoreのundoWithDataを使用して新しい状態を取得
      const newData = historyStore.undoWithData(currentData, originalData);

      if (newData) {
        // baseFlowStoreの状態を更新
        baseFlowStore.setFlowData(newData);
      }
    },

    // やり直し操作
    redo: (): void => {
      const historyStore = getHistoryStore();
      const baseFlowStore = getBaseFlowStore();
      const currentData = baseFlowStore.getFlowData();

      if (!currentData) {
        return;
      }

      // historyStoreのredoWithDataを使用して新しい状態を取得
      const newData = historyStore.redoWithData(currentData);

      if (newData) {
        // baseFlowStoreの状態を更新
        baseFlowStore.setFlowData(newData);
      }
    },

    // 履歴のクリア
    clearHistory: (): void => {
      getHistoryStore().clearHistory();
    },

    // 取り消し可能かどうか
    canUndo: (): boolean => {
      const historyState = getHistoryStore().getHistoryState();
      return historyState.past.length > 0 || (getBaseFlowStore().originalData !== null);
    },

    // やり直し可能かどうか
    canRedo: (): boolean => {
      const historyState = getHistoryStore().getHistoryState();
      return historyState.future.length > 0;
    }
  };
});

export default useHistoryFacade;