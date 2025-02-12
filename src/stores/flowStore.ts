import type { Flow } from "@/types/models"
import { create } from "zustand"

interface HistoryState {
  past: Flow[];
  future: Flow[];
}

interface FlowStore {
  flowData: Flow | null
  originalData: Flow | null // 編集前のデータを保持
  setFlowData: (newData: Flow | null) => void
  updateFlowData: (update: Partial<Flow>) => void
  loadFlowFromFile: () => Promise<void>
  createNewFlow: () => void // 新しいデータを作成する関数を追加
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
  // 編集キャンセル用の関数
  cancelEdit: () => void
}

const useFlowStore = create<FlowStore>((set, get) => ({
  flowData: null,
  originalData: null,
  currentRow: 0,
  isEditMode: false,
  history: { past: [], future: [] },

  setCurrentRow: (row: number) => set({ currentRow: row }),

  setIsEditMode: (isEdit: boolean) => {
    const { flowData } = get();
    if (isEdit && flowData) {
      // 編集モード開始時に現在のデータを保存
      set({ originalData: structuredClone(flowData) });
    }
    if (!isEdit) {
      // 編集モード終了時に履歴をクリア
      set({ history: { past: [], future: [] }, originalData: null });
    }
    set({ isEditMode: isEdit });
  },

  createNewFlow: () => {
    // 空のデータを作成
    const newData: Flow = {
      title: "新しいフロー",
      author: "",
      description: "",
      updateDate: new Date().toISOString(),
      note: "",
      organization: {
        job: "",
        member: {
          front: [] as { note: string; name: string; awaketype: string; }[],
          back: [] as { note: string; name: string; awaketype: string; }[],
        },
        weapon: {
          main: { note: "", name: "" },
          other: [] as { note: string; name: string; }[],
          additional: [] as { note: string; name: string; }[],
        },
        summon: {
          main: { note: "", name: "" },
          friend: { note: "", name: "" },
          other: [] as { note: string; name: string; }[],
          sub: [] as { note: string; name: string; }[],
        },
      },
      always: "",
      flow: [{
        hp: "",
        prediction: "",
        charge: "",
        guard: "",
        action: "",
        note: "",
      }],
    };
    set({
      flowData: newData,
      currentRow: 0,
      isEditMode: true, // 編集モードで開始
      history: { past: [], future: [] },
    });
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

  cancelEdit: () => {
    const { originalData } = get();
    if (originalData) {
      set({
        flowData: structuredClone(originalData),
        isEditMode: false,
        history: { past: [], future: [] },
        originalData: null,
      });
    }
  },

  loadFlowFromFile: async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';

      const filePromise = new Promise<File | null>((resolve) => {
        // ダイアログが閉じられたときのイベントを追加
        window.addEventListener('focus', () => {
          // 少し遅延を入れてファイル選択の有無を確認
          setTimeout(() => {
            if (!input.files?.length) {
              resolve(null);
            }
          }, 300);
        }, { once: true });

        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          resolve(file || null);
        };
      });

      input.click();
      const file = await filePromise;

      // ファイルが選択されなかった場合は処理を中断
      if (!file) {
        return;
      }

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