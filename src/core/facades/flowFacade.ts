import { create } from 'zustand';
import type { Flow, Action } from '@/types/models';
import useFlowStore from '@/core/stores/flowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import { newFlowData } from '@/core/services/fileService';
import { updateFlowData as serviceUpdateFlowData, updateAction as serviceUpdateAction } from '@/core/services/flowService';

/**
 * フローストアのファサード
 *
 * このファサードは、フローストアにアクセスするための統一されたインターフェースを提供します。
 * これにより、コンポーネントはストアの実装の詳細から切り離され、データアクセスの方法が変更されても
 * コンポーネント側の変更を最小限に抑えることができます。
 *
 * 注: 更新ロジックはflowServiceに委譲されています。
 */
const useFlowFacade = create((_set, _get) => {
  // 初期状態を設定
  const initialState = {
    flowData: useFlowStore.getState().flowData,
    originalData: useFlowStore.getState().originalData,
    isEditMode: useEditModeStore.getState().isEditMode,
  };

  return {
    // 状態（プロパティ）- FlowStoreとEditModeStoreから初期化
    ...initialState,

    // FlowStore関連のメソッド - 読み取り系
    getFlowData: (): Flow | null => useFlowStore.getState().getFlowData(),
    getActionById: (index: number): Action | undefined => useFlowStore.getState().getActionById(index),

    // FlowStore関連のメソッド - 更新系（flowServiceに委譲）
    setFlowData: (data: Flow | null): void => useFlowStore.getState().setFlowData(data),
    updateFlowData: (updates: Partial<Flow>): void => {
      // 現在の編集モードを取得して更新
      const isEditMode = useEditModeStore.getState().isEditMode;
      serviceUpdateFlowData(updates, isEditMode);
    },
    updateAction: (index: number, updates: Partial<Action>): void => {
      // 現在の編集モードを取得して更新
      const isEditMode = useEditModeStore.getState().isEditMode;
      serviceUpdateAction(index, updates, isEditMode);
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