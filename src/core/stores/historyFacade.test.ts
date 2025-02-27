import { describe, it, expect, beforeEach, vi } from 'vitest';
import useHistoryFacade from './historyFacade';
import useHistoryStore from './historyStore';
import useBaseFlowStore from './baseFlowStore';
import useEditModeStore from './editModeStore';
import type { Flow } from '@/types/models';

// 状態が更新されるのを待つヘルパー関数
const waitForState = async (predicate: () => boolean, timeout = 1000): Promise<void> => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (predicate()) {
      return;
    }
    // 少し待機
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  throw new Error('Timeout waiting for state change');
};

describe('HistoryFacade', () => {
  // サンプルデータの作成
  const createSampleFlow = (title: string): Flow => ({
    title,
    quest: 'Test Quest',
    author: 'Test Author',
    description: 'Test Description',
    updateDate: new Date().toISOString(),
    note: 'Test Note',
    organization: {
      job: {
        name: 'Test Job',
        note: 'Test Job Note',
        equipment: {
          name: 'Test Equipment',
          note: 'Test Equipment Note',
        },
        abilities: [],
      },
      member: {
        front: [],
        back: [],
      },
      weapon: {
        main: {
          name: 'Test Main Weapon',
          note: 'Test Main Weapon Note',
          additionalSkill: 'Test Skill',
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
        main: { name: 'Test Main Summon', note: 'Test Main Summon Note' },
        friend: { name: 'Test Friend Summon', note: 'Test Friend Summon Note' },
        other: [],
        sub: [],
      },
      totalEffects: {
        taRate: '',
        hp: '',
        defense: '',
      },
    },
    always: 'Test Always',
    flow: [
      {
        hp: 'Test HP',
        prediction: 'Test Prediction',
        charge: 'Test Charge',
        guard: 'Test Guard',
        action: 'Test Action',
        note: 'Test Note',
      },
    ],
  });

  // モック化
  beforeEach(() => {
    vi.clearAllMocks();

    // 各ストアをリセット
    useHistoryStore.getState().clearHistory();
    useBaseFlowStore.setState({ flowData: null, originalData: null });
    useEditModeStore.setState({ isEditMode: false });
  });

  describe('pushToHistory', () => {
    it('編集モード中のみ履歴に追加される', async () => {
      const historyFacade = useHistoryFacade.getState();
      const flow1 = createSampleFlow('Flow 1');

      // 編集モードでない場合
      useEditModeStore.setState({ isEditMode: false });
      historyFacade.pushToHistory(flow1);

      // 履歴は追加されていないはず
      const historyState1 = historyFacade.getHistoryState();
      expect(historyState1.past).toHaveLength(0);

      // 編集モードの場合
      useEditModeStore.setState({ isEditMode: true });
      historyFacade.pushToHistory(flow1);

      // 状態の更新を待つ
      await waitForState(() => {
        const state = historyFacade.getHistoryState();
        return state.past.length === 1;
      });

      // 履歴が追加されているはず
      const historyState2 = historyFacade.getHistoryState();
      expect(historyState2.past).toHaveLength(1);
      expect(historyState2.past[0]?.title).toBe('Flow 1');
    });
  });

  describe('undo と redo', () => {
    it('undo によって前の状態に戻る', async () => {
      const historyFacade = useHistoryFacade.getState();
      const flow1 = createSampleFlow('Flow 1');
      const flow2 = createSampleFlow('Flow 2');

      // 初期データを設定
      useBaseFlowStore.setState({ flowData: flow1, originalData: null });

      // 編集モードにする
      useEditModeStore.setState({ isEditMode: true });

      // 最初のデータを履歴に追加
      historyFacade.pushToHistory(flow1);

      // 状態の更新を待つ
      await waitForState(() => {
        const state = historyFacade.getHistoryState();
        return state.past.length === 1;
      });

      // 新しいデータをセットして履歴に追加
      useBaseFlowStore.setState({ flowData: flow2 });
      historyFacade.pushToHistory(flow2);

      // 状態の更新を待つ
      await waitForState(() => {
        const state = historyFacade.getHistoryState();
        return state.past.length === 2;
      });

      // undoを実行
      historyFacade.undo();

      // 状態の更新を待つ
      await waitForState(() => {
        return useBaseFlowStore.getState().flowData?.title === 'Flow 1';
      });

      // baseFlowStoreのデータが更新されているか確認
      const flowData = useBaseFlowStore.getState().flowData;
      expect(flowData?.title).toBe('Flow 1');

      // 履歴の状態が更新されているか確認
      const historyState = historyFacade.getHistoryState();
      expect(historyState.past).toHaveLength(1);
      expect(historyState.future).toHaveLength(1);
    });

    it('redo によって次の状態に進む', async () => {
      const historyFacade = useHistoryFacade.getState();
      const flow1 = createSampleFlow('Flow 1');
      const flow2 = createSampleFlow('Flow 2');

      // 初期データを設定
      useBaseFlowStore.setState({ flowData: flow1, originalData: null });

      // 編集モードにする
      useEditModeStore.setState({ isEditMode: true });

      // 最初のデータを履歴に追加
      historyFacade.pushToHistory(flow1);

      // 状態の更新を待つ
      await waitForState(() => {
        const state = historyFacade.getHistoryState();
        return state.past.length === 1;
      });

      // 新しいデータをセットして履歴に追加
      useBaseFlowStore.setState({ flowData: flow2 });
      historyFacade.pushToHistory(flow2);

      // 状態の更新を待つ
      await waitForState(() => {
        const state = historyFacade.getHistoryState();
        return state.past.length === 2;
      });

      // undoを実行
      historyFacade.undo();

      // 状態の更新を待つ
      await waitForState(() => {
        return useBaseFlowStore.getState().flowData?.title === 'Flow 1';
      });

      // redoを実行
      historyFacade.redo();

      // 状態の更新を待つ
      await waitForState(() => {
        return useBaseFlowStore.getState().flowData?.title === 'Flow 2';
      });

      // baseFlowStoreのデータが更新されているか確認
      const flowData = useBaseFlowStore.getState().flowData;
      expect(flowData?.title).toBe('Flow 2');

      // 履歴の状態が更新されているか確認
      const historyState = historyFacade.getHistoryState();
      expect(historyState.past).toHaveLength(2);
      expect(historyState.future).toHaveLength(0);
    });
  });

  describe('canUndo と canRedo', () => {
    it('履歴が空の場合、canUndoはオリジナルデータがある場合のみtrue', () => {
      const historyFacade = useHistoryFacade.getState();
      const flow = createSampleFlow('Test Flow');

      // 履歴が空でオリジナルデータもない場合
      useBaseFlowStore.setState({ flowData: flow, originalData: null });
      expect(historyFacade.canUndo()).toBe(false);

      // 履歴が空でオリジナルデータがある場合
      const originalFlow = createSampleFlow('Original Flow');
      useBaseFlowStore.setState({ flowData: flow, originalData: originalFlow });
      expect(historyFacade.canUndo()).toBe(true);
    });

    it('履歴がある場合、canUndoはtrue', async () => {
      const historyFacade = useHistoryFacade.getState();
      const flow = createSampleFlow('Test Flow');

      // 編集モードにして履歴に追加
      useEditModeStore.setState({ isEditMode: true });
      useBaseFlowStore.setState({ flowData: flow, originalData: null });
      historyFacade.pushToHistory(flow);

      // 状態の更新を待つ
      await waitForState(() => {
        const state = historyFacade.getHistoryState();
        return state.past.length === 1;
      });

      expect(historyFacade.canUndo()).toBe(true);
    });

    it('未来履歴がある場合のみcanRedoはtrue', async () => {
      const historyFacade = useHistoryFacade.getState();
      const flow1 = createSampleFlow('Flow 1');
      const flow2 = createSampleFlow('Flow 2');

      // 初期データを設定して編集モードにする
      useBaseFlowStore.setState({ flowData: flow1, originalData: null });
      useEditModeStore.setState({ isEditMode: true });

      // データを履歴に追加
      historyFacade.pushToHistory(flow1);
      useBaseFlowStore.setState({ flowData: flow2 });
      historyFacade.pushToHistory(flow2);

      // 状態の更新を待つ
      await waitForState(() => {
        const state = historyFacade.getHistoryState();
        return state.past.length === 2;
      });

      // 最初はやり直しできない
      expect(historyFacade.canRedo()).toBe(false);

      // undoを実行したらやり直しできるようになる
      historyFacade.undo();

      // 状態の更新を待つ
      await waitForState(() => {
        const state = historyFacade.getHistoryState();
        return state.future.length === 1;
      });

      expect(historyFacade.canRedo()).toBe(true);

      // redoを実行したらやり直しできなくなる
      historyFacade.redo();

      // 状態の更新を待つ
      await waitForState(() => {
        const state = historyFacade.getHistoryState();
        return state.future.length === 0;
      });

      expect(historyFacade.canRedo()).toBe(false);
    });
  });
});