import type { CursorStore } from '@/types/flowStore.types';
import { create } from 'zustand';

/**
 * カーソル位置管理用のストア
 * テーブルの現在選択されている行を管理します
 */
const useCursorStore = create<CursorStore>((set, _get) => ({
  // 状態
  currentRow: 0,

  // メソッド
  setCurrentRow: (row: number): void => {
    set({ currentRow: row });
  },
}));

export default useCursorStore;