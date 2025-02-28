import { create } from 'zustand';
import type { Flow, Action } from '@/types/models';
import useBaseFlowStore from '@/core/stores/baseFlowStore';

/**
 * ベースフローストアのファサード
 *
 * このファサードは、ベースフローストアにアクセスするための統一されたインターフェースを提供します。
 * これにより、コンポーネントはストアの実装の詳細から切り離され、データアクセスの方法が変更されても
 * コンポーネント側の変更を最小限に抑えることができます。
 */
const useBaseFlowStoreFacade = create((set, get) => {
  // 初期状態を設定
  const initialState = {
    flowData: useBaseFlowStore.getState().flowData,
    originalData: useBaseFlowStore.getState().originalData,
  };

  // BaseFlowStoreの変更を監視
  const unsubBaseFlow = useBaseFlowStore.subscribe((state) => {
    console.log('BaseFlowStoreFacade: BaseFlowStoreの変更を検知しました', state.flowData?.title);
    set({
      flowData: state.flowData,
      originalData: state.originalData
    });
  });

  return {
    // 状態（プロパティ）- BaseFlowStoreから初期化
    ...initialState,

    // BaseFlowStore関連のメソッド
    getFlowData: (): Flow | null => useBaseFlowStore.getState().getFlowData(),
    getActionById: (index: number): Action | undefined => useBaseFlowStore.getState().getActionById(index),
    setFlowData: (data: Flow | null): void => useBaseFlowStore.getState().setFlowData(data),
    updateFlowData: (updates: Partial<Flow>): void => useBaseFlowStore.getState().updateFlowData(updates),
    updateAction: (index: number, updates: Partial<Action>): void => useBaseFlowStore.getState().updateAction(index, updates),
  };
});

export default useBaseFlowStoreFacade;