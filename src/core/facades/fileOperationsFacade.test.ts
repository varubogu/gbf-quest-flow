import { describe, it, expect, vi, beforeEach } from 'vitest';
import useFileOperationsFacade from './fileOperationsFacade';
import * as fileService from '@/core/services/fileService';

// fileServiceのモック
vi.mock('@/core/services/fileService', () => ({
  loadFlowFromFile: vi.fn().mockResolvedValue(undefined),
  saveFlowToFile: vi.fn().mockResolvedValue(undefined),
}));

describe('fileOperationsFacade', () => {
  let facade: ReturnType<typeof useFileOperationsFacade.getState>;

  beforeEach(() => {
    vi.clearAllMocks();
    facade = useFileOperationsFacade.getState();
  });

  describe('単体テスト', () => {
    describe('loadFlowFromFile', () => {
      it('fileServiceのloadFlowFromFileを呼び出す', async () => {
        await facade.loadFlowFromFile();
        expect(fileService.loadFlowFromFile).toHaveBeenCalledTimes(1);
      });

      it('エラーが発生した場合はそのエラーを伝播する', async () => {
        const error = new Error('テストエラー');
        vi.mocked(fileService.loadFlowFromFile).mockRejectedValueOnce(error);

        await expect(facade.loadFlowFromFile()).rejects.toThrow('テストエラー');
        expect(fileService.loadFlowFromFile).toHaveBeenCalledTimes(1);
      });
    });

    describe('saveFlowToFile', () => {
      it('fileServiceのsaveFlowToFileを呼び出す（ファイル名なし）', async () => {
        await facade.saveFlowToFile();
        expect(fileService.saveFlowToFile).toHaveBeenCalledTimes(1);
        expect(fileService.saveFlowToFile).toHaveBeenCalledWith(undefined);
      });

      it('fileServiceのsaveFlowToFileを呼び出す（ファイル名あり）', async () => {
        const fileName = 'test.json';
        await facade.saveFlowToFile(fileName);
        expect(fileService.saveFlowToFile).toHaveBeenCalledTimes(1);
        expect(fileService.saveFlowToFile).toHaveBeenCalledWith(fileName);
      });

      it('エラーが発生した場合はそのエラーを伝播する', async () => {
        const error = new Error('保存エラー');
        vi.mocked(fileService.saveFlowToFile).mockRejectedValueOnce(error);

        await expect(facade.saveFlowToFile()).rejects.toThrow('保存エラー');
        expect(fileService.saveFlowToFile).toHaveBeenCalledTimes(1);
      });
    });
  });
});

