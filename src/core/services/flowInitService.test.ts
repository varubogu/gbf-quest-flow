import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createNewFlowData, newFlowData } from './flowInitService';
import type { Flow } from '@/types/models';

// モックの設定
vi.mock('@/core/stores/flowStore', () => ({
  default: {
    getState: vi.fn(() => ({
      getFlowData: vi.fn(),
      setFlowData: vi.fn(),
      originalData: null
    })),
    setState: vi.fn()
  }
}));

vi.mock('@/core/stores/editModeStore', () => ({
  default: {
    getState: vi.fn(() => ({
      startEdit: vi.fn()
    }))
  }
}));

vi.mock('@/core/stores/cursorStore', () => ({
  default: {
    setState: vi.fn()
  }
}));

vi.mock('./historyService', () => ({
  clearHistory: vi.fn()
}));

vi.mock('@/core/services/flowService', () => ({
  setFlowData: vi.fn()
}));

vi.mock('@/core/services/errorService', () => ({
  errorFactory: {
    createUnknownError: vi.fn((error) => ({
      type: 'unknown',
      message: error.message,
      originalError: error
    }))
  }
}));

vi.mock('@/core/stores/errorStore', () => ({
  default: {
    getState: vi.fn(() => ({
      showError: vi.fn()
    }))
  }
}));

// テスト用のインポート
import useFlowStore from '@/core/stores/flowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import useCursorStore from '@/core/stores/cursorStore';
import { setFlowData } from '@/core/services/flowService';
import useErrorStore from '@/core/stores/errorStore';

describe('flowInitService', () => {
  // モックのリセット
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // テスト用のモックデータ
  const mockFlow = {
    title: 'テストフロー',
    quest: 'テストクエスト',
    author: 'テスト作者',
    description: '',
    updateDate: '',
    note: '',
    always: '',
    flow: [],
    organization: {
      job: {
        name: '',
        note: '',
        equipment: {
          name: '',
          note: '',
        },
        abilities: [],
      },
      member: {
        front: [],
        back: [],
      },
      weapon: {
        main: {
          name: '',
          note: '',
          additionalSkill: '',
        },
        other: [],
        additional: [],
      },
      weaponEffects: {
        taRate: '',
        hp: '',
        defense: '',
      },
      summon: {
        main: { name: '', note: '' },
        friend: { name: '', note: '' },
        other: [],
        sub: [],
      },
      totalEffects: {
        taRate: '',
        hp: '',
        defense: '',
      },
    }
  } as Flow;

  describe('createNewFlowData', () => {
    it('新しいフローデータを作成すること', () => {
      const newData = createNewFlowData();

      expect(newData).toHaveProperty('title', '新しいフロー');
      expect(newData).toHaveProperty('quest', '');
      expect(newData).toHaveProperty('author', '');
      expect(newData).toHaveProperty('updateDate');
      expect(newData).toHaveProperty('organization');
      expect(newData).toHaveProperty('flow');
      expect(newData.flow).toHaveLength(1);
    });
  });

  describe('newFlowData', () => {
    it('新しいフローデータを作成し、ストアを更新する', () => {
      // モックの設定
      const getFlowDataMock = vi.fn().mockReturnValue(mockFlow);
      const setStateMock = vi.fn();
      const startEditMock = vi.fn();
      const cursorSetStateMock = vi.fn();

      (useFlowStore.getState as ReturnType<typeof vi.fn>).mockReturnValue({
        getFlowData: getFlowDataMock
      });

      useFlowStore.setState = setStateMock;
      (useEditModeStore.getState as ReturnType<typeof vi.fn>).mockReturnValue({
        startEdit: startEditMock
      });
      useCursorStore.setState = cursorSetStateMock;

      // テスト実行
      newFlowData();

      // 検証
      expect(startEditMock).toHaveBeenCalled();
      expect(setFlowData).toHaveBeenCalled();
      expect(setStateMock).toHaveBeenCalledWith({ originalData: mockFlow });
      expect(cursorSetStateMock).toHaveBeenCalledWith({ currentRow: 0 });
    });

    it('エラーが発生した場合はエラーハンドリングを行う', () => {
      // モックの設定
      const showErrorMock = vi.fn();
      const testError = new Error('テストエラー');

      (useFlowStore.getState as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw testError;
      });

      (useErrorStore.getState as ReturnType<typeof vi.fn>).mockReturnValue({
        showError: showErrorMock
      });

      // テスト実行
      newFlowData();

      // 検証
      expect(showErrorMock).toHaveBeenCalled();
    });
  });
});