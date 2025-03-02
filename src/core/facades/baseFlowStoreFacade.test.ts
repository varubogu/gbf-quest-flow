import { describe, it, expect, vi, beforeEach } from 'vitest';
import useBaseFlowStoreFacade from './baseFlowStoreFacade';
import useBaseFlowStore from '@/core/stores/baseFlowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import * as fileService from '@/core/services/fileService';
import * as flowService from '@/core/services/flowService';
import type { Flow, Action } from '@/types/models';

// モックの設定
vi.mock('@/core/stores/baseFlowStore', () => {
  const getFlowDataMock = vi.fn();
  const getActionByIdMock = vi.fn();
  const setFlowDataMock = vi.fn();
  const updateFlowDataMock = vi.fn();
  const updateActionMock = vi.fn();

  return {
    default: {
      getState: vi.fn(() => ({
        getFlowData: getFlowDataMock,
        getActionById: getActionByIdMock,
        setFlowData: setFlowDataMock,
        updateFlowData: updateFlowDataMock,
        updateAction: updateActionMock,
        flowData: null,
        originalData: null
      })),
      setState: vi.fn(),
      subscribe: vi.fn(() => vi.fn()) // unsubscribe関数を返す
    }
  };
});

vi.mock('@/core/stores/editModeStore', () => {
  const setIsEditModeMock = vi.fn();

  return {
    default: {
      getState: vi.fn(() => ({
        setIsEditMode: setIsEditModeMock,
        isEditMode: false
      })),
      setState: vi.fn(),
      subscribe: vi.fn(() => vi.fn()) // unsubscribe関数を返す
    }
  };
});

vi.mock('@/core/services/fileService', () => {
  return {
    newFlowData: vi.fn()
  };
});

vi.mock('@/core/services/flowService', () => {
  return {
    updateFlowData: vi.fn(),
    updateAction: vi.fn()
  };
});

describe('baseFlowStoreFacade', () => {
  // テスト用のモックデータ
  const mockFlow: Flow = {
    title: 'テストフロー',
    quest: 'テストクエスト',
    author: 'テスト作者',
    description: 'テスト説明',
    updateDate: '2023-01-01',
    note: 'テストノート',
    organization: {} as any, // テスト用に型だけ合わせる
    always: 'テスト常時効果',
    flow: [
      {
        hp: '100%',
        prediction: 'テスト予兆',
        charge: '◯',
        guard: '×',
        action: 'テストアクション',
        note: 'テストノート'
      }
    ]
  };

  const mockAction: Action = mockFlow.flow[0];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('単体テスト', () => {
    describe('getFlowData', () => {
      it('baseFlowStoreのgetFlowDataを呼び出す', () => {
        // モックの設定
        const getFlowDataMock = vi.fn().mockReturnValue(mockFlow);
        (useBaseFlowStore.getState as any).mockReturnValue({
          getFlowData: getFlowDataMock
        });

        // テスト実行
        const result = useBaseFlowStoreFacade.getState().getFlowData();

        // 検証
        expect(getFlowDataMock).toHaveBeenCalled();
        expect(result).toEqual(mockFlow);
      });
    });

    describe('getActionById', () => {
      it('baseFlowStoreのgetActionByIdを呼び出す', () => {
        // モックの設定
        const getActionByIdMock = vi.fn().mockReturnValue(mockAction);
        (useBaseFlowStore.getState as any).mockReturnValue({
          getActionById: getActionByIdMock
        });

        // テスト実行
        const result = useBaseFlowStoreFacade.getState().getActionById(0);

        // 検証
        expect(getActionByIdMock).toHaveBeenCalledWith(0);
        expect(result).toEqual(mockAction);
      });
    });

    describe('setFlowData', () => {
      it('baseFlowStoreのsetFlowDataを呼び出す', () => {
        // モックの設定
        const setFlowDataMock = vi.fn();
        (useBaseFlowStore.getState as any).mockReturnValue({
          setFlowData: setFlowDataMock
        });

        // テスト実行
        useBaseFlowStoreFacade.getState().setFlowData(mockFlow);

        // 検証
        expect(setFlowDataMock).toHaveBeenCalledWith(mockFlow);
      });
    });

    describe('updateFlowData', () => {
      it('flowServiceのupdateFlowDataを呼び出す', () => {
        // モックの設定
        const updateFlowDataMock = vi.fn();
        (flowService.updateFlowData as any) = updateFlowDataMock;

        // EditModeStoreのモック
        (useEditModeStore.getState as any).mockReturnValue({
          isEditMode: true
        });

        // テスト実行
        const updates = { title: '更新後のタイトル' };
        useBaseFlowStoreFacade.getState().updateFlowData(updates);

        // 検証
        expect(updateFlowDataMock).toHaveBeenCalledWith(updates, true);
      });
    });

    describe('updateAction', () => {
      it('flowServiceのupdateActionを呼び出す', () => {
        // モックの設定
        const updateActionMock = vi.fn();
        (flowService.updateAction as any) = updateActionMock;

        // EditModeStoreのモック
        (useEditModeStore.getState as any).mockReturnValue({
          isEditMode: false
        });

        // テスト実行
        const updates = { note: '更新後のノート' };
        useBaseFlowStoreFacade.getState().updateAction(0, updates);

        // 検証
        expect(updateActionMock).toHaveBeenCalledWith(0, updates, false);
      });
    });

    describe('setIsEditMode', () => {
      it('editModeStoreのsetIsEditModeを呼び出す', () => {
        // モックの設定
        const setIsEditModeMock = vi.fn();
        (useEditModeStore.getState as any).mockReturnValue({
          setIsEditMode: setIsEditModeMock
        });

        // テスト実行
        useBaseFlowStoreFacade.getState().setIsEditMode(true);

        // 検証
        expect(setIsEditModeMock).toHaveBeenCalledWith(true);
      });
    });

    describe('createNewFlow', () => {
      it('fileServiceのnewFlowDataを呼び出す', () => {
        // モックの設定
        const newFlowDataMock = fileService.newFlowData as jest.Mock;

        // テスト実行
        useBaseFlowStoreFacade.getState().createNewFlow();

        // 検証
        expect(newFlowDataMock).toHaveBeenCalled();
      });
    });
  });
});