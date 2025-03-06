import { describe, it, expect, vi, beforeEach } from 'vitest';
import { downloadFlow, getDownloadFilename, shouldConfirmDiscard, showNoDataAlert } from './fileOperationFacade';
import * as fileOperationService from '@/core/services/fileOperationService';
import type { Flow } from '@/types/models';

// fileOperationServiceのモック
vi.mock('@/core/services/fileOperationService', () => ({
  downloadFlow: vi.fn(),
  getDownloadFilename: vi.fn(),
  shouldConfirmDiscard: vi.fn(),
  showNoDataAlert: vi.fn()
}));

describe('fileOperationFacade', () => {
  // テスト用のモックデータ
  const mockFlow: Flow = {
    title: 'テストフロー',
    quest: 'テストクエスト',
    author: 'テスト作者',
    description: 'テスト説明',
    updateDate: '2024-01-01',
    note: 'テストノート',
    organization: {
      job: { name: '', note: '', equipment: { name: '', note: '' }, abilities: [] },
      member: { front: [], back: [] },
      weapon: {
        main: { name: '', note: '', additionalSkill: '' },
        other: [],
        additional: [],
      },
      weaponEffects: { taRate: '', hp: '', defense: '' },
      summon: {
        main: { name: '', note: '' },
        friend: { name: '', note: '' },
        other: [],
        sub: [],
      },
      totalEffects: { taRate: '', hp: '', defense: '' },
    },
    always: '',
    flow: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('downloadFlow', () => {
    it('fileOperationServiceのdownloadFlow関数を呼び出す', async () => {
      const filename = 'test.json';

      // サービスのモック関数の戻り値を設定
      vi.mocked(fileOperationService.downloadFlow).mockResolvedValue();

      await downloadFlow(mockFlow, filename);

      // サービスの関数が正しいパラメータで呼び出されたことを確認
      expect(fileOperationService.downloadFlow).toHaveBeenCalledWith(mockFlow, filename);
    });
  });

  describe('getDownloadFilename', () => {
    it('fileOperationServiceのgetDownloadFilename関数を呼び出す', () => {
      // サービスのモック関数の戻り値を設定
      vi.mocked(fileOperationService.getDownloadFilename).mockReturnValue('テストフロー.json');

      const result = getDownloadFilename(mockFlow);

      // サービスの関数が正しいパラメータで呼び出されたことを確認
      expect(fileOperationService.getDownloadFilename).toHaveBeenCalledWith(mockFlow);
      expect(result).toBe('テストフロー.json');
    });
  });

  describe('shouldConfirmDiscard', () => {
    it('fileOperationServiceのshouldConfirmDiscard関数を呼び出す', () => {
      const t = vi.fn().mockReturnValue('変更を破棄しますか？');

      // サービスのモック関数の戻り値を設定
      vi.mocked(fileOperationService.shouldConfirmDiscard).mockReturnValue(true);

      const result = shouldConfirmDiscard(true, t);

      // サービスの関数が正しいパラメータで呼び出されたことを確認
      expect(fileOperationService.shouldConfirmDiscard).toHaveBeenCalledWith(true, t);
      expect(result).toBe(true);
    });
  });

  describe('showNoDataAlert', () => {
    it('fileOperationServiceのshowNoDataAlert関数を呼び出す', () => {
      const t = vi.fn().mockReturnValue('ダウンロードするデータがありません');

      showNoDataAlert(t);

      // サービスの関数が正しいパラメータで呼び出されたことを確認
      expect(fileOperationService.showNoDataAlert).toHaveBeenCalledWith(t);
    });
  });
});