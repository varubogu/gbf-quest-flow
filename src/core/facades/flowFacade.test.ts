import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MockedFunction } from 'vitest';
import useFlowFacade from './flowFacade';
import useFlowStore from '@/core/stores/flowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import * as fileService from '@/core/services/fileService';
import * as flowService from '@/core/services/flowService';
import type { Flow, Action } from '@/types/models';

// モックの設定
vi.mock('@/core/stores/flowStore', () => {
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
    updateAction: vi.fn(),
    setFlowData: vi.fn()
  };
});

describe('flowFacade', () => {
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

  const mockAction: Action = mockFlow.flow[0]!;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('単体テスト', () => {
    describe('getFlowData', () => {
      it('flowStoreのgetFlowDataを呼び出す', () => {
        // モックの設定
        const getFlowDataMock = vi.fn().mockReturnValue(mockFlow);
        (useFlowStore.getState as any).mockReturnValue({
          getFlowData: getFlowDataMock
        });

        // テスト実行
        const result = useFlowFacade.getState().getFlowData();

        // 検証
        expect(getFlowDataMock).toHaveBeenCalled();
        expect(result).toEqual(mockFlow);
      });
    });

    describe('getActionById', () => {
      it('flowStoreのgetActionByIdを呼び出す', () => {
        // モックの設定
        const getActionByIdMock = vi.fn().mockReturnValue(mockAction);
        (useFlowStore.getState as any).mockReturnValue({
          getActionById: getActionByIdMock
        });

        // テスト実行
        const result = useFlowFacade.getState().getActionById(0);

        // 検証
        expect(getActionByIdMock).toHaveBeenCalledWith(0);
        expect(result).toEqual(mockAction);
      });
    });

    describe('setFlowData', () => {
      it('flowServiceのsetFlowDataを呼び出す', () => {
        // モックの設定
        const setFlowDataMock = vi.fn();
        (flowService.setFlowData as MockedFunction<typeof flowService.setFlowData>) = setFlowDataMock;

        // テスト実行
        useFlowFacade.getState().setFlowData(mockFlow);

        // 検証
        expect(setFlowDataMock).toHaveBeenCalledWith(mockFlow);
      });
    });

    describe('updateFlowData', () => {
      it('flowServiceのupdateFlowDataを呼び出す', () => {
        // モックの設定
        const updateFlowDataMock = vi.fn();
        (flowService.updateFlowData as MockedFunction<typeof flowService.updateFlowData>) = updateFlowDataMock;

        // テスト実行
        const updates = { title: '更新後のタイトル' };
        useFlowFacade.getState().updateFlowData(updates);

        // 検証
        expect(updateFlowDataMock).toHaveBeenCalledWith(updates);
      });
    });

    describe('updateAction', () => {
      it('flowServiceのupdateActionを呼び出す', () => {
        // モックの設定
        const updateActionMock = vi.fn();
        (flowService.updateAction as MockedFunction<typeof flowService.updateAction>) = updateActionMock;

        // テスト実行
        const updates = { note: '更新後のノート' };
        useFlowFacade.getState().updateAction(0, updates);

        // 検証
        expect(updateActionMock).toHaveBeenCalledWith(0, updates);
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
        useFlowFacade.getState().setIsEditMode(true);

        // 検証
        expect(setIsEditModeMock).toHaveBeenCalledWith(true);
      });
    });

    describe('createNewFlow', () => {
      it('fileServiceのnewFlowDataを呼び出す', () => {
        // モックの設定
        const newFlowDataMock = fileService.newFlowData as jest.Mock;

        // テスト実行
        useFlowFacade.getState().createNewFlow();

        // 検証
        expect(newFlowDataMock).toHaveBeenCalled();
      });
    });
  });
});