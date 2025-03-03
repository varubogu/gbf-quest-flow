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
  /**
   * フローデータ
   */
  flowData: null,
  /**
   * 元のフローデータ
   */
  originalData: null,

  /**
   * フローデータを取得する
   * @returns フローデータ
   */
  getFlowData: (): Flow | null => get().flowData,
  
  /**
   * アクションを取得する
   * @param index アクションのインデックス
   * @returns アクション
   */
  getActionById: (index: number): Action | undefined => get().flowData?.flow[index],

  /**
   * フローデータを設定する
   * @param data フローデータ
   */
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