import type { Flow } from '@/types/models';
import useHistoryStore, { type HistoryState, type HistoryStore } from '@/core/stores/historyStore';
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
export const getHistoryState = (): HistoryState => getHistoryStore().getState();

// 履歴への追加
export const pushToHistory = (data: Flow): void => {
  // 編集モード中のみ履歴に追加する
  if (getEditModeStore().isEditMode) {
    getHistoryStore().push(structuredClone(data));
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

  // 履歴がある場合はhistoryStoreのundoを使用
  if (historyStore.getState().past.length > 0) {
    const previousData = historyStore.undo();
    if (previousData) {
      flowStore.setFlowData(previousData);
    }
    return;
  }

  // 履歴がない場合でもオリジナルデータがあれば、そこに戻る
  if (originalData && JSON.stringify(currentData) !== JSON.stringify(originalData)) {
    // 現在のデータを未来履歴に追加
    const history = historyStore.getState();
    const newFuture = [structuredClone(currentData), ...history.future];

    // 履歴を更新
    useHistoryStore.setState({
      history: {
        past: [],
        future: newFuture
      }
    });

    // オリジナルデータに戻す
    flowStore.setFlowData(structuredClone(originalData));
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

  // historyStoreのredoを使用して新しい状態を取得
  const nextData = historyStore.redo();

  if (nextData) {
    // flowStoreの状態を更新
    flowStore.setFlowData(nextData);
  }
};

// 履歴のクリア
export const clearHistory = (): void => {
  getHistoryStore().clear();
};

// 取り消し可能かどうか
export const canUndo = (): boolean => {
  const historyState = getHistoryStore().getState();
  return historyState.past.length > 0 || (getFlowStore().originalData !== null);
};

// やり直し可能かどうか
export const canRedo = (): boolean => {
  const historyState = getHistoryStore().getState();
  return historyState.future.length > 0;
};