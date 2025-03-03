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
   * 編集モードを開始する
   */
  editStart: (): void => {
    set({ isEditMode: true });
  },

  /**
   * 編集モードを終了する
   */
  editEnd: (): void => {
    set({ isEditMode: false });
  },
}));

export default useEditModeStore;