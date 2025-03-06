import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import type { Flow, Organization } from '@/types/models';
import {
  handleDataUpdate,
  mergeActionWithUpdates,
  updateFlowWithAction,
  handleError,
  updateFlowData,
  updateAction,
  setFlowData
} from './flowService';
import useFlowStore from '@/core/stores/flowStore';
import * as historyService from '@/core/services/historyService';
import { errorFacade } from '@/core/facades/errorFacade';

// モックの設定
vi.mock('@/core/stores/flowStore', () => {
  const getFlowDataMock = vi.fn();
  const setFlowDataMock = vi.fn();

  return {
    default: {
      getState: vi.fn(() => ({
        getFlowData: getFlowDataMock,
        setFlowData: setFlowDataMock
      }))
    }
  };
});

vi.mock('@/core/services/historyService', () => {
  return {
    pushToHistory: vi.fn(),
    clearHistory: vi.fn()
  };
});

// errorFacadeのモック
vi.mock('@/core/facades/errorFacade', () => ({
  errorFacade: {
    showValidationError: vi.fn(),
    showUnknownError: vi.fn()
  }
}));

describe('flowService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('handleDataUpdate', () => {
    it('現在のデータと更新内容を正しくマージする', () => {
      const currentData = flowData();

      const updates = {
        title: '更新後のタイトル'
      };

      const result = handleDataUpdate(currentData as Flow, updates);

      expect(result.newData).toEqual({
        ...currentData,
        ...updates
      });
      expect(result.shouldUpdate).toBe(true);
    });

    it('データに変更がない場合はshouldUpdateがfalseになる', () => {
      const currentData = flowData();

      const updates = {
        title: 'テストフロー' // 変更なし
      };

      const result = handleDataUpdate(currentData as Flow, updates);

      expect(result.shouldUpdate).toBe(false);
    });
  });

  describe('mergeActionWithUpdates', () => {
    it('既存のアクションと更新内容を正しくマージする', () => {
      const existingAction = {
        hp: '100%',
        action: 'テストアクション'
      };

      const updates = {
        note: '更新されたノート'
      };

      const result = mergeActionWithUpdates(existingAction, updates);

      expect(result).toEqual({
        hp: '100%',
        prediction: '',
        charge: '',
        guard: '',
        action: 'テストアクション',
        note: '更新されたノート'
      });
    });

    it('既存のアクションがundefinedの場合でも正しくマージする', () => {
      const updates = {
        note: '新しいノート'
      };

      const result = mergeActionWithUpdates(undefined, updates);

      expect(result).toEqual({
        hp: '',
        prediction: '',
        charge: '',
        guard: '',
        action: '',
        note: '新しいノート'
      });
    });
  });

  describe('updateFlowWithAction', () => {
    it('指定されたインデックスのアクションを更新する', () => {
      const currentData = flowData();
      currentData.flow = [
        { hp: '100%', action: 'アクション1', note: 'ノート1', prediction: '', charge: '', guard: '' },
        { hp: '80%', action: 'アクション2', note: 'ノート2', prediction: '', charge: '', guard: '' }
      ];

      const updates = {
        note: '更新されたノート'
      };

      const result = updateFlowWithAction(currentData as Flow, 1, updates);

      expect(result.flow[1]).toEqual({
        hp: '80%',
        action: 'アクション2',
        note: '更新されたノート',
        prediction: '',
        charge: '',
        guard: ''
      });
    });
  });

  describe('handleError', () => {
    it('Errorオブジェクトをそのまま渡す', () => {
      const error = new Error('テストエラー');
      handleError(error, 'デフォルトメッセージ');

      expect(errorFacade.showUnknownError).toHaveBeenCalledWith(error);
    });

    it('Errorでないオブジェクトの場合はデフォルトメッセージでErrorを作成する', () => {
      const error = { message: 'エラーメッセージ' };
      const defaultMessage = 'デフォルトメッセージ';
      handleError(error, defaultMessage);

      expect(errorFacade.showValidationError).toHaveBeenCalledWith(defaultMessage);
    });
  });

  describe('setFlowData', () => {
    it('flowStoreのsetFlowDataを呼び出す', () => {
      const setFlowDataMock = vi.fn();
      (useFlowStore.getState as unknown as Mock).mockReturnValue({
        setFlowData: setFlowDataMock
      });

      const mockFlow = flowData();

      setFlowData(mockFlow as Flow);

      expect(setFlowDataMock).toHaveBeenCalledWith(mockFlow);
      expect(historyService.clearHistory).toHaveBeenCalled();
    });
  });

  describe('updateFlowData', () => {
    it('フローデータを更新し、編集履歴に追加する', () => {
      // モックの設定
      const mockFlow = flowData();

      const getFlowDataMock = vi.fn().mockReturnValue(mockFlow);
      const setFlowDataMock = vi.fn();

      (useFlowStore.getState as unknown as Mock).mockReturnValue({
        getFlowData: getFlowDataMock,
        setFlowData: setFlowDataMock
      });

      // テスト実行
      const updates = { title: '更新後のタイトル' };
      updateFlowData(updates);

      // 検証
      expect(getFlowDataMock).toHaveBeenCalled();
      expect(setFlowDataMock).toHaveBeenCalledWith({
        ...mockFlow,
        title: '更新後のタイトル'
      });
      expect(historyService.pushToHistory).toHaveBeenCalledWith({
        ...mockFlow,
        title: '更新後のタイトル'
      });
    });

    it('データに変更がない場合は何もしない', () => {
      // モックの設定
      const mockFlow = flowData();

      const getFlowDataMock = vi.fn().mockReturnValue(mockFlow);
      const setFlowDataMock = vi.fn();

      (useFlowStore.getState as unknown as Mock).mockReturnValue({
        getFlowData: getFlowDataMock,
        setFlowData: setFlowDataMock
      });

      // テスト実行
      const updates = { title: 'テストフロー' }; // 変更なし
      updateFlowData(updates);

      // 検証
      expect(getFlowDataMock).toHaveBeenCalled();
      expect(setFlowDataMock).not.toHaveBeenCalled();
      expect(historyService.pushToHistory).not.toHaveBeenCalled();
    });

    it('エラーが発生した場合はエラーハンドリング関数を呼び出す', () => {
      // モックの設定
      const getFlowDataMock = vi.fn().mockImplementation(() => {
        throw new Error('テストエラー');
      });

      (useFlowStore.getState as unknown as Mock).mockReturnValue({
        getFlowData: getFlowDataMock
      });

      // テスト実行
      const updates = { title: '更新後のタイトル' };
      updateFlowData(updates);

      // 検証
      expect(getFlowDataMock).toHaveBeenCalled();
      expect(errorFacade.showUnknownError).toHaveBeenCalled();
    });
  });

  describe('updateAction', () => {
    it('指定されたインデックスのアクションを更新し、編集履歴に追加する', () => {
      // モックの設定
      const mockFlow = flowData();
      mockFlow.flow = [
        {
          hp: '100%',
          prediction: 'テスト予測',
          charge: '100%',
          guard: 'なし',
          action: 'テストアクション',
          note: 'テストノート'
        }
      ];

      const getFlowDataMock = vi.fn().mockReturnValue(mockFlow);
      const setFlowDataMock = vi.fn();

      (useFlowStore.getState as unknown as Mock).mockReturnValue({
        getFlowData: getFlowDataMock,
        setFlowData: setFlowDataMock
      });

      // テスト実行
      const updates = { note: '更新後のノート' };
      updateAction(0, updates);

      // 検証
      const expectedUpdatedFlow = {
        ...mockFlow,
        flow: [
          {
            hp: '100%',
            prediction: 'テスト予測',
            charge: '100%',
            guard: 'なし',
            action: 'テストアクション',
            note: '更新後のノート'
          }
        ]
      };

      expect(getFlowDataMock).toHaveBeenCalled();
      expect(setFlowDataMock).toHaveBeenCalledWith(expectedUpdatedFlow);
      expect(historyService.pushToHistory).toHaveBeenCalledWith(expectedUpdatedFlow);
    });

    it('エラーが発生した場合はエラーハンドリング関数を呼び出す', () => {
      // モックの設定
      const getFlowDataMock = vi.fn().mockImplementation(() => {
        throw new Error('テストエラー');
      });

      (useFlowStore.getState as unknown as Mock).mockReturnValue({
        getFlowData: getFlowDataMock
      });

      // テスト実行
      const updates = { note: '更新後のノート' };
      updateAction(0, updates);

      // 検証
      expect(getFlowDataMock).toHaveBeenCalled();
      expect(errorFacade.showUnknownError).toHaveBeenCalled();
    });
  });
});

function flowData(): Partial<Flow> {
  return {
    title: 'テストフロー',
    quest: 'テストクエスト',
    author: 'テスト作者',
    description: 'テスト説明',
    updateDate: '2023-01-01',
    note: 'テスト備考',
    always: 'テスト常時効果',
    flow: [],
    organization: {} as Organization,
  };
}
