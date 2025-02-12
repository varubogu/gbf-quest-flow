import type { Flow } from "@/types/models"
import { create } from "zustand"

interface HistoryState {
  past: Flow[];
  future: Flow[];
}

interface FlowStore {
  flowData: Flow | null
  setFlowData: (newData: Flow | null) => void
  updateFlowData: (update: Partial<Flow>) => void
  loadFlowFromFile: () => Promise<void>
  currentRow: number
  setCurrentRow: (row: number) => void
  isEditMode: boolean
  setIsEditMode: (isEdit: boolean) => void
  // 履歴管理用の状態と関数
  history: HistoryState
  pushToHistory: (data: Flow) => void
  undo: () => void
  redo: () => void
  clearHistory: () => void
}

const useFlowStore = create<FlowStore>((set, get) => ({
  flowData: null,
  currentRow: 0,
  isEditMode: false,
  history: { past: [], future: [] },

  setCurrentRow: (row: number) => set({ currentRow: row }),

  setIsEditMode: (isEdit: boolean) => {
    if (!isEdit) {
      // 編集モード終了時に履歴をクリア
      set({ history: { past: [], future: [] } });
    }
    set({ isEditMode: isEdit });
  },

  setFlowData: (newData: Flow | null) => {
    const { isEditMode } = get();
    if (isEditMode && newData) {
      // 編集モード中は履歴に追加
      get().pushToHistory(newData);
    }
    set({ flowData: newData, currentRow: 0 });
  },

  updateFlowData: (update: Partial<Flow>) =>
    set({ flowData: { ...get().flowData, ...update } as Flow }),

  pushToHistory: (data: Flow) => {
    const { history, flowData } = get();
    if (flowData) {
      set({
        history: {
          past: [...history.past, flowData],
          future: [], // 新しい変更時に未来履歴をクリア
        },
      });
    }
  },

  undo: () => {
    const { history, flowData } = get();
    if (history.past.length === 0 || !flowData) return;

    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);

    set({
      flowData: previous,
      history: {
        past: newPast,
        future: [flowData, ...history.future],
      },
    });
  },

  redo: () => {
    const { history, flowData } = get();
    if (history.future.length === 0 || !flowData) return;

    const next = history.future[0];
    const newFuture = history.future.slice(1);

    set({
      flowData: next,
      history: {
        past: [...history.past, flowData],
        future: newFuture,
      },
    });
  },

  clearHistory: () => {
    set({ history: { past: [], future: [] } });
  },

  loadFlowFromFile: async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';

      const filePromise = new Promise<File>((resolve) => {
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) resolve(file);
        };
      });

      input.click();
      const file = await filePromise;

      const text = await file.text();
      const data = JSON.parse(text) as Flow;
      set({ flowData: data, currentRow: 0 });
    } catch (error) {
      console.error('ファイルの読み込みに失敗しました:', error);
      throw error;
    }
  }
}))

export default useFlowStore