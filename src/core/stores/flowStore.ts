import type { Flow, Action } from '@/types/models';
import type { FlowStore } from '@/types/flowStore.types';
import { create } from 'zustand';
import { adjustOrganizationData } from '../services/organizationService';

/**
 * フロー状態の基本的な読み取り・更新機能を提供するストア
 *
 * 注: 更新ロジックはflowServiceに移動し、このストアは状態の保持と基本的な読み取り機能のみを提供します
 */
const useFlowStore = create<FlowStore>((set, get) => ({
  // 状態
  flowData: null,
  originalData: null,

  // 読み取り用メソッド
  getFlowData: (): Flow | null => get().flowData,
  getActionById: (index: number): Action | undefined => get().flowData?.flow[index],

  // 更新用メソッド - シンプルな状態更新のみを行う
  setFlowData: (data: Flow | null): void => {
    if (!data) {
      set({ flowData: null });
      return;
    }

    const adjustedData = {
      ...data,
      organization: adjustOrganizationData(data.organization),
    };

    set({ flowData: adjustedData });
  },
}));

export default useFlowStore;