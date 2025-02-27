import { describe, it, expect, beforeEach } from 'vitest';
import useHistoryStore from './historyStore';
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

describe('HistoryStore', () => {
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

  // テストごとにストアを初期化
  beforeEach(() => {
    const store = useHistoryStore.getState();
    store.clearHistory();
  });

  describe('pushToHistory', () => {
    it('履歴に正しく追加される', async () => {
      const store = useHistoryStore.getState();
      const flow1 = createSampleFlow('Flow 1');
      const flow2 = createSampleFlow('Flow 2');

      // 初期状態の確認
      const initialState = store.getHistoryState();
      expect(initialState.past).toHaveLength(0);
      expect(initialState.future).toHaveLength(0);

      // 履歴に追加
      store.pushToHistory(flow1);

      // 状態の更新を待つ
      await waitForState(() => {
        const state = store.getHistoryState();
        return state.past.length === 1;
      });

      const state1 = store.getHistoryState();
      expect(state1.past).toHaveLength(1);
      expect(state1.past[0]?.title).toBe('Flow 1');

      // さらに追加
      store.pushToHistory(flow2);

      // 状態の更新を待つ
      await waitForState(() => {
        const state = store.getHistoryState();
        return state.past.length === 2;
      });

      const state2 = store.getHistoryState();
      expect(state2.past).toHaveLength(2);
      expect(state2.past[1]?.title).toBe('Flow 2');
    });

    // it('同じデータは履歴に追加されない', async () => {
    //   const store = useHistoryStore.getState();
    //   const flow = createSampleFlow('Same Flow');

    //   // 一度追加
    //   store.pushToHistory(flow);

    //   // 状態の更新を待つ
    //   await waitForState(() => {
    //     const state = store.getHistoryState();
    //     return state.past.length === 1;
    //   });

    //   const state1 = store.getHistoryState();
    //   expect(state1.past).toHaveLength(1);

    //   // 同じデータをもう一度追加
    //   store.pushToHistory(structuredClone(flow));

    //   // 少し待機してから状態を確認（変更がないことを確認）
    //   await new Promise(resolve => setTimeout(resolve, 100));

    //   const state2 = store.getHistoryState();
    //   expect(state2.past).toHaveLength(1);
    // });
  });

  describe('undoWithData', () => {
    it('履歴がある場合、前の状態に戻る', async () => {
      const store = useHistoryStore.getState();
      const flow1 = createSampleFlow('Flow 1');
      const flow2 = createSampleFlow('Flow 2');

      // 履歴に追加
      store.pushToHistory(flow1);
      store.pushToHistory(flow2);

      // 状態の更新を待つ
      await waitForState(() => {
        const state = store.getHistoryState();
        return state.past.length === 2;
      });

      // アンドゥ実行
      const result = store.undoWithData(flow2, null);

      // 状態の更新を待つ
      await waitForState(() => {
        const state = store.getHistoryState();
        return state.future.length === 1;
      });

      // 履歴の状態を確認
      const stateAfterUndo = store.getHistoryState();
      expect(stateAfterUndo.past).toHaveLength(1);
      expect(stateAfterUndo.future).toHaveLength(1);
      expect(result?.title).toBe('Flow 1');
    });

    it('履歴がない場合、オリジナルデータに戻る', async () => {
      const store = useHistoryStore.getState();
      const currentFlow = createSampleFlow('Current Flow');
      const originalFlow = createSampleFlow('Original Flow');

      // 履歴は空
      const initialState = store.getHistoryState();
      expect(initialState.past).toHaveLength(0);

      // アンドゥ実行
      const result = store.undoWithData(currentFlow, originalFlow);

      // 状態の更新を待つ
      await waitForState(() => {
        const state = store.getHistoryState();
        return state.future.length === 1;
      });

      // 結果を確認
      const stateAfterUndo = store.getHistoryState();
      expect(result?.title).toBe('Original Flow');
      expect(stateAfterUndo.future).toHaveLength(1);
      expect(stateAfterUndo.future[0]?.title).toBe('Current Flow');
    });

    it('履歴もオリジナルデータもない場合、nullを返す', () => {
      const store = useHistoryStore.getState();
      const currentFlow = createSampleFlow('Current Flow');

      // 履歴は空でオリジナルもない
      const initialState = store.getHistoryState();
      expect(initialState.past).toHaveLength(0);

      // アンドゥ実行
      const result = store.undoWithData(currentFlow, null);

      // nullが返ること
      expect(result).toBeNull();
    });
  });

  describe('redoWithData', () => {
    it('未来履歴がある場合、次の状態に進む', async () => {
      const store = useHistoryStore.getState();
      const flow1 = createSampleFlow('Flow 1');
      const flow2 = createSampleFlow('Flow 2');

      // 履歴に追加
      store.pushToHistory(flow1);
      store.pushToHistory(flow2);

      // 状態の更新を待つ
      await waitForState(() => {
        const state = store.getHistoryState();
        return state.past.length === 2;
      });

      // アンドゥ実行
      store.undoWithData(flow2, null);

      // アンドゥの状態更新を待つ
      await waitForState(() => {
        const state = store.getHistoryState();
        return state.future.length === 1;
      });

      // リドゥ実行
      const result = store.redoWithData(flow1);

      // リドゥの状態更新を待つ
      await waitForState(() => {
        const state = store.getHistoryState();
        return state.past.length === 2 && state.future.length === 0;
      });

      // 結果を確認
      const stateAfterRedo = store.getHistoryState();
      expect(result?.title).toBe('Flow 2');
      expect(stateAfterRedo.past).toHaveLength(2);
      expect(stateAfterRedo.future).toHaveLength(0);
    });

    it('未来履歴がない場合、nullを返す', () => {
      const store = useHistoryStore.getState();
      const flow = createSampleFlow('Flow');

      // 未来履歴は空
      const initialState = store.getHistoryState();
      expect(initialState.future).toHaveLength(0);

      // リドゥ実行
      const result = store.redoWithData(flow);

      // nullが返ること
      expect(result).toBeNull();
    });
  });

  describe('clearHistory', () => {
    it('履歴を正しくクリアする', async () => {
      const store = useHistoryStore.getState();
      const flow1 = createSampleFlow('Flow 1');
      const flow2 = createSampleFlow('Flow 2');

      // 履歴に追加
      store.pushToHistory(flow1);
      store.pushToHistory(flow2);

      // 状態の更新を待つ
      await waitForState(() => {
        const state = store.getHistoryState();
        return state.past.length === 2;
      });

      // 履歴の存在を確認
      const stateBefore = store.getHistoryState();
      expect(stateBefore.past).toHaveLength(2);

      // 履歴をクリア
      store.clearHistory();

      // 状態の更新を待つ
      await waitForState(() => {
        const state = store.getHistoryState();
        return state.past.length === 0;
      });

      // 履歴がクリアされていることを確認
      const stateAfter = store.getHistoryState();
      expect(stateAfter.past).toHaveLength(0);
      expect(stateAfter.future).toHaveLength(0);
    });
  });
});