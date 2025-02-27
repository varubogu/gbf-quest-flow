import type { CursorStore } from '@/types/flowStore.types';
import { create } from 'zustand';
import useFlowStore from './flowStore';

/**
 * カーソル位置管理用のストア
 * テーブルの現在選択されている行を管理します
 */
const useCursorStore = create<CursorStore>((set, get) => ({
  // 状態
  currentRow: 0,

  // メソッド
  setCurrentRow: (row: number): void => {
    set({ currentRow: row });

    // 旧flowStoreも更新（後方互換性のため）
    useFlowStore.getState().setCurrentRow(row);
  },
  getCurrentRow: (): number => get().currentRow,
}));

export default useCursorStore;