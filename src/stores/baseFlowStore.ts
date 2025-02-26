import type { Flow, Action } from '@/types/models';
import type { BaseFlowStore } from '@/types/flowStore.types';
import { create } from 'zustand';

/**
 * フロー状態の基本的な読み取り・更新機能を提供するストア
 * このフェーズではまだ読み取り関数のみを実装しています
 */
const useBaseFlowStore = create<BaseFlowStore>((set, get) => ({
  // 状態
  flowData: null,
  originalData: null,

  // 読み取り用メソッド
  getFlowData: (): Flow | null => get().flowData,
  getActionById: (index: number): Action | undefined => get().flowData?.flow[index],

  // 更新用メソッド（この時点では最小実装のみ、後のステップで完全実装）
  setFlowData: (data: Flow | null): void => {
    set({ flowData: data });
  },
  updateFlowData: (updates: Partial<Flow>): void => {
    const currentData = get().flowData;
    if (!currentData) return;

    set({
      flowData: {
        ...currentData,
        ...updates,
      },
    });
  },
  updateAction: (index: number, updates: Partial<Action>): void => {
    const currentData = get().flowData;
    if (!currentData) return;

    const newFlow = [...currentData.flow];
    // すべての必須フィールドを確保して更新
    newFlow[index] = {
      hp: newFlow[index]?.hp || '',
      prediction: newFlow[index]?.prediction || '',
      charge: newFlow[index]?.charge || '',
      guard: newFlow[index]?.guard || '',
      action: newFlow[index]?.action || '',
      note: newFlow[index]?.note || '',
      ...updates,
    };

    set({
      flowData: {
        ...currentData,
        flow: newFlow,
      },
    });
  }
}));

export default useBaseFlowStore;