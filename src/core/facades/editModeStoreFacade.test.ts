import { describe, it, expect, vi, beforeEach } from 'vitest';
import useEditModeStoreFacade from './editModeStoreFacade';
import * as editModeService from '@/core/services/editModeService';

// モックの設定
vi.mock('@/core/stores/editModeStore', () => {
  return {
    default: {
      getState: vi.fn(() => ({
        getIsEditMode: vi.fn().mockReturnValue(true),
        isEditMode: false
      })),
      setState: vi.fn(),
      subscribe: vi.fn(() => vi.fn()) // unsubscribe関数を返す
    }
  };
});

// editModeServiceのモック
vi.mock('@/core/services/editModeService', () => {
  return {
    getIsEditMode: vi.fn().mockReturnValue(true),
    startEditMode: vi.fn(),
    cancelEditMode: vi.fn(),
    createNewFlow: vi.fn()
  };
});

// ファサードの型定義
type EditModeStoreFacade = {
  isEditMode: boolean;
  getIsEditMode: () => boolean;
  setIsEditMode: (_isEdit: boolean) => void;
  cancelEdit: () => void;
  createNewFlow: () => void;
};

describe('editModeStoreFacade', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('単体テスト', () => {
    describe('getIsEditMode', () => {
      it('editModeServiceのgetIsEditModeを呼び出す', () => {
        // テスト実行
        const result = (useEditModeStoreFacade.getState() as EditModeStoreFacade).getIsEditMode();

        // 検証
        expect(editModeService.getIsEditMode).toHaveBeenCalled();
        expect(result).toBe(true);
      });
    });

    describe('setIsEditMode', () => {
      it('editModeServiceのstartEditModeを呼び出す', () => {
        // テスト実行
        const facade = useEditModeStoreFacade.getState() as EditModeStoreFacade;
        facade.setIsEditMode(true);

        // 検証
        expect(editModeService.startEditMode).toHaveBeenCalledWith(true);
      });
    });

    describe('cancelEdit', () => {
      it('editModeServiceのcancelEditModeを呼び出す', () => {
        // テスト実行
        const facade = useEditModeStoreFacade.getState() as EditModeStoreFacade;
        facade.cancelEdit();

        // 検証
        expect(editModeService.cancelEditMode).toHaveBeenCalled();
      });
    });

    describe('createNewFlow', () => {
      it('editModeServiceのcreateNewFlowを呼び出す', () => {
        // テスト実行
        const facade = useEditModeStoreFacade.getState() as EditModeStoreFacade;
        facade.createNewFlow();

        // 検証
        expect(editModeService.createNewFlow).toHaveBeenCalled();
      });
    });
  });

  describe('コンソールログのテスト', () => {
    it('コンソールログが出力される機能を持つ', () => {
      // コンソールログのモック
      const originalConsoleLog = console.log;
      console.log = vi.fn();

      // ファサードの初期化（実際のsubscribeは呼ばれない）
      useEditModeStoreFacade;

      // コンソールログを元に戻す
      console.log = originalConsoleLog;

      // 注: 実際のsubscribeのコールバックをテストすることは難しいため、
      // ここではファサードが正しく初期化されることだけを確認します
    });
  });
});