import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as editModeStoreFacade from './editModeStoreFacade';
import * as editModeService from '@/core/services/editModeService';

// editModeServiceのモック
vi.mock('@/core/services/editModeService', () => {
  return {
    getIsEditMode: vi.fn().mockReturnValue(true),
    setIsEditMode: vi.fn(),
    startEdit: vi.fn(),
    cancelEdit: vi.fn(),
    finishEdit: vi.fn(),
    createNewFlow: vi.fn()
  };
});

describe('editModeStoreFacade', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('単体テスト', () => {
    describe('getIsEditMode', () => {
      it('対応するserviceが呼ばれること', () => {
        // テスト実行
        const result = editModeStoreFacade.getIsEditMode();

        // 検証
        expect(editModeService.getIsEditMode).toHaveBeenCalledTimes(1);
        expect(result).toBe(true);
      });
    });

    describe('setIsEditMode', () => {
      it('対応するserviceが呼ばれること', () => {
        // テスト実行
        editModeStoreFacade.setIsEditMode(true);

        // 検証
        expect(editModeService.setIsEditMode).toHaveBeenCalledWith(true);
        expect(editModeService.setIsEditMode).toHaveBeenCalledTimes(1);
      });
    });

    describe('startEdit', () => {
      it('対応するserviceが呼ばれること', () => {
        // テスト実行
        editModeStoreFacade.startEdit();

        // 検証
        expect(editModeService.startEdit).toHaveBeenCalledTimes(1);
      });
    });

    describe('finishEdit', () => {
      it('対応するserviceが呼ばれること', () => {
        // テスト実行
        editModeStoreFacade.finishEdit();

        // 検証
        expect(editModeService.finishEdit).toHaveBeenCalledTimes(1);
      });
    });

    describe('cancelEdit', () => {
      it('対応するserviceが呼ばれること', () => {
        // テスト実行
        editModeStoreFacade.cancelEdit();

        // 検証
        expect(editModeService.cancelEdit).toHaveBeenCalledTimes(1);
      });
    });

    describe('createNewFlow', () => {
      it('対応するserviceが呼ばれること', () => {
        // テスト実行
        editModeStoreFacade.createNewFlow();

        // 検証
        expect(editModeService.createNewFlow).toHaveBeenCalledTimes(1);
      });
    });
  });
});