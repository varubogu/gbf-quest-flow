import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  startEditMode,
  finishEditMode,
  cancelEditMode,
  createNewFlow
} from './editModeService';
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
    setState: vi.fn()
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

// flowServiceのモック
vi.mock('@/core/services/flowService', () => ({
  setFlowData: vi.fn()
}));

// グローバルオブジェクトのモック
const originalHistoryBack = window.history.back;
beforeEach(() => {
  window.history.back = vi.fn();
});

// テスト後に元に戻す
afterEach(() => {
  window.history.back = originalHistoryBack;
});

// テスト用のインポート
import useFlowStore from '@/core/stores/flowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import useCursorStore from '@/core/stores/cursorStore';
import { clearHistory } from './historyService';
import { setFlowData } from '@/core/services/flowService';

describe('editModeService', () => {
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
    },
    characters: []
  } as Flow;

  describe('結合テスト', () => {
    describe('startEditMode', () => {
      it('編集モードをオンにすると、元のデータを保存する', () => {
        // モックの設定
        const getFlowDataMock = vi.fn().mockReturnValue(mockFlow);
        const setStateMock = vi.fn();
        const editModeSetStateMock = vi.fn();

        (useFlowStore.getState as ReturnType<typeof vi.fn>).mockReturnValue({
          getFlowData: getFlowDataMock
        });
        useFlowStore.setState = setStateMock;
        useEditModeStore.setState = editModeSetStateMock;

        // テスト実行
        startEditMode(true);

        // 検証
        expect(getFlowDataMock).toHaveBeenCalled();
        expect(setStateMock).toHaveBeenCalledWith({
          originalData: expect.objectContaining(mockFlow)
        });
        expect(editModeSetStateMock).toHaveBeenCalledWith({ isEditMode: true });
      });

      it('編集モードをオフにすると、履歴をクリアし元のデータをnullにする', () => {
        // モックの設定
        const setStateMock = vi.fn();
        const editModeSetStateMock = vi.fn();

        useFlowStore.setState = setStateMock;
        useEditModeStore.setState = editModeSetStateMock;

        // テスト実行
        startEditMode(false);

        // 検証
        expect(clearHistory).toHaveBeenCalled();
        expect(setStateMock).toHaveBeenCalledWith({ originalData: null });
        expect(editModeSetStateMock).toHaveBeenCalledWith({ isEditMode: false });
      });
    });

    describe('finishEditMode', () => {
      it('編集モードを終了し、履歴をクリアして元のデータをnullにする', () => {
        // モックの設定
        const setStateMock = vi.fn();
        const editModeSetStateMock = vi.fn();

        useFlowStore.setState = setStateMock;
        useEditModeStore.setState = editModeSetStateMock;

        // テスト実行
        finishEditMode();

        // 検証
        expect(clearHistory).toHaveBeenCalled();
        expect(setStateMock).toHaveBeenCalledWith({ originalData: null });
        expect(editModeSetStateMock).toHaveBeenCalledWith({ isEditMode: false });
      });
    });

    describe('cancelEditMode', () => {
      it('元のデータがある場合、編集をキャンセルして元のデータに戻す', () => {
        // モックの設定
        const originalData = { ...mockFlow, title: '元のタイトル' };

        (useFlowStore.getState as ReturnType<typeof vi.fn>).mockReturnValue({
          originalData
        });

        const setStateMock = vi.fn();
        const editModeSetStateMock = vi.fn();

        useFlowStore.setState = setStateMock;
        useEditModeStore.setState = editModeSetStateMock;

        // テスト実行
        cancelEditMode();

        // 検証
        expect(clearHistory).toHaveBeenCalled();
        expect(window.history.back).toHaveBeenCalled();
        expect(setFlowData).toHaveBeenCalledWith(expect.objectContaining(originalData));
        expect(setStateMock).toHaveBeenCalledWith({ originalData: null });
        expect(editModeSetStateMock).toHaveBeenCalledWith({ isEditMode: false });
      });

      it('元のデータがない場合、何もしない', () => {
        // モックの設定
        (useFlowStore.getState as ReturnType<typeof vi.fn>).mockReturnValue({
          originalData: null
        });

        const setStateMock = vi.fn();
        const editModeSetStateMock = vi.fn();

        useFlowStore.setState = setStateMock;
        useEditModeStore.setState = editModeSetStateMock;

        // テスト実行
        cancelEditMode();

        // 検証
        expect(setStateMock).not.toHaveBeenCalled();
        expect(editModeSetStateMock).not.toHaveBeenCalled();
      });
    });

    describe('createNewFlow', () => {
      it('新しいフローを作成し、編集モードをオンにする', () => {
        // モックの設定
        const getFlowDataMock = vi.fn().mockReturnValue(mockFlow);
        const setStateMock = vi.fn();
        const editModeSetStateMock = vi.fn();
        const cursorSetStateMock = vi.fn();

        (useFlowStore.getState as ReturnType<typeof vi.fn>).mockReturnValue({
          getFlowData: getFlowDataMock
        });

        useFlowStore.setState = setStateMock;
        useEditModeStore.setState = editModeSetStateMock;
        useCursorStore.setState = cursorSetStateMock;

        // テスト実行
        createNewFlow();

        // 検証
        expect(editModeSetStateMock).toHaveBeenCalledWith({ isEditMode: true });
        expect(setFlowData).toHaveBeenCalled();
        expect(setStateMock).toHaveBeenCalledWith({ originalData: mockFlow });
        expect(cursorSetStateMock).toHaveBeenCalledWith({ currentRow: 0 });
      });
    });
  });
});