import type { EditModeStore } from '@/types/flowStore.types';
import { create } from 'zustand';

/**
 * 編集モードの状態管理を行うストア
 */
const useEditModeStore = create<EditModeStore>((set, get) => ({
  /**
   * 編集モードの状態
   */
  isEditMode: false,

  /**
   * 編集モードの状態を取得する
   * @returns 編集モードの状態
   */
  getIsEditMode: (): boolean => get().isEditMode,

  /**
   * 編集モードの状態を設定する
   * @param isEdit 編集モードの状態
   */
  setIsEditMode: (isEdit: boolean): void => {
    set({ isEditMode: isEdit });
  },

  /**
   * 編集モードを開始する
   */
  startEdit: (): void => {
    set({ isEditMode: true });
  },

  /**
   * 編集モードを終了する
   */
  endEdit: (): void => {
    set({ isEditMode: false });
  },
}));

export default useEditModeStore;