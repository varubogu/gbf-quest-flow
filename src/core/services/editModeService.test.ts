import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  handleEditModeStart,
  handleEditModeEnd,
  handleCancelEdit,
  setIsEditMode,
  cancelEdit
} from './editModeService';
import type { Flow } from '@/types/models';

// モックの設定
vi.mock('@/core/stores/baseFlowStore', () => {
  const getFlowDataMock = vi.fn();
  const setFlowDataMock = vi.fn();
  const setStateMock = vi.fn();

  return {
    default: {
      getState: vi.fn(() => ({
        getFlowData: getFlowDataMock,
        setFlowData: setFlowDataMock,
        originalData: null
      })),
      setState: setStateMock
    }
  };
});

vi.mock('@/core/stores/editModeStore', () => {
  const setStateMock = vi.fn();

  return {
    default: {
      setState: setStateMock
    }
  };
});

vi.mock('./historyService', () => {
  return {
    clearHistory: vi.fn()
  };
});

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
import useBaseFlowStore from '@/core/stores/baseFlowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import { clearHistory } from './historyService';

describe('editModeService', () => {
  // モックのリセット
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // テスト用のモックデータ
  const mockFlow: Flow = {
    title: 'テストフロー',
    quest: 'テストクエスト',
    author: 'テスト作者',
    flow: [],
    organization: null,
    weapons: [],
    jobs: [],
    summons: [],
    characters: []
  };

  describe('単体テスト', () => {
    describe('handleEditModeStart', () => {
      it('編集モード開始時に現在のデータのコピーを返す', () => {
        const result = handleEditModeStart(mockFlow);

        expect(result.originalData).toEqual(mockFlow);
        expect(result.originalData).not.toBe(mockFlow); // ディープコピーされていることを確認
      });
    });

    describe('handleEditModeEnd', () => {
      it('編集モード終了時に履歴をクリアする', () => {
        const clearHistoryMock = clearHistory as jest.Mock;

        handleEditModeEnd();

        expect(clearHistoryMock).toHaveBeenCalled();
      });
    });

    describe('handleCancelEdit', () => {
      it('編集キャンセル時に元のデータに戻し、編集モードをオフにする', () => {
        // setFlowDataのモックを設定
        const setFlowDataMock = vi.fn();
        (useBaseFlowStore.getState as any).mockReturnValue({
          setFlowData: setFlowDataMock
        });

        const clearHistoryMock = clearHistory as jest.Mock;
        const historyBackMock = window.history.back as jest.Mock;

        const result = handleCancelEdit(mockFlow);

        expect(result.flowData).toEqual(mockFlow);
        expect(result.flowData).not.toBe(mockFlow); // ディープコピーされていることを確認
        expect(result.isEditMode).toBe(false);
        expect(result.originalData).toBeNull();
        expect(clearHistoryMock).toHaveBeenCalled();
        expect(historyBackMock).toHaveBeenCalled();
        expect(setFlowDataMock).toHaveBeenCalledWith(expect.objectContaining(mockFlow));
      });
    });
  });

  describe('結合テスト', () => {
    describe('setIsEditMode', () => {
      it('編集モードをオンにすると、元のデータを保存する', () => {
        // モックの設定
        const getFlowDataMock = vi.fn().mockReturnValue(mockFlow);
        const setStateMock = vi.fn();
        const editModeSetStateMock = vi.fn();

        (useBaseFlowStore.getState as any).mockReturnValue({
          getFlowData: getFlowDataMock
        });
        useBaseFlowStore.setState = setStateMock;
        useEditModeStore.setState = editModeSetStateMock;

        // テスト実行
        setIsEditMode(true);

        // 検証
        expect(getFlowDataMock).toHaveBeenCalled();
        expect(setStateMock).toHaveBeenCalledWith({
          originalData: expect.objectContaining(mockFlow)
        });
        expect(editModeSetStateMock).toHaveBeenCalledWith({ isEditMode: true });
      });

      it('編集モードをオフにすると、履歴をクリアし元のデータをnullにする', () => {
        // モックの設定
        const clearHistoryMock = clearHistory as jest.Mock;
        const setStateMock = vi.fn();
        const editModeSetStateMock = vi.fn();

        useBaseFlowStore.setState = setStateMock;
        useEditModeStore.setState = editModeSetStateMock;

        // テスト実行
        setIsEditMode(false);

        // 検証
        expect(clearHistoryMock).toHaveBeenCalled();
        expect(setStateMock).toHaveBeenCalledWith({ originalData: null });
        expect(editModeSetStateMock).toHaveBeenCalledWith({ isEditMode: false });
      });
    });

    describe('cancelEdit', () => {
      it('元のデータがある場合、編集をキャンセルして元のデータに戻す', () => {
        // モックの設定
        const originalData = { ...mockFlow, title: '元のタイトル' };
        const setFlowDataMock = vi.fn();

        (useBaseFlowStore.getState as any).mockReturnValue({
          originalData,
          setFlowData: setFlowDataMock
        });

        const setStateMock = vi.fn();
        const editModeSetStateMock = vi.fn();

        useBaseFlowStore.setState = setStateMock;
        useEditModeStore.setState = editModeSetStateMock;

        const clearHistoryMock = clearHistory as jest.Mock;
        const historyBackMock = window.history.back as jest.Mock;

        // テスト実行
        cancelEdit();

        // 検証
        expect(clearHistoryMock).toHaveBeenCalled();
        expect(historyBackMock).toHaveBeenCalled();
        expect(setFlowDataMock).toHaveBeenCalledWith(expect.objectContaining(originalData));
        expect(setStateMock).toHaveBeenCalledWith({
          flowData: expect.objectContaining(originalData),
          originalData: null
        });
        expect(editModeSetStateMock).toHaveBeenCalledWith({ isEditMode: false });
      });

      it('元のデータがない場合、何もしない', () => {
        // モックの設定
        (useBaseFlowStore.getState as any).mockReturnValue({
          originalData: null
        });

        const setStateMock = vi.fn();
        const editModeSetStateMock = vi.fn();

        useBaseFlowStore.setState = setStateMock;
        useEditModeStore.setState = editModeSetStateMock;

        // テスト実行
        cancelEdit();

        // 検証
        expect(setStateMock).not.toHaveBeenCalled();
        expect(editModeSetStateMock).not.toHaveBeenCalled();
      });
    });
  });
});