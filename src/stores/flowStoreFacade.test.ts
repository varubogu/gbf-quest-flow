import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import useFlowStoreFacade from './flowStoreFacade';
import useCursorStore from './cursorStore';

describe('flowStoreFacade - CursorStore連携', () => {
  // 各テストの前に初期状態をリセット
  beforeEach(() => {
    useCursorStore.setState({ currentRow: 0 });
  });

  // 各テストの後に状態をクリーンアップ
  afterEach(() => {
    useCursorStore.setState({ currentRow: 0 });
  });

  it('ファサードのcurrentRowプロパティがCursorStoreの値と同期していること', () => {
    // CursorStoreの値を変更
    useCursorStore.setState({ currentRow: 7 });

    // ファサード経由で値を取得
    const facade = useFlowStoreFacade.getState();

    // 値が同期していることを確認
    expect(facade.currentRow).toBe(7);
  });

  it('ファサードのsetCurrentRowメソッドがCursorStoreの値を更新すること', () => {
    const facade = useFlowStoreFacade.getState();

    // ファサード経由で値を更新
    facade.setCurrentRow(3);

    // CursorStoreの値が更新されていることを確認
    const cursorStore = useCursorStore.getState();
    expect(cursorStore.currentRow).toBe(3);
  });

  it('ファサードのgetCurrentRowメソッドがCursorStoreから正しい値を取得すること', () => {
    // CursorStoreの値を直接設定
    useCursorStore.setState({ currentRow: 5 });

    // ファサード経由でメソッドを呼び出して値を取得
    const facade = useFlowStoreFacade.getState();
    const currentRow = facade.getCurrentRow();

    // 取得した値が正しいことを確認
    expect(currentRow).toBe(5);
  });
});