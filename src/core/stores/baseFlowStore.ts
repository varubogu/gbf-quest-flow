import type { Flow, Action } from '@/types/models';
import type { BaseFlowStore } from '@/types/flowStore.types';
import { create } from 'zustand';
import useErrorStore from './errorStore';
import { adjustOrganizationData } from '../services/organizationService';

/**
 * フロー状態の基本的な読み取り・更新機能を提供するストア
 */
const useBaseFlowStore = create<BaseFlowStore>((set, get) => ({
  // 状態
  flowData: null,
  originalData: null,

  // 読み取り用メソッド
  getFlowData: (): Flow | null => get().flowData,
  getActionById: (index: number): Action | undefined => get().flowData?.flow[index],

  // 更新用メソッド
  setFlowData: (data: Flow | null): void => {
    try {
      if (!data) {
        set({ flowData: null });
        return;
      }
      const adjustedData = {
        ...data,
        organization: adjustOrganizationData(data.organization),
      };
      set({ flowData: adjustedData });

    } catch (error) {
      useErrorStore
        .getState()
        .showError(
          error instanceof Error ? error : new Error('データの設定中にエラーが発生しました')
        );
    }
  },

  updateFlowData: (updates: Partial<Flow>): void => {
    try {
      const currentData = get().flowData;
      if (!currentData) return;

      // 新しいデータを作成
      const newData = {
        ...currentData,
        ...updates,
      };

      // 現在のデータと新しいデータが異なる場合のみ処理を続行
      if (JSON.stringify(currentData) === JSON.stringify(newData)) {
        return;
      }

      // 変更後のデータを設定
      set({
        flowData: newData,
      });

      // 注：履歴への追加は、ファサードから元のflowStoreで行うため、ここでは行わない
    } catch (error) {
      useErrorStore
        .getState()
        .showError(
          error instanceof Error ? error : new Error('データの更新中にエラーが発生しました')
        );
    }
  },

  updateAction: (index: number, updates: Partial<Action>): void => {
    try {
      const currentData = get().flowData;
      if (!currentData) return;

      const newFlow = [...currentData.flow];
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

      // 注：履歴への追加は、ファサードから元のflowStoreで行うため、ここでは行わない
    } catch (error) {
      useErrorStore
        .getState()
        .showError(
          error instanceof Error ? error : new Error('アクションの更新中にエラーが発生しました')
        );
    }
  },
}));

export default useBaseFlowStore;