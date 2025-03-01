// この機能は結合試験以上のレベルでテストする必要がある

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  newFlowData,
  createFileInput,
  readJsonFile,
  saveJsonToFile,
} from './fileService';
import useBaseFlowStore from '@/core/stores/baseFlowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import { clearHistory } from './historyService';
import type { Flow } from '@/types/types';

// モック
vi.mock('@/core/stores/baseFlowStore', () => ({
  default: {
    getState: vi.fn(() => ({
      getFlowData: vi.fn(),
      setFlowData: vi.fn(),
    })),
    setState: vi.fn(),
  },
}));

vi.mock('@/core/stores/editModeStore', () => ({
  default: {
    getState: vi.fn(() => ({
      isEditMode: false,
    })),
    setState: vi.fn(),
  },
}));

// カーソルストアのモックを修正
const mockSetCurrentRow = vi.fn();
vi.mock('@/core/stores/cursorStore', () => ({
  default: {
    getState: vi.fn(() => ({
      setCurrentRow: mockSetCurrentRow,
    })),
  },
}));

vi.mock('@/core/stores/errorStore', () => ({
  default: {
    getState: vi.fn(() => ({
      showError: vi.fn(),
    })),
  },
}));

vi.mock('./historyService', () => ({
  clearHistory: vi.fn(),
}));

// DOMモック
const mockAppendChild = vi.fn();
const mockRemoveChild = vi.fn();
const mockClick = vi.fn();
const mockCreateElement = vi.fn();
const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();

describe('fileService', () => {
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

  describe('newFlowData', () => {
    it('新しいフローデータを作成し、ストアを更新する', async () => {
      // テスト前にモックの設定を確認
      expect(mockSetCurrentRow).toBeDefined();

      await newFlowData();

      expect(clearHistory).toHaveBeenCalled();
      expect(mockSetCurrentRow).toHaveBeenCalledWith(0);
      expect(useEditModeStore.setState).toHaveBeenCalledWith({ isEditMode: true });
      expect(useBaseFlowStore.setState).toHaveBeenCalled();
    });
  });

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
  });
});
