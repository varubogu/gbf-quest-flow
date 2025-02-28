import { create } from 'zustand';
import useEditModeStore from '@/core/stores/editModeStore';

/**
 * 編集モードストアのファサード
 *
 * このファサードは、編集モードストアにアクセスするための統一されたインターフェースを提供します。
 * これにより、コンポーネントはストアの実装の詳細から切り離され、データアクセスの方法が変更されても
 * コンポーネント側の変更を最小限に抑えることができます。
 */
const useEditModeStoreFacade = create((set, get) => {
  // 初期状態を設定
  const initialState = {
    isEditMode: useEditModeStore.getState().isEditMode,
  };

  // EditModeStoreの変更を監視
  const unsubEditMode = useEditModeStore.subscribe((state) => {
    console.log('EditModeStoreFacade: EditModeStoreの変更を検知しました', state.isEditMode);
    set({
      isEditMode: state.isEditMode
    });
  });

  return {
    // 状態（プロパティ）- EditModeStoreから初期化
    ...initialState,

    // EditModeStore関連のメソッド
    getIsEditMode: (): boolean => useEditModeStore.getState().getIsEditMode(),
    setIsEditMode: (isEdit: boolean): void => useEditModeStore.getState().setIsEditMode(isEdit),
    cancelEdit: (): void => useEditModeStore.getState().cancelEdit(),
    createNewFlow: (): void => useEditModeStore.getState().createNewFlow(),
  };
});

export default useEditModeStoreFacade;