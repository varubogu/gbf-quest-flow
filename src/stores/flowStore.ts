import type { Flow } from "@/types/models"
import { create } from "zustand"

interface FlowStore {
  flowData: Flow | null
  setFlowData: (newData: Flow | null) => void
  updateFlowData: (update: Partial<Flow>) => void
}

const useFlowStore = create<FlowStore>((set, get) => ({
  flowData: null,
  setFlowData: (newData: Flow | null) => set({ flowData: newData }),
  updateFlowData: (update: Partial<Flow>) =>
    set({ flowData: { ...get().flowData, ...update } as Flow }),
}))

export default useFlowStore