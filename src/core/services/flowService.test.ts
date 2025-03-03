import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import {
  handleDataUpdate,
  mergeActionWithUpdates,
  updateFlowWithAction,
  handleError,
  syncWithBaseFlowStore,
  updateFlowData,
  updateAction
} from './flowService';
import type { Flow, Action } from '@/types/models';
import useBaseFlowStore from '@/core/stores/baseFlowStore';
import useErrorStore from '@/core/stores/errorStore';
import * as historyService from './historyService';

// モックの設定
vi.mock('@/core/stores/baseFlowStore', () => {
  const getFlowDataMock = vi.fn();
  const setFlowDataMock = vi.fn();
  const _updateStateMock = vi.fn();

  return {
    default: {
      getState: vi.fn(() => ({
        getFlowData: getFlowDataMock,
        setFlowData: setFlowDataMock,
        _updateState: _updateStateMock
      }))
    }
  };
});

vi.mock('@/core/stores/errorStore', () => {
  const showErrorMock = vi.fn();

  return {
    default: {
      getState: vi.fn(() => ({
        showError: showErrorMock
      }))
    }
  };
});

vi.mock('./historyService', () => {
  return {
    pushToHistory: vi.fn()
  };
});

describe('flowService', () => {
  // テスト用のデータ
  const mockAction: Action = {
    hp: '100',
    prediction: 'テスト予兆',
    charge: '◯',
    guard: '×',
    action: 'テストアクション',
    note: 'テストノート'
  };

  const mockFlow: Flow = {
    title: 'テストフロー',
    quest: 'テストクエスト',
    author: 'テスト作者',
    description: 'テスト説明',
    updateDate: '2023-01-01',
    note: 'テスト備考',
    organization: {} as any, // テスト用に型だけ合わせる
    always: 'テスト常時効果',
    flow: [mockAction]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('単体テスト', () => {
    describe('handleDataUpdate', () => {
      it('現在のデータと更新内容を正しくマージする', () => {
        const currentData = {
          title: 'テストフロー',
          quest: 'テストクエスト',
          author: 'テスト作者',
          flow: [],
          organization: null,
          weapons: [],
          jobs: [],
          summons: [],
          characters: []
        } as Flow;

        const updates = {
          title: '更新後のタイトル'
        };

        const result = handleDataUpdate(currentData, updates);

        expect(result.newData).toEqual({
          ...currentData,
          ...updates
        });
        expect(result.shouldUpdate).toBe(true);
      });

      it('データに変更がない場合はshouldUpdateがfalseになる', () => {
        const currentData = {
          title: 'テストフロー',
          quest: 'テストクエスト',
          author: 'テスト作者',
          flow: [],
          organization: null,
          weapons: [],
          jobs: [],
          summons: [],
          characters: []
        } as Flow;

        const updates = {
          title: 'テストフロー' // 変更なし
        };

        const result = handleDataUpdate(currentData, updates);

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
        const currentData = {
          title: 'テストフロー',
          quest: 'テストクエスト',
          author: 'テスト作者',
          flow: [
            { hp: '100%', action: 'アクション1', note: 'ノート1', prediction: '', charge: '', guard: '' },
            { hp: '80%', action: 'アクション2', note: 'ノート2', prediction: '', charge: '', guard: '' }
          ],
          organization: null,
          weapons: [],
          jobs: [],
          summons: [],
          characters: []
        } as Flow;

        const updates = {
          note: '更新されたノート'
        };

        const result = updateFlowWithAction(currentData, 1, updates);

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
        const showErrorMock = vi.fn();
        (useErrorStore.getState as any).mockReturnValue({
          showError: showErrorMock
        });

        const error = new Error('テストエラー');
        handleError(error, 'デフォルトメッセージ');

        expect(showErrorMock).toHaveBeenCalledWith(error);
      });

      it('Errorでないオブジェクトの場合はデフォルトメッセージでErrorを作成する', () => {
        const showErrorMock = vi.fn();
        (useErrorStore.getState as any).mockReturnValue({
          showError: showErrorMock
        });

        const error = { message: 'エラーメッセージ' };
        const defaultMessage = 'デフォルトメッセージ';
        handleError(error, defaultMessage);

        expect(showErrorMock).toHaveBeenCalledWith(new Error(defaultMessage));
      });
    });

    describe('syncWithBaseFlowStore', () => {
      it('baseFlowStoreのsetFlowDataを呼び出す', () => {
        const setFlowDataMock = vi.fn();
        (useBaseFlowStore.getState as any).mockReturnValue({
          setFlowData: setFlowDataMock
        });

        const mockFlow = {
          title: 'テストフロー',
          quest: 'テストクエスト',
          author: 'テスト作者',
          flow: [],
          organization: null,
          weapons: [],
          jobs: [],
          summons: [],
          characters: []
        } as Flow;

        syncWithBaseFlowStore(mockFlow);

        expect(setFlowDataMock).toHaveBeenCalledWith(mockFlow);
      });
    });
  });

  describe('結合テスト', () => {
    describe('updateFlowData', () => {
      it('フローデータを更新し、編集モード中は履歴に追加する', () => {
        // モックの設定
        const getFlowDataMock = vi.fn().mockReturnValue({
          title: 'テストフロー',
          quest: 'テストクエスト',
          author: 'テスト作者',
          flow: [],
          organization: null,
          weapons: [],
          jobs: [],
          summons: [],
          characters: []
        });
        const setFlowDataMock = vi.fn();

        (useBaseFlowStore.getState as any).mockReturnValue({
          getFlowData: getFlowDataMock,
          setFlowData: setFlowDataMock
        });

        const pushToHistoryMock = historyService.pushToHistory as Mock;

        // テスト実行
        const mockFlow = {
          title: 'テストフロー',
          quest: 'テストクエスト',
          author: 'テスト作者',
          flow: [],
          organization: null,
          weapons: [],
          jobs: [],
          summons: [],
          characters: []
        } as Flow;

        const updates = { title: '更新後のタイトル' };
        updateFlowData(updates, true);

        // 検証
        expect(getFlowDataMock).toHaveBeenCalled();
        expect(setFlowDataMock).toHaveBeenCalledWith({
          ...mockFlow,
          title: '更新後のタイトル'
        });
        expect(pushToHistoryMock).toHaveBeenCalledWith({
          ...mockFlow,
          title: '更新後のタイトル'
        });
      });

      it('編集モードでない場合は履歴に追加しない', () => {
        // モックの設定
        const getFlowDataMock = vi.fn().mockReturnValue({
          title: 'テストフロー',
          quest: 'テストクエスト',
          author: 'テスト作者',
          flow: [],
          organization: null,
          weapons: [],
          jobs: [],
          summons: [],
          characters: []
        });
        const setFlowDataMock = vi.fn();

        (useBaseFlowStore.getState as any).mockReturnValue({
          getFlowData: getFlowDataMock,
          setFlowData: setFlowDataMock
        });

        const pushToHistoryMock = historyService.pushToHistory as Mock;

        // テスト実行
        const mockFlow = {
          title: 'テストフロー',
          quest: 'テストクエスト',
          author: 'テスト作者',
          flow: [],
          organization: null,
          weapons: [],
          jobs: [],
          summons: [],
          characters: []
        } as Flow;

        const updates = { title: '更新後のタイトル' };
        updateFlowData(updates, false);

        // 検証
        expect(getFlowDataMock).toHaveBeenCalled();
        expect(setFlowDataMock).toHaveBeenCalledWith({
          ...mockFlow,
          title: '更新後のタイトル'
        });
        expect(pushToHistoryMock).not.toHaveBeenCalled();
      });

      it('データに変更がない場合は何もしない', () => {
        // モックの設定
        const getFlowDataMock = vi.fn().mockReturnValue({
          title: 'テストフロー',
          quest: 'テストクエスト',
          author: 'テスト作者',
          flow: [],
          organization: null,
          weapons: [],
          jobs: [],
          summons: [],
          characters: []
        });
        const _updateStateMock = vi.fn();

        (useBaseFlowStore.getState as any).mockReturnValue({
          getFlowData: getFlowDataMock,
          _updateState: _updateStateMock
        });

        // テスト実行
        const updates = { title: 'テストフロー' }; // 変更なし
        updateFlowData(updates, true);

        // 検証
        expect(getFlowDataMock).toHaveBeenCalled();
        expect(_updateStateMock).not.toHaveBeenCalled();
      });

      it('エラーが発生した場合はエラーストアに通知する', () => {
        // モックの設定
        const getFlowDataMock = vi.fn().mockImplementation(() => {
          throw new Error('テストエラー');
        });

        (useBaseFlowStore.getState as any).mockReturnValue({
          getFlowData: getFlowDataMock
        });

        const showErrorMock = vi.fn();
        (useErrorStore.getState as any).mockReturnValue({
          showError: showErrorMock
        });

        // テスト実行
        const updates = { title: '更新後のタイトル' };
        updateFlowData(updates, true);

        // 検証
        expect(getFlowDataMock).toHaveBeenCalled();
        expect(showErrorMock).toHaveBeenCalled();
      });
    });

    describe('updateAction', () => {
      it('指定されたインデックスのアクションを更新し、編集モード中は履歴に追加する', () => {
        // モックの設定
        const mockFlow = {
          title: 'テストフロー',
          quest: 'テストクエスト',
          author: 'テスト作者',
          flow: [
            {
              hp: '100%',
              prediction: 'テスト予測',
              charge: '100%',
              guard: 'なし',
              action: 'テストアクション',
              note: 'テストノート'
            }
          ],
          organization: null,
          weapons: [],
          jobs: [],
          summons: [],
          characters: []
        } as Flow;

        const getFlowDataMock = vi.fn().mockReturnValue(mockFlow);
        const setFlowDataMock = vi.fn();

        (useBaseFlowStore.getState as any).mockReturnValue({
          getFlowData: getFlowDataMock,
          setFlowData: setFlowDataMock
        });

        const pushToHistoryMock = historyService.pushToHistory as Mock;

        // テスト実行
        const updates = { note: '更新後のノート' };
        updateAction(0, updates, true);

        // 検証
        expect(getFlowDataMock).toHaveBeenCalled();
        expect(setFlowDataMock).toHaveBeenCalled();
        expect(pushToHistoryMock).toHaveBeenCalled();
      });

      it('編集モードでない場合は履歴に追加しない', () => {
        // モックの設定
        const mockFlow = {
          title: 'テストフロー',
          quest: 'テストクエスト',
          author: 'テスト作者',
          flow: [
            {
              hp: '100%',
              prediction: 'テスト予測',
              charge: '100%',
              guard: 'なし',
              action: 'テストアクション',
              note: 'テストノート'
            }
          ],
          organization: null,
          weapons: [],
          jobs: [],
          summons: [],
          characters: []
        } as Flow;

        const getFlowDataMock = vi.fn().mockReturnValue(mockFlow);
        const setFlowDataMock = vi.fn();

        (useBaseFlowStore.getState as any).mockReturnValue({
          getFlowData: getFlowDataMock,
          setFlowData: setFlowDataMock
        });

        const pushToHistoryMock = historyService.pushToHistory as Mock;

        // テスト実行
        const updates = { note: '更新後のノート' };
        updateAction(0, updates, false);

        // 検証
        expect(getFlowDataMock).toHaveBeenCalled();
        expect(setFlowDataMock).toHaveBeenCalled();
        expect(pushToHistoryMock).not.toHaveBeenCalled();
      });

      it('エラーが発生した場合はエラーストアに通知する', () => {
        // モックの設定
        const getFlowDataMock = vi.fn().mockImplementation(() => {
          throw new Error('テストエラー');
        });

        (useBaseFlowStore.getState as any).mockReturnValue({
          getFlowData: getFlowDataMock
        });

        const showErrorMock = vi.fn();
        (useErrorStore.getState as any).mockReturnValue({
          showError: showErrorMock
        });

        // テスト実行
        const updates = { note: '更新後のノート' };
        updateAction(0, updates, true);

        // 検証
        expect(getFlowDataMock).toHaveBeenCalled();
        expect(showErrorMock).toHaveBeenCalled();
      });
    });
  });
});