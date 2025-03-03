import { describe, it, expect, beforeEach, vi } from 'vitest';
import useEditModeStore from './editModeStore';

describe('EditModeStore', () => {
  beforeEach(() => {
    // ストアの状態をリセット
    useEditModeStore.setState({ isEditMode: false });

    // モックをリセット
    vi.clearAllMocks();
  });

  describe('基本的な状態管理', () => {
    it('初期状態ではisEditModeはfalseであるべき', () => {
      expect(useEditModeStore.getState().isEditMode).toBe(false);
    });

    it('getIsEditModeは正しい値を返すべき', () => {
      // falseの場合
      expect(useEditModeStore.getState().getIsEditMode()).toBe(false);

      // trueに変更した場合
      useEditModeStore.setState({ isEditMode: true });
      expect(useEditModeStore.getState().getIsEditMode()).toBe(true);
    });
  });

  describe('editStart', () => {
    it('編集モードを開始するとisEditModeがtrueになるべき', () => {
      // 実行
      useEditModeStore.getState().editStart();

      // 検証
      expect(useEditModeStore.getState().isEditMode).toBe(true);
    });
  });

  describe('editEnd', () => {
    it('編集モードを終了するとisEditModeがfalseになるべき', () => {
      // 事前に編集モードをオンにする
      useEditModeStore.setState({ isEditMode: true });

      // 実行
      useEditModeStore.getState().editEnd();

      // 検証
      expect(useEditModeStore.getState().isEditMode).toBe(false);
    });
  });
});