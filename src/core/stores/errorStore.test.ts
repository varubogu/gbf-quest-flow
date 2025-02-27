import { describe, it, expect, beforeEach } from 'vitest';
import useErrorStore from './errorStore';

describe('errorStore', () => {
  beforeEach(() => {
    const store = useErrorStore.getState();
    store.clearError();
  });

  it('初期状態が正しいこと', () => {
    const store = useErrorStore.getState();
    expect(store.error).toBeNull();
    expect(store.isErrorDialogOpen).toBe(false);
  });

  it('エラーを設定できること', () => {
    const testError = new Error('テストエラー');
    useErrorStore.getState().setError(testError);
    const updatedState = useErrorStore.getState();
    expect(updatedState.error).toBe(testError);
  });

  it('エラーダイアログの表示状態を設定できること', () => {
    useErrorStore.getState().setIsErrorDialogOpen(true);
    expect(useErrorStore.getState().isErrorDialogOpen).toBe(true);

    useErrorStore.getState().setIsErrorDialogOpen(false);
    expect(useErrorStore.getState().isErrorDialogOpen).toBe(false);
  });

  it('showErrorでエラーとダイアログ表示を同時に設定できること', () => {
    const testError = new Error('テストエラー');
    useErrorStore.getState().showError(testError);
    const updatedState = useErrorStore.getState();
    expect(updatedState.error).toBe(testError);
    expect(updatedState.isErrorDialogOpen).toBe(true);
  });

  it('clearErrorでエラーとダイアログ表示をクリアできること', () => {
    const testError = new Error('テストエラー');
    const store = useErrorStore.getState();
    store.showError(testError);

    // 状態が更新されたことを確認
    const stateAfterShow = useErrorStore.getState();
    expect(stateAfterShow.error).toBe(testError);
    expect(stateAfterShow.isErrorDialogOpen).toBe(true);

    // クリア処理
    useErrorStore.getState().clearError();

    // クリア後の状態を確認
    const stateAfterClear = useErrorStore.getState();
    expect(stateAfterClear.error).toBeNull();
    expect(stateAfterClear.isErrorDialogOpen).toBe(false);
  });
});
