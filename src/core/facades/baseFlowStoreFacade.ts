import { create } from 'zustand';
import type { Flow, Action } from '@/types/models';
import useBaseFlowStore from '@/core/stores/baseFlowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import { newFlowData } from '@/core/services/fileService';

/**
 * ベースフローストアのファサード
 *
 * このファサードは、ベースフローストアにアクセスするための統一されたインターフェースを提供します。
 * これにより、コンポーネントはストアの実装の詳細から切り離され、データアクセスの方法が変更されても
 * コンポーネント側の変更を最小限に抑えることができます。
 */
const useBaseFlowStoreFacade = create((set, _get) => {
  // 初期状態を設定
  const initialState = {
    flowData: useBaseFlowStore.getState().flowData,
    originalData: useBaseFlowStore.getState().originalData,
    isEditMode: useEditModeStore.getState().isEditMode,
  };

  // BaseFlowStoreの変更を監視
  const _unsubBaseFlow = useBaseFlowStore.subscribe((state) => {
    console.log('BaseFlowStoreFacade: BaseFlowStoreの変更を検知しました', state.flowData?.title);
    set({
      flowData: state.flowData,
      originalData: state.originalData
    });
  });

  // EditModeStoreの変更を監視
  const _unsubEditMode = useEditModeStore.subscribe((state) => {
    console.log('BaseFlowStoreFacade: EditModeStoreの変更を検知しました', state.isEditMode);
    set({
      isEditMode: state.isEditMode
    });
  });

  return {
    // 状態（プロパティ）- BaseFlowStoreとEditModeStoreから初期化
    ...initialState,

    // BaseFlowStore関連のメソッド
    getFlowData: (): Flow | null => useBaseFlowStore.getState().getFlowData(),
    getActionById: (index: number): Action | undefined => useBaseFlowStore.getState().getActionById(index),
    setFlowData: (data: Flow | null): void => useBaseFlowStore.getState().setFlowData(data),
    updateFlowData: (updates: Partial<Flow>): void => useBaseFlowStore.getState().updateFlowData(updates),
    updateAction: (index: number, updates: Partial<Action>): void => useBaseFlowStore.getState().updateAction(index, updates),

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

export default useBaseFlowStoreFacade;