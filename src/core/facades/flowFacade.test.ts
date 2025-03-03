import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock, MockedFunction } from 'vitest';
import { setFlowData, updateFlowData, updateAction, setIsEditMode, createNewFlow } from './flowFacade';
import * as editModeService from '@/core/services/editModeService';
import * as fileService from '@/core/services/fileService';
import * as flowService from '@/core/services/flowService';
import type { Flow } from '@/types/models';

vi.mock('@/core/services/editModeService', () => {
  return {
    setIsEditMode: vi.fn()
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('単体テスト', () => {

    describe('setFlowData', () => {
      it('flowServiceのsetFlowDataを呼び出す', () => {
        // モックの設定
        const setFlowDataMock = vi.fn();
        (flowService.setFlowData as MockedFunction<typeof flowService.setFlowData>) = setFlowDataMock;

        // テスト実行
        setFlowData(mockFlow);

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
        updateFlowData(updates);

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
        updateAction(0, updates);

        // 検証
        expect(updateActionMock).toHaveBeenCalledWith(0, updates);
      });
    });

    describe('setIsEditMode', () => {
      it('editModeServiceのsetIsEditModeを呼び出す', () => {
        // モックの設定
        const setIsEditModeMock = vi.fn();
        (editModeService.setIsEditMode as MockedFunction<typeof editModeService.setIsEditMode>) = setIsEditModeMock;

        // テスト実行
        setIsEditMode(true);

        // 検証
        expect(setIsEditModeMock).toHaveBeenCalledWith(true);
      });
    });

    describe('createNewFlow', () => {
      it('fileServiceのnewFlowDataを呼び出す', () => {
        // モックの設定
        const newFlowDataMock = fileService.newFlowData as Mock;

        // テスト実行
        createNewFlow();

        // 検証
        expect(newFlowDataMock).toHaveBeenCalled();
      });
    });
  });
});