import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { downloadFlow, getDownloadFilename, shouldConfirmDiscard, showNoDataAlert } from './FileOperations';
import type { Flow } from '@/types/models';

describe('FileOperations', () => {
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

  // DOMモック
  const mockCreateElement = vi.fn();
  const mockCreateObjectURL = vi.fn();
  const mockRevokeObjectURL = vi.fn();
  const mockClick = vi.fn();
  const mockAppendChild = vi.fn();
  const mockRemoveChild = vi.fn();
  const mockConfirm = vi.fn();
  const mockAlert = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // DOMモックの設定
    globalThis.document.createElement = mockCreateElement;
    globalThis.URL.createObjectURL = mockCreateObjectURL;
    globalThis.URL.revokeObjectURL = mockRevokeObjectURL;
    globalThis.document.body.appendChild = mockAppendChild;
    globalThis.document.body.removeChild = mockRemoveChild;
    globalThis.window.confirm = mockConfirm;
    globalThis.window.alert = mockAlert;

    // モック実装
    mockCreateElement.mockImplementation((tag) => {
      if (tag === 'a') {
        return {
          href: '',
          download: '',
          click: mockClick,
        };
      }
      return {};
    });

    mockCreateObjectURL.mockReturnValue('blob:test-url');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('downloadFlow', () => {
    it('フローデータをJSONファイルとしてダウンロードする', async () => {
      const filename = 'test.json';
      await downloadFlow(mockFlow, filename);

      // Blobが作成されたことを確認
      expect(mockCreateObjectURL).toHaveBeenCalled();

      // aタグが作成されたことを確認
      expect(mockCreateElement).toHaveBeenCalledWith('a');

      // aタグのプロパティが設定されたことを確認
      const aElement = mockCreateElement.mock.results[0].value;
      expect(aElement.href).toBe('blob:test-url');
      expect(aElement.download).toBe(filename);

      // aタグがクリックされたことを確認
      expect(mockClick).toHaveBeenCalled();

      // URLが解放されたことを確認
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:test-url');
    });
  });

  describe('getDownloadFilename', () => {
    it('フローデータからファイル名を生成する（タイトルあり）', () => {
      const result = getDownloadFilename(mockFlow);
      expect(result).toBe('テストフロー.json');
    });

    it('フローデータからファイル名を生成する（タイトルなし）', () => {
      const noTitleFlow = { ...mockFlow, title: '' };
      const result = getDownloadFilename(noTitleFlow);
      expect(result).toBe('flow.json');
    });
  });

  describe('shouldConfirmDiscard', () => {
    it('編集モードの場合は確認ダイアログを表示する', () => {
      const t = vi.fn().mockReturnValue('変更を破棄しますか？');
      mockConfirm.mockReturnValue(true);

      const result = shouldConfirmDiscard(true, t);

      expect(t).toHaveBeenCalledWith('confirmDiscardChanges');
      expect(mockConfirm).toHaveBeenCalledWith('変更を破棄しますか？');
      expect(result).toBe(true);
    });

    it('編集モードでない場合は確認なしでtrueを返す', () => {
      const t = vi.fn();

      const result = shouldConfirmDiscard(false, t);

      expect(t).not.toHaveBeenCalled();
      expect(mockConfirm).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('showNoDataAlert', () => {
    it('データなしアラートを表示する', () => {
      const t = vi.fn().mockReturnValue('ダウンロードするデータがありません');

      showNoDataAlert(t);

      expect(t).toHaveBeenCalledWith('noDataToDownload');
      expect(mockAlert).toHaveBeenCalledWith('ダウンロードするデータがありません');
    });
  });
});