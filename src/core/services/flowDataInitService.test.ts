import { describe, it, expect, vi, beforeEach } from 'vitest';
import { newFlowData, createEmptyFlowData } from './flowDataInitService';
import useFlowStore from '@/core/stores/flowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import { clearHistory } from './historyService';
import { handleFileOperationError } from './fileOperationService';

// モック
vi.mock('@/core/stores/flowStore', () => ({
  default: {
    getState: vi.fn(() => ({
      flowData: null,
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

vi.mock('./historyService', () => ({
  clearHistory: vi.fn(),
}));

vi.mock('./fileOperationService', () => ({
  handleFileOperationError: vi.fn(),
}));

describe('flowDataInitService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createEmptyFlowData', () => {
    it('空のフローデータを作成する', () => {
      const emptyData = createEmptyFlowData();

      expect(emptyData).toHaveProperty('title', '新しいフロー');
      expect(emptyData).toHaveProperty('quest', '');
      expect(emptyData).toHaveProperty('author', '');
      expect(emptyData).toHaveProperty('description', '');
      expect(emptyData).toHaveProperty('updateDate');
      expect(emptyData).toHaveProperty('note', '');
      expect(emptyData).toHaveProperty('organization');
      expect(emptyData).toHaveProperty('always', '');
      expect(emptyData).toHaveProperty('flow');
      expect(emptyData.flow).toHaveLength(1);
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
      expect(useFlowStore.setState).toHaveBeenCalled();

      // useFlowStore.setStateの引数を検証
      const setStateCall = (useFlowStore.setState as jest.Mock).mock.calls[0][0];
      expect(setStateCall).toHaveProperty('flowData');
      expect(setStateCall).toHaveProperty('originalData', null);
    });

    it('エラーが発生した場合はエラーハンドリングを行う', async () => {
      // clearHistoryがエラーをスローするようにモック
      (clearHistory as jest.Mock).mockImplementation(() => {
        throw new Error('テストエラー');
      });

      await expect(newFlowData()).rejects.toThrow('テストエラー');
      expect(clearHistory).toHaveBeenCalled();
      expect(handleFileOperationError).toHaveBeenCalled();
    });
  });
});