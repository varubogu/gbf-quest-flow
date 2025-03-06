// この機能は結合試験以上のレベルでテストする必要がある

import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import {
  loadFlowFromFile,
  saveFlowToFile,
} from './fileService';
import {
  readJsonFile,
  saveJsonToFile,
  selectFile,
} from './fileOperationService';
import useFlowStore from '@/core/stores/flowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import { clearHistory } from './historyService';
import type { Flow } from '@/types/types';

// モック
vi.mock('@/core/stores/flowStore', () => ({
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

vi.mock('./fileOperationService', () => ({
  createFileInput: vi.fn(),
  readJsonFile: vi.fn(),
  saveJsonToFile: vi.fn(),
  selectFile: vi.fn(),
  handleFileOperationError: vi.fn(),
}));

vi.mock('./flowDataInitService', () => ({
  newFlowData: vi.fn(),
  createEmptyFlowData: vi.fn(),
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

  describe('loadFlowFromFile', () => {
    it('ファイルからフローデータを読み込み、ストアを更新する', async () => {
      // selectFileとreadJsonFileのモックを設定
      (selectFile as Mock).mockResolvedValue({ name: 'test.json' });
      (readJsonFile as Mock).mockResolvedValue(mockFlow);

      await loadFlowFromFile();

      expect(selectFile).toHaveBeenCalled();
      expect(readJsonFile).toHaveBeenCalled();
      expect(clearHistory).toHaveBeenCalled();
      expect(mockSetCurrentRow).toHaveBeenCalledWith(0);
      expect(useEditModeStore.setState).toHaveBeenCalledWith({ isEditMode: false });
      expect(useFlowStore.setState).toHaveBeenCalled();
    });

    it('ファイル選択がキャンセルされた場合は何もしない', async () => {
      // selectFileがnullを返すようにモック
      (selectFile as Mock).mockResolvedValue(null);

      await loadFlowFromFile();

      expect(selectFile).toHaveBeenCalled();
      expect(readJsonFile).not.toHaveBeenCalled();
      expect(clearHistory).not.toHaveBeenCalled();
      expect(useFlowStore.setState).not.toHaveBeenCalled();
    });
  });

  describe('saveFlowToFile', () => {
    it('現在のフローデータをファイルとして保存する', async () => {
      // getFlowDataのモックを設定
      const getFlowDataMock = vi.fn().mockReturnValue(mockFlow);
      (useFlowStore.getState as Mock).mockReturnValue({
        getFlowData: getFlowDataMock,
      });

      await saveFlowToFile('test.json');

      expect(getFlowDataMock).toHaveBeenCalled();
      expect(saveJsonToFile).toHaveBeenCalledWith(mockFlow, 'test.json');
    });

    it('データがない場合はエラーをスローする', async () => {
      // getFlowDataがnullを返すようにモック
      const getFlowDataMock = vi.fn().mockReturnValue(null);
      (useFlowStore.getState as Mock).mockReturnValue({
        getFlowData: getFlowDataMock,
      });

      await expect(saveFlowToFile()).rejects.toThrow();
      expect(getFlowDataMock).toHaveBeenCalled();
      expect(saveJsonToFile).not.toHaveBeenCalled();
    });
  });
});
