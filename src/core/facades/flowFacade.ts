import { create } from 'zustand';
import type { Flow, Action } from '@/types/models';
import useFlowStore from '@/core/stores/flowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import { newFlowData } from '@/core/services/fileService';
import {
  setFlowData as serviceSetFlowData,
  updateFlowData as serviceUpdateFlowData,
  updateAction as serviceUpdateAction,
} from '@/core/services/flowService';

export interface IFlowFacade {
  flowData: Flow | null;
  originalData: Flow | null;
  isEditMode: boolean;
  getFlowData: () => Flow | null;
  getActionById: (_index: number) => Action | undefined;
  setFlowData: (_data: Flow | null) => void;
  updateFlowData: (_updates: Partial<Flow>) => void;
  updateAction: (_index: number, _updates: Partial<Action>) => void;
  setIsEditMode: (_isEdit: boolean) => void;
  createNewFlow: () => void;
}

/**
 * フローストアのファサード
 *
 * このファサードは、フローストアにアクセスするための統一されたインターフェースを提供します。
 * これにより、コンポーネントはストアの実装の詳細から切り離され、データアクセスの方法が変更されても
 * コンポーネント側の変更を最小限に抑えることができます。
 *
 * 注: 更新ロジックはflowServiceに委譲されています。
 */
const useFlowFacade = create<IFlowFacade>((_set, _get) => {

  return {
    flowData: useFlowStore.getState().flowData,
    originalData: useFlowStore.getState().originalData,
    isEditMode: useEditModeStore.getState().isEditMode,

    // FlowStore関連のメソッド - 読み取り系
    getFlowData: (): Flow | null => useFlowStore.getState().getFlowData(),
    getActionById: (index: number): Action | undefined => useFlowStore.getState().getActionById(index),

    // FlowStore関連のメソッド - 更新系（flowServiceに委譲）
    setFlowData: (data: Flow | null): void => serviceSetFlowData(data),

    updateFlowData: (updates: Partial<Flow>): void => {
      serviceUpdateFlowData(updates);
    },

    updateAction: (index: number, updates: Partial<Action>): void => {
      serviceUpdateAction(index, updates);
    },

    // EditModeStore関連のメソッド
    setIsEditMode: (isEdit: boolean): void => {
      useEditModeStore.getState().setIsEditMode(isEdit);
    },

    // FileService関連のメソッド
    createNewFlow: (): void => {
      // fileServiceを使用して新規フローを作成
      newFlowData();
    },
  };
});

export default useFlowFacade;