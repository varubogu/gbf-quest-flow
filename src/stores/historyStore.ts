import type { Flow } from '@/types/models';
import { create } from 'zustand';

export interface HistoryState {
  past: Flow[];
  future: Flow[];
}

export interface HistoryStore {
  // 履歴管理用の状態と関数
  history: HistoryState;
  pushToHistory: (_data: Flow) => void;
  undo: (_currentData: Flow, _originalData: Flow | null) => Flow | null;
  redo: (_currentData: Flow) => Flow | null;
  clearHistory: () => void;
  getHistoryState: () => HistoryState;
}

const useHistoryStore = create<HistoryStore>((set, get) => ({
  history: { past: [], future: [] },

  getHistoryState: (): HistoryState => {
    return get().history;
  },

  pushToHistory: (data: Flow): void => {
    const { history } = get();

    // 最後の履歴と同じデータは追加しない
    if (
      history.past.length > 0 &&
      JSON.stringify(history.past[history.past.length - 1]) === JSON.stringify(data)
    ) {
      return;
    }

    // 深いコピーを使用して新しい配列を作成
    const newPast = [...history.past, structuredClone(data)];

    set({
      history: {
        past: newPast,
        future: [], // 新しい変更時に未来履歴をクリア
      },
    });
  },

  undo: (currentData: Flow, originalData: Flow | null): Flow | null => {
    const { history } = get();

    // 履歴が空の場合は初期データに戻る
    if (history.past.length === 0) {
      if (originalData && JSON.stringify(currentData) !== JSON.stringify(originalData)) {
        // 新しいオブジェクトを作成して状態を更新
        const newFuture = [currentData, ...history.future];

        set({
          history: {
            past: [],
            future: newFuture
          },
        });

        return structuredClone(originalData);
      }
      return null;
    }

    // 最後の履歴を取得してpop
    const previousState = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);

    // 戻る先の状態を取得（pop後の最後の履歴、もしくは初期データ）
    const targetState = newPast.length > 0 ? newPast[newPast.length - 1] : originalData;

    // 新しいオブジェクトを作成して状態を更新
    const newFuture = [currentData, ...history.future];

    set({
      history: {
        past: newPast,
        future: newFuture,
      },
    });

    // targetStateがnullの場合はpreviousStateを使用
    return targetState ? structuredClone(targetState) : (previousState ? structuredClone(previousState) : null);
  },

  redo: (currentData: Flow): Flow | null => {
    const { history } = get();

    if (history.future.length === 0) {
      return null;
    }

    const next = history.future[0];
    if (!next) return null;

    const newFuture = history.future.slice(1);

    // 新しいオブジェクトを作成して状態を更新
    const newPast = [...history.past, currentData];

    set({
      history: {
        past: newPast,
        future: newFuture,
      },
    });

    return structuredClone(next);
  },

  clearHistory: (): void => {
    set({ history: { past: [], future: [] } });
  },
}));

export default useHistoryStore;