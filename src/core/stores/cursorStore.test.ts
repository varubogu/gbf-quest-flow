import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import useCursorStore from './cursorStore';

describe('cursorStore', () => {
  // 各テストの前に初期状態をリセット
  beforeEach(() => {
    useCursorStore.setState({ currentRow: 0 });
  });

  // 各テストの後に状態をクリーンアップ
  afterEach(() => {
    useCursorStore.setState({ currentRow: 0 });
  });

  it('初期状態ではcurrentRowが0であること', () => {
    const store = useCursorStore.getState();
    expect(store.currentRow).toBe(0);
  });

  it('setCurrentRowメソッドでcurrentRowを更新できること', () => {
    const store = useCursorStore.getState();
    store.setCurrentRow(5);

    const updatedStore = useCursorStore.getState();
    expect(updatedStore.currentRow).toBe(5);
  });

  it('getCurrentRowメソッドでcurrentRowの値を取得できること', () => {
    const store = useCursorStore.getState();
    store.setCurrentRow(3);

    const currentRow = store.getCurrentRow();
    expect(currentRow).toBe(3);
  });

  it('不正な値（負の数）を設定しても動作すること', () => {
    const store = useCursorStore.getState();
    store.setCurrentRow(-1);

    const updatedStore = useCursorStore.getState();
    expect(updatedStore.currentRow).toBe(-1);
  });
});