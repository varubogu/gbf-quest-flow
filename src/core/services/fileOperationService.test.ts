import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createFileInput,
  readJsonFile,
  saveJsonToFile,
  handleFileOperationError,
  downloadFlow,
  getDownloadFilename,
  shouldConfirmDiscard,
  showNoDataAlert,
  saveFlow,
  updateNewFlowState
} from './fileOperationService';
import type { Flow } from '@/types/types';

// errorFacadeのモック
vi.mock('@/core/services/errorDisplayService', () => ({
  displayUnknownError: vi.fn(),
  displayValidationError: vi.fn(),
}));

// accessibilityのモック
vi.mock('@/lib/utils/accessibility', () => ({
  announceToScreenReader: vi.fn(),
  handleError: vi.fn()
}));

// DOMモック
const mockAppendChild = vi.fn();
const mockRemoveChild = vi.fn();
const mockClick = vi.fn();
const mockCreateElement = vi.fn();
const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();
const mockConfirm = vi.fn();
const mockAlert = vi.fn();
const mockPushState = vi.fn();
const mockReplaceState = vi.fn();

import { displayUnknownError, displayValidationError } from '@/core/services/errorDisplayService';
import * as accessibility from '@/lib/utils/accessibility';


describe('fileOperationService', () => {
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

    // DOMモックの設定
    globalThis.document.createElement = mockCreateElement;
    globalThis.document.body.appendChild = mockAppendChild;
    globalThis.document.body.removeChild = mockRemoveChild;
    globalThis.URL.createObjectURL = mockCreateObjectURL;
    globalThis.URL.revokeObjectURL = mockRevokeObjectURL;
    globalThis.window.confirm = mockConfirm;
    globalThis.window.alert = mockAlert;
    globalThis.history.pushState = mockPushState;
    globalThis.history.replaceState = mockReplaceState;

    // モック実装
    mockCreateElement.mockImplementation((tag) => {
      if (tag === 'input') {
        return {
          type: '',
          accept: '',
          click: mockClick,
        };
      }
      if (tag === 'a') {
        return {
          href: '',
          download: '',
          click: mockClick,
          setAttribute: vi.fn(),
        };
      }
      return {};
    });

    mockCreateObjectURL.mockReturnValue('blob:test-url');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createFileInput', () => {
    it('ファイル選択用のinput要素を作成する', () => {
      const input = createFileInput();
      expect(input.type).toBe('file');
      expect(input.accept).toBe('.json');
    });
  });

  describe('readJsonFile', () => {
    it('ファイルからJSONデータを読み込む', async () => {
      // File.text()をモック
      const mockText = JSON.stringify(mockFlow);
      const mockFile = {
        text: vi.fn().mockResolvedValue(mockText)
      } as unknown as File;

      const result = await readJsonFile(mockFile);
      expect(result).toEqual(mockFlow);
      expect(mockFile.text).toHaveBeenCalled();
    });

    it('不正なJSONの場合はエラーをスローする', async () => {
      // 不正なJSONを返すモック
      const mockFile = {
        text: vi.fn().mockResolvedValue('invalid json')
      } as unknown as File;

      await expect(readJsonFile(mockFile)).rejects.toThrow();
      expect(mockFile.text).toHaveBeenCalled();
    });
  });

  // selectFileのテストは複雑なため、このテストファイルでは省略
  // 実際のユーザー操作を伴うため、E2Eテストで検証するのが適切

  describe('saveJsonToFile', () => {
    it('フローデータをJSONファイルとして保存する', async () => {
      await saveJsonToFile(mockFlow, 'test.json');

      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalled();
    });

    it('ファイル名が指定されていない場合はフロータイトルを使用する', async () => {
      await saveJsonToFile(mockFlow);

      const aElement = mockCreateElement.mock.results.find(
        (result) => result.value && result.value.download !== undefined
      )?.value;

      expect(aElement.download).toBe(`${mockFlow.title}.json`);
    });
  });

  describe('handleFileOperationError', () => {
    it('Errorオブジェクトの場合はshowUnknownErrorを呼び出す', () => {
      const error = new Error('テストエラー');
      handleFileOperationError(error, 'デフォルトメッセージ');

      expect(displayUnknownError).toHaveBeenCalledWith(error);
      expect(displayValidationError).not.toHaveBeenCalled();
    });

    it('Errorオブジェクト以外の場合はshowValidationErrorを呼び出す', () => {
      handleFileOperationError('文字列エラー', 'デフォルトメッセージ');

      expect(displayValidationError).toHaveBeenCalledWith('デフォルトメッセージ');
      expect(displayUnknownError).not.toHaveBeenCalled();
    });
  });

  // FileOperations.tsから移行した関数のテスト

  describe('downloadFlow', () => {
    it('フローデータをJSONファイルとしてダウンロードする', async () => {
      const filename = 'test.json';
      await downloadFlow(mockFlow, filename);

      // Blobが作成されたことを確認
      expect(mockCreateObjectURL).toHaveBeenCalled();

      // aタグが作成されたことを確認
      expect(mockCreateElement).toHaveBeenCalledWith('a');

      // aタグのプロパティが設定されたことを確認
      const aElement = mockCreateElement.mock.results.find(
        (result) => result.value && result.value.download !== undefined
      )?.value;
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

  // flowOperations.tsから移行した関数のテスト

  describe('saveFlow', () => {
    it('フローデータを保存し、履歴を更新する', async () => {
      const result = await saveFlow(mockFlow, 'test-id');

      // Blobが作成されたことを確認
      expect(mockCreateObjectURL).toHaveBeenCalled();

      // aタグが作成されたことを確認
      expect(mockCreateElement).toHaveBeenCalledWith('a');

      // aタグがクリックされたことを確認
      expect(mockClick).toHaveBeenCalled();

      // URLが解放されたことを確認
      expect(mockRevokeObjectURL).toHaveBeenCalled();

      // 履歴が更新されたことを確認
      expect(mockReplaceState).toHaveBeenCalledWith(
        { flowData: mockFlow, isSaving: true },
        '',
        '/test-id'
      );

      // スクリーンリーダーに通知されたことを確認
      expect(accessibility.announceToScreenReader).toHaveBeenCalledWith('フローを保存しました');

      // 成功を返すことを確認
      expect(result).toBe(true);
    });

    it('エラーが発生した場合はfalseを返す', async () => {
      // エラーを発生させる
      mockCreateObjectURL.mockImplementation(() => {
        throw new Error('テストエラー');
      });

      const result = await saveFlow(mockFlow);

      // エラーハンドリングが呼ばれたことを確認
      expect(accessibility.handleError).toHaveBeenCalled();

      // 失敗を返すことを確認
      expect(result).toBe(false);
    });
  });

  describe('updateNewFlowState', () => {
    it('新規フロー作成時の状態を更新する', () => {
      updateNewFlowState(mockFlow);

      // 履歴が更新されたことを確認
      expect(mockPushState).toHaveBeenCalledWith(
        { flowData: mockFlow },
        '',
        '/?mode=new'
      );

      // スクリーンリーダーに通知されたことを確認
      expect(accessibility.announceToScreenReader).toHaveBeenCalledWith('新しいフローを作成しました');
    });

    it('flowDataがnullの場合も正常に動作する', () => {
      updateNewFlowState(null);

      // 履歴が更新されないことを確認
      expect(mockPushState).not.toHaveBeenCalled();

      // スクリーンリーダーに通知されたことを確認
      expect(accessibility.announceToScreenReader).toHaveBeenCalledWith('新しいフローを作成しました');
    });

    it('エラーが発生した場合はエラーハンドリングを行う', () => {
      // エラーを発生させる
      mockPushState.mockImplementation(() => {
        throw new Error('テストエラー');
      });

      updateNewFlowState(mockFlow);

      // エラーハンドリングが呼ばれたことを確認
      expect(accessibility.handleError).toHaveBeenCalled();
    });
  });
});