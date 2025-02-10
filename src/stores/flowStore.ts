import type { Flow } from "@/types/models"
import { create } from "zustand"

interface FlowStore {
  flowData: Flow | null
  setFlowData: (newData: Flow | null) => void
  updateFlowData: (update: Partial<Flow>) => void
  loadFlowFromFile: () => Promise<void>
  currentRow: number
  setCurrentRow: (row: number) => void
}

const useFlowStore = create<FlowStore>((set, get) => ({
  flowData: null,
  currentRow: 0,
  setCurrentRow: (row: number) => set({ currentRow: row }),
  setFlowData: (newData: Flow | null) => {
    set({ flowData: newData, currentRow: 0 })
  },
  updateFlowData: (update: Partial<Flow>) =>
    set({ flowData: { ...get().flowData, ...update } as Flow }),
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