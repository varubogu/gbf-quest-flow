import { create } from 'zustand';
import useCursorStore from '@/core/stores/cursorStore';

/**
 * カーソルストアのファサード
 *
 * このファサードは、カーソルストアにアクセスするための統一されたインターフェースを提供します。
 * これにより、コンポーネントはストアの実装の詳細から切り離され、データアクセスの方法が変更されても
 * コンポーネント側の変更を最小限に抑えることができます。
 */
const useCursorStoreFacade = create((set, get) => {
  // 初期状態を設定
  const initialState = {
    currentRow: useCursorStore.getState().currentRow,
  };

  // CursorStoreの変更を監視
  const unsubCursor = useCursorStore.subscribe((state) => {
    console.log('CursorStoreFacade: CursorStoreの変更を検知しました', state.currentRow);
    set({
      currentRow: state.currentRow
    });
  });

  return {
    // 状態（プロパティ）- CursorStoreから初期化
    ...initialState,

    // CursorStore関連のメソッド
    getCurrentRow: (): number => useCursorStore.getState().getCurrentRow(),
    setCurrentRow: (row: number): void => useCursorStore.getState().setCurrentRow(row),
  };
});

export default useCursorStoreFacade;