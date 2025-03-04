import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadFlowFromFile, saveFlowToFile } from '@/core/facades/fileOperationsFacade';
import * as fileService from '@/core/services/fileService';

// fileServiceのモック
vi.mock('@/core/services/fileService', () => ({
  loadFlowFromFile: vi.fn().mockResolvedValue(undefined),
  saveFlowToFile: vi.fn().mockResolvedValue(undefined),
}));

describe('fileOperationsFacade', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('単体テスト', () => {
    describe('loadFlowFromFile', () => {
      it('fileServiceのloadFlowFromFileを正しく呼び出す', async () => {
        // モックの動作を設定
        const mockLoadFlow = vi.mocked(fileService.loadFlowFromFile);
        mockLoadFlow.mockResolvedValueOnce(undefined);

        await loadFlowFromFile();

        // モックが正しく呼び出されたことを確認
        expect(mockLoadFlow).toHaveBeenCalledTimes(1);
        expect(mockLoadFlow).toHaveBeenCalledWith();
      });

      it('エラーが発生した場合はそのエラーを伝播する', async () => {
        const error = new Error('テストエラー');
        const mockLoadFlow = vi.mocked(fileService.loadFlowFromFile);
        mockLoadFlow.mockRejectedValueOnce(error);

        await expect(loadFlowFromFile()).rejects.toThrow('テストエラー');
        expect(mockLoadFlow).toHaveBeenCalledTimes(1);
      });
    });

    describe('saveFlowToFile', () => {
      it('fileServiceのsaveFlowToFileを呼び出す（ファイル名なし）', async () => {
        // モックの動作を設定
        const mockSaveFlow = vi.mocked(fileService.saveFlowToFile);
        mockSaveFlow.mockResolvedValueOnce(undefined);

        await saveFlowToFile();

        // モックが正しく呼び出されたことを確認
        expect(mockSaveFlow).toHaveBeenCalledTimes(1);
        expect(mockSaveFlow).toHaveBeenCalledWith(undefined);
      });

      it('fileServiceのsaveFlowToFileを呼び出す（ファイル名あり）', async () => {
        const fileName = 'test.json';

        // モックの動作を設定
        const mockSaveFlow = vi.mocked(fileService.saveFlowToFile);
        mockSaveFlow.mockResolvedValueOnce(undefined);

        await saveFlowToFile(fileName);

        // モックが正しく呼び出されたことを確認
        expect(mockSaveFlow).toHaveBeenCalledTimes(1);
        expect(mockSaveFlow).toHaveBeenCalledWith(fileName);
      });

      it('エラーが発生した場合はそのエラーを伝播する', async () => {
        const error = new Error('保存エラー');
        const mockSaveFlow = vi.mocked(fileService.saveFlowToFile);
        mockSaveFlow.mockRejectedValueOnce(error);

        await expect(saveFlowToFile()).rejects.toThrow('保存エラー');
        expect(mockSaveFlow).toHaveBeenCalledTimes(1);
      });
    });
  });
});

