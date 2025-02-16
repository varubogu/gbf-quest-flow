import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import useFlowStore from './flowStore';
import organizationSettings from '@/content/settings/organization.json';

// テストの並列実行を無効化
describe.sequential('FlowStore', () => {
  // テストごとにストアを初期化
  beforeEach(() => {
    const store = useFlowStore.getState();
    // 各メソッドを使用して状態をリセット
    store.setFlowData(null);
    store.setIsEditMode(false);
    store.clearHistory();
    store.setCurrentRow(0);
  });

  afterEach(() => {
    // テスト後にストアをクリーンアップ
    const store = useFlowStore.getState();
    store.setFlowData(null);
    store.setIsEditMode(false);
  });

  describe('createNewFlow', () => {
    it('新しい空のフローを作成する', async () => {
      // 初期状態の確認
      const initialStore = useFlowStore.getState();
      expect(initialStore.flowData).toBeNull();

      // createNewFlowを実行
      initialStore.createNewFlow();

      // 状態の更新を待つ
      await vi.waitFor(() => {
        const currentState = useFlowStore.getState();
        return currentState.isEditMode === true && currentState.flowData !== null;
      });

      // 更新後の状態を新しく取得
      const updatedStore = useFlowStore.getState();

      // 状態のチェック
      expect(updatedStore.flowData, 'createNewFlow後もflowDataがnullです').toBeTruthy();
      expect(updatedStore.isEditMode, '編集モードがtrueになっていません').toBe(true);
      expect(updatedStore.currentRow, 'currentRowが0ではありません').toBe(0);
      expect(updatedStore.history.past, '履歴が空ではありません').toHaveLength(0);
      expect(updatedStore.history.future, '未来の履歴が空ではありません').toHaveLength(0);

      // flowDataの内容チェック
      const flowData = updatedStore.flowData;
      if (flowData) {
        expect(flowData).toMatchObject({
          title: '新しいフロー',
          quest: '',
          author: '',
          description: '',
          note: '',
        });

        expect(flowData.organization.member.front).toHaveLength(organizationSettings.member.front);
        expect(flowData.organization.member.back).toHaveLength(organizationSettings.member.back);
      }
    });

    it('createNewFlow後のストアの状態が正しい', async () => {
      const store = useFlowStore.getState();
      store.createNewFlow();

      // 状態の更新を待つ
      await vi.waitFor(() => {
        const currentState = useFlowStore.getState();
        return currentState.isEditMode === true && currentState.flowData !== null;
      });

      const updatedStore = useFlowStore.getState();

      // 基本的な状態チェック
      expect(updatedStore.currentRow).toBe(0);
      expect(updatedStore.isEditMode, 'isEditModeがtrueになっていません').toBe(true);
      expect(updatedStore.history.past).toHaveLength(0);
      expect(updatedStore.history.future).toHaveLength(0);

      // flowDataの必須フィールドチェック
      expect(updatedStore.flowData).toMatchObject({
        title: '新しいフロー',
        quest: '',
        author: '',
        description: '',
        note: '',
      });
    });
  });

  describe('setIsEditMode', () => {
    it('編集モードを切り替える', async () => {
      const store = useFlowStore.getState();
      store.createNewFlow();

      // createNewFlowの完了を待つ
      await vi.waitFor(() => {
        const state = useFlowStore.getState();
        return state.flowData !== null;
      });

      store.setIsEditMode(true);

      // 編集モードの変更を待つ
      await vi.waitFor(() => {
        const state = useFlowStore.getState();
        return state.isEditMode === true && state.originalData !== null;
      });

      const stateAfterEdit = useFlowStore.getState();
      expect(stateAfterEdit.isEditMode).toBe(true);
      expect(stateAfterEdit.originalData).not.toBeNull();

      store.setIsEditMode(false);

      // 編集モードの解除を待つ
      await vi.waitFor(() => {
        const state = useFlowStore.getState();
        return state.isEditMode === false && state.originalData === null;
      });

      const finalState = useFlowStore.getState();
      expect(finalState.isEditMode).toBe(false);
      expect(finalState.originalData).toBeNull();
      expect(finalState.history.past).toHaveLength(0);
      expect(finalState.history.future).toHaveLength(0);
    });
  });

  describe('updateFlowData', () => {
    it('フローデータを部分的に更新する', async () => {
      const store = useFlowStore.getState();
      store.createNewFlow();

      // createNewFlowの完了を待つ
      await vi.waitFor(() => {
        const state = useFlowStore.getState();
        return state.flowData !== null;
      });

      store.updateFlowData({
        title: 'Updated Title',
        description: 'Test Description',
      });

      // データの更新を待つ
      await vi.waitFor(() => {
        const state = useFlowStore.getState();
        return state.flowData?.title === 'Updated Title';
      });

      const updatedStore = useFlowStore.getState();
      expect(updatedStore.flowData?.title).toBe('Updated Title');
      expect(updatedStore.flowData?.description).toBe('Test Description');
    });
  });

  describe('履歴管理', () => {
    it('アンドゥとリドゥが正しく動作する', async () => {
      const initialTitle = '変更前のタイトル';
      const updatedTitle = '変更後のタイトル';

      const store = useFlowStore.getState();
      store.createNewFlow();

      // createNewFlowの完了を待つ
      await vi.waitFor(
        () => {
          const state = useFlowStore.getState();
          return state.flowData !== null;
        },
        { timeout: 10000 }
      );

      store.setIsEditMode(true);

      // 編集モードの変更を待つ
      await vi.waitFor(
        () => {
          const state = useFlowStore.getState();
          return state.isEditMode === true;
        },
        { timeout: 10000 }
      );

      // 最初の状態を確認
      const stateBeforeUpdate = useFlowStore.getState();

      store.updateFlowData({ title: initialTitle });

      // 最初の更新を待つ
      await vi.waitFor(
        () => {
          const state = useFlowStore.getState();

          return state.flowData?.title === initialTitle;
        },
        { timeout: 10000 }
      );

      // 最初の更新後の状態を確認
      const stateAfterFirstUpdate = useFlowStore.getState();

      // 変更を加える
      store.updateFlowData({ title: updatedTitle });

      // 2回目の更新を待つ
      await vi.waitFor(
        () => {
          const state = useFlowStore.getState();

          return state.flowData?.title === updatedTitle && state.history.past.length === 1;
        },
        { timeout: 10000 }
      );

      // 2回目の更新後の状態を確認
      const stateAfterSecondUpdate = useFlowStore.getState();

      // アンドゥ
      store.undo();

      // アンドゥの完了を待つ
      await vi.waitFor(
        () => {
          const state = useFlowStore.getState();

          return state.flowData?.title === initialTitle && state.history.future.length === 1;
        },
        { timeout: 10000 }
      );

      // アンドゥ後の状態を取得して確認
      const stateAfterUndo = useFlowStore.getState();

      expect(stateAfterUndo.flowData?.title).toBe(initialTitle);
      expect(stateAfterUndo.history.past).toHaveLength(1);
      expect(stateAfterUndo.history.future).toHaveLength(1);

      // リドゥ
      store.redo();

      // リドゥの完了を待つ
      await vi.waitFor(
        () => {
          const state = useFlowStore.getState();
          return state.flowData?.title === updatedTitle;
        },
        { timeout: 10000 }
      );

      // リドゥ後の状態を取得して確認
      const stateAfterRedo = useFlowStore.getState();

      expect(stateAfterRedo.flowData?.title).toBe(updatedTitle);
      expect(stateAfterRedo.history.past).toHaveLength(2);
      expect(stateAfterRedo.history.future).toHaveLength(0);
    });

    it('複数段階のアンドゥとリドゥが正しく動作する', async () => {
      const titles = ['最初のタイトル', '2番目のタイトル', '3番目のタイトル'];
      const store = useFlowStore.getState();

      // フローを作成して編集モードに
      store.createNewFlow();
      await vi.waitFor(
        () => {
          const state = useFlowStore.getState();
          return state.flowData !== null;
        },
        { timeout: 10000 }
      );

      store.setIsEditMode(true);
      await vi.waitFor(
        () => {
          const state = useFlowStore.getState();
          return state.isEditMode === true;
        },
        { timeout: 10000 }
      );

      // 3段階の変更を加える
      for (const title of titles) {
        store.updateFlowData({ title });
        await vi.waitFor(
          () => {
            const state = useFlowStore.getState();
            return state.flowData?.title === title;
          },
          { timeout: 10000 }
        );
      }

      // 最終状態の確認
      const stateAfterUpdates = useFlowStore.getState();

      expect(stateAfterUpdates.flowData?.title).toBe(titles[2]);
      expect(stateAfterUpdates.history.past).toHaveLength(3);
      expect(stateAfterUpdates.history.future).toHaveLength(0);

      // 1段階目のアンドゥ
      store.undo();
      await vi.waitFor(
        () => {
          const state = useFlowStore.getState();
          return state.flowData?.title === titles[1];
        },
        { timeout: 10000 }
      );

      const stateAfterFirstUndo = useFlowStore.getState();

      expect(stateAfterFirstUndo.flowData?.title).toBe(titles[1]);
      expect(stateAfterFirstUndo.history.past).toHaveLength(2);
      expect(stateAfterFirstUndo.history.future).toHaveLength(1);

      // 2段階目のアンドゥ
      store.undo();
      await vi.waitFor(
        () => {
          const state = useFlowStore.getState();
          return state.flowData?.title === titles[0];
        },
        { timeout: 10000 }
      );

      const stateAfterSecondUndo = useFlowStore.getState();

      expect(stateAfterSecondUndo.flowData?.title).toBe(titles[0]);
      expect(stateAfterSecondUndo.history.past).toHaveLength(1);
      expect(stateAfterSecondUndo.history.future).toHaveLength(2);

      // 1段階目のリドゥ
      store.redo();
      await vi.waitFor(
        () => {
          const state = useFlowStore.getState();
          return state.flowData?.title === titles[1];
        },
        { timeout: 10000 }
      );

      const stateAfterFirstRedo = useFlowStore.getState();

      expect(stateAfterFirstRedo.flowData?.title).toBe(titles[1]);
      expect(stateAfterFirstRedo.history.past).toHaveLength(2);
      expect(stateAfterFirstRedo.history.future).toHaveLength(1);

      // 2段階目のリドゥ
      store.redo();
      await vi.waitFor(
        () => {
          const state = useFlowStore.getState();
          return state.flowData?.title === titles[2];
        },
        { timeout: 10000 }
      );

      const stateAfterSecondRedo = useFlowStore.getState();

      expect(stateAfterSecondRedo.flowData?.title).toBe(titles[2]);
      expect(stateAfterSecondRedo.history.past).toHaveLength(3);
      expect(stateAfterSecondRedo.history.future).toHaveLength(0);
    });
  });

  it('テスト間で状態が分離されている', async () => {
    const store = useFlowStore.getState();
    store.createNewFlow();

    // createNewFlowの完了を待つ
    await vi.waitFor(() => {
      const state = useFlowStore.getState();
      return state.flowData !== null;
    });

    store.updateFlowData({ title: 'Test1' });

    // データの更新を待つ
    await vi.waitFor(() => {
      const state = useFlowStore.getState();
      return state.flowData?.title === 'Test1';
    });

    // ストアをリセット
    store.setFlowData(null);
    store.setIsEditMode(false);
    vi.resetModules();

    // リセットの完了を待つ
    await vi.waitFor(() => {
      const state = useFlowStore.getState();
      return state.flowData === null;
    });

    // 新しいストアインスタンスを取得
    const newStore = useFlowStore.getState();
    expect(newStore.flowData).toBeNull();
  });
});
