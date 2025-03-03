import type { Flow } from '@/types/models';
import { create } from 'zustand';

export interface HistoryState {
  past: Flow[];
  future: Flow[];
}

export interface HistoryStore {
  // 履歴管理用の状態
  history: HistoryState;

  // 基本的な操作
  push: (_data: Flow) => void;
  undo: () => Flow | null;
  redo: () => Flow | null;
  clear: () => void;
  getState: () => HistoryState;
}

// 深いコピーを行うヘルパー関数
const deepCopy = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj)) as T;
};

const useHistoryStore = create<HistoryStore>((set, get) => ({
  history: { past: [], future: [] },

  getState: (): HistoryState => {
    return get().history;
  },

  push: (data: Flow): void => {
    const { history } = get();

    // 最後の履歴と同じデータは追加しない
    if (
      history.past.length > 0 &&
      JSON.stringify(history.past[history.past.length - 1]) === JSON.stringify(data)
    ) {
      return;
    }

    // 深いコピーを使用して新しい配列を作成
    const dataCopy = deepCopy(data);
    const newPast = [...history.past, dataCopy];

    set({
      history: {
        past: newPast,
        future: [], // 新しい変更時に未来履歴をクリア
      },
    });
  },

  undo: (): Flow | null => {
    const { history } = get();

    // 履歴が空の場合はnullを返す
    if (history.past.length === 0) {
      return null;
    }

    // 最後の履歴を取得してpop
    const previousState = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);

    // 現在の状態を未来履歴に追加
    const newFuture = [previousState, ...history.future];

    set({
      history: {
        past: newPast,
        future: newFuture,
      },
    });

    // 戻る先の状態を返す（pop後の最後の履歴）
    if (newPast.length > 0 && newPast[newPast.length - 1]) {
      const lastItem = newPast[newPast.length - 1];
      return deepCopy(lastItem);
    }
    return null;
  },

  redo: (): Flow | null => {
    const { history } = get();

    if (history.future.length === 0) {
      return null;
    }

    const next = history.future[0];
    if (!next) return null;

    const newFuture = history.future.slice(1);

    // 新しいオブジェクトを作成して状態を更新
    const newPast = [...history.past, next];

    set({
      history: {
        past: newPast,
        future: newFuture,
      },
    });

    return deepCopy(next);
  },

  clear: (): void => {
    set({ history: { past: [], future: [] } });
  },
}));

export default useHistoryStore;