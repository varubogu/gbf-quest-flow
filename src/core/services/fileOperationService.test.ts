import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createFileInput,
  readJsonFile,
  saveJsonToFile,
  handleFileOperationError
} from './fileOperationService';
import { errorFacade } from '@/core/facades/errorFacade';
import type { Flow } from '@/types/types';

// errorFacadeのモック
vi.mock('@/core/facades/errorFacade', () => ({
  errorFacade: {
    showUnknownError: vi.fn(),
    showValidationError: vi.fn(),
  },
}));

// DOMモック
const mockAppendChild = vi.fn();
const mockRemoveChild = vi.fn();
const mockClick = vi.fn();
const mockCreateElement = vi.fn();
const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();

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

    // モック実装
    mockCreateElement.mockImplementation((tag) => {
      if (tag === 'input') {
        return {
          type: '',
          accept: '',
          click: mockClick,
          files: [],
        };
      }
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

      expect(errorFacade.showUnknownError).toHaveBeenCalledWith(error);
      expect(errorFacade.showValidationError).not.toHaveBeenCalled();
    });

    it('Errorオブジェクト以外の場合はshowValidationErrorを呼び出す', () => {
      handleFileOperationError('文字列エラー', 'デフォルトメッセージ');

      expect(errorFacade.showValidationError).toHaveBeenCalledWith('デフォルトメッセージ');
      expect(errorFacade.showUnknownError).not.toHaveBeenCalled();
    });
  });
});