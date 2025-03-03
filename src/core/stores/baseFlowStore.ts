import type { Flow, Action } from '@/types/models';
import type { BaseFlowStore } from '@/types/flowStore.types';
import { create } from 'zustand';
import { adjustOrganizationData } from '../services/organizationService';

/**
 * フロー状態の基本的な読み取り・更新機能を提供するストア
 *
 * 注: 更新ロジックはflowServiceに移動し、このストアは状態の保持と基本的な読み取り機能のみを提供します
 */
const useBaseFlowStore = create<BaseFlowStore>((set, get) => ({
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
  // 以下のメソッドはファサードパターンとの互換性のために残しますが、
  // 内部実装はflowServiceに委譲します
  updateFlowData: (updates: Partial<Flow>): void => {
    // 注: 実際の実装はflowServiceで行われ、このメソッドは互換性のために残されています
    // flowServiceのupdateFlowDataメソッドをファサードから呼び出すことを推奨します
    const { updateFlowData } = require('../services/flowService');
    updateFlowData(updates, false);
  },
}));

export default useBaseFlowStore;