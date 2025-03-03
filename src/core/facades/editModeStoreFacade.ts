import { create } from 'zustand';
import useEditModeStore from '@/core/stores/editModeStore';
import {
   getIsEditMode as getIsEditModeFromStore,
   startEditMode,
   cancelEditMode,
   createNewFlow
} from '@/core/services/editModeService';

/**
 * 編集モードストアのファサード
 *
 * このファサードは、編集モードストアにアクセスするための統一されたインターフェースを提供します。
 * これにより、コンポーネントはストアの実装の詳細から切り離され、データアクセスの方法が変更されても
 * コンポーネント側の変更を最小限に抑えることができます。
 */
const useEditModeStoreFacade = create((set, _get) => {
  // 初期状態を設定
  const initialState = {
    isEditMode: useEditModeStore.getState().isEditMode,
  };

  // EditModeStoreの変更を監視
  useEditModeStore.subscribe((state) => {
    console.log('EditModeStoreFacade: EditModeStoreの変更を検知しました', state.isEditMode);
    set({
      isEditMode: state.isEditMode
    });
  });

  return {
    // 状態（プロパティ）- EditModeStoreから初期化
    ...initialState,

    getIsEditMode: (): boolean => getIsEditModeFromStore(),

    setIsEditMode: (isEdit: boolean): void => startEditMode(isEdit),
    cancelEdit: (): void => cancelEditMode(),
    createNewFlow: (): void => createNewFlow(),
  };
});

export default useEditModeStoreFacade;