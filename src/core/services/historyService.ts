import type { Flow } from '@/types/models';
import type { HistoryState, HistoryStore } from '@/core/stores/historyStore';
import useHistoryStore from '@/core/stores/historyStore';
import useFlowStore from '@/core/stores/flowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import type { FlowStore, EditModeStore } from '@/types/flowStore.types';

/**
 * 履歴操作と各ストアの連携を管理するサービス
 *
 * このサービスは、historyStoreと他のストアとの間の連携を管理します。
 * コンポーネントはこのサービス経由で履歴操作を行うことで、
 * 各ストア間の一貫性を保つことができます。
 */

// 各ストアの参照を取得するヘルパー関数
const getHistoryStore = (): HistoryStore => useHistoryStore.getState();
const getFlowStore = (): FlowStore => useFlowStore.getState();
const getEditModeStore = (): EditModeStore => useEditModeStore.getState();

// 履歴状態の取得
export const getHistoryState = (): HistoryState => getHistoryStore().getHistoryState();

// 履歴への追加
export const pushToHistory = (data: Flow): void => {
  // 編集モード中のみ履歴に追加する
  if (getEditModeStore().isEditMode) {
    getHistoryStore().pushToHistory(structuredClone(data));
  }
};

// 取り消し操作
export const undo = (): void => {
  const historyStore = getHistoryStore();
  const flowStore = getFlowStore();
  const currentData = flowStore.getFlowData();
  const originalData = flowStore.originalData;

  if (!currentData) {
    return;
  }

  // historyStoreのundoWithDataを使用して新しい状態を取得
  const newData = historyStore.undoWithData(currentData, originalData);

  if (newData) {
    // flowStoreの状態を更新
    flowStore.setFlowData(newData);
  }
};

// やり直し操作
export const redo = (): void => {
  const historyStore = getHistoryStore();
  const flowStore = getFlowStore();
  const currentData = flowStore.getFlowData();

  if (!currentData) {
    return;
  }

  // historyStoreのredoWithDataを使用して新しい状態を取得
  const newData = historyStore.redoWithData(currentData);

  if (newData) {
    // flowStoreの状態を更新
    flowStore.setFlowData(newData);
  }
};

// 履歴のクリア
export const clearHistory = (): void => {
  getHistoryStore().clearHistory();
};

// 取り消し可能かどうか
export const canUndo = (): boolean => {
  const historyState = getHistoryStore().getHistoryState();
  return historyState.past.length > 0 || (getFlowStore().originalData !== null);
};

// やり直し可能かどうか
export const canRedo = (): boolean => {
  const historyState = getHistoryStore().getHistoryState();
  return historyState.future.length > 0;
};