import { create, type StoreApi, type UseBoundStore } from 'zustand';
import useCursorStore from '@/core/stores/cursorStore';

interface CursorStoreFacade {
  currentRow: number;
  getCurrentRow: () => number;
  setCurrentRow: (_row: number) => void;
}

/**
 * カーソルストアのファサード
 *
 * このファサードは、カーソルストアにアクセスするための統一されたインターフェースを提供します。
 * これにより、コンポーネントはストアの実装の詳細から切り離され、データアクセスの方法が変更されても
 * コンポーネント側の変更を最小限に抑えることができます。
 */
const useCursorStoreFacade: UseBoundStore<StoreApi<CursorStoreFacade>> = create((_set, _get): CursorStoreFacade => {
  // 初期状態を設定
  const initialState = {
    currentRow: useCursorStore.getState().currentRow,
  };

  return {
    // 状態（プロパティ）- CursorStoreから初期化
    ...initialState,

    // CursorStore関連のメソッド
    getCurrentRow: (): number => useCursorStore.getState().getCurrentRow(),
    setCurrentRow: (row: number): void => useCursorStore.getState().setCurrentRow(row),
  };
});

export default useCursorStoreFacade;