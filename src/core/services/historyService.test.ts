import {
  pushToHistory,
  undo,
  redo,
  canUndo,
  canRedo
} from './historyService';
import useHistoryStore from '@/core/stores/historyStore';
import useFlowStore from '@/core/stores/flowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import { type Flow } from '@/types/types';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

// モック化
vi.mock('@/core/stores/historyStore', () => ({
  default: {
    getState: vi.fn(),
    setState: vi.fn()
  }
}));

vi.mock('@/core/stores/flowStore', () => ({
  default: {
    getState: vi.fn()
  }
}));

vi.mock('@/core/stores/editModeStore', () => ({
  default: {
    getState: vi.fn()
  }
}));

const mockData = (): Flow => ({
  title: 'Test Flow 1',
  quest: '',
  author: '',
  description: '',
  updateDate: '',
  note: '',
  organization: {
    job: {
      name: '',
      note: '',
      equipment: { name: '', note: '' },
      abilities: []
    },
    member: {
      front: [],
      back: []
    },
    weapon: {
      main: { name: '', note: '', additionalSkill: '' },
      other: [],
      additional: []
    },
    weaponEffects: { taRate: '', hp: '', defense: '' },
    summon: {
      main: { name: '', note: '' },
      friend: { name: '', note: '' },
      other: [],
      sub: []
    },
    totalEffects: { taRate: '', hp: '', defense: '' },
  },
  always: '',
  flow: []
});

describe('History Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // デフォルトのモック実装
    (useHistoryStore.getState as Mock).mockReturnValue({
      getState: vi.fn().mockReturnValue({ past: [], future: [] }),
      push: vi.fn(),
      undo: vi.fn(),
      redo: vi.fn(),
      clear: vi.fn()
    });

    (useFlowStore.getState as Mock).mockReturnValue({
      getFlowData: vi.fn(),
      setFlowData: vi.fn(),
      originalData: null
    });

    (useEditModeStore.getState as Mock).mockReturnValue({
      isEditMode: true
    });
  });

  describe('pushToHistory', () => {
    it('編集モード時に履歴に追加される', () => {
      const flow1 = mockData();
      const historyStore = useHistoryStore.getState();

      pushToHistory(flow1);

      expect(historyStore.push).toHaveBeenCalledWith(flow1);
    });

    it('編集モードでない時は履歴に追加されない', () => {
      const flow1 = mockData();

      (useEditModeStore.getState as Mock).mockReturnValue({
        isEditMode: false
      });

      const historyStore = useHistoryStore.getState();

      pushToHistory(flow1);

      expect(historyStore.push).not.toHaveBeenCalled();
    });
  });

  describe('undo/redo', () => {
    const flow1 = mockData();
    flow1.title = 'Test Flow 1';

    const flow2 = mockData();
    flow2.title = 'Test Flow 2';

    it('undoが正しく動作する - 履歴がある場合', () => {
      const flowStore = useFlowStore.getState();
      const historyStore = useHistoryStore.getState();

      // 履歴があることを設定
      (historyStore.getState as Mock).mockReturnValue({ past: ['something'], future: [] });

      // 現在のデータを設定
      (flowStore.getFlowData as Mock).mockReturnValue(flow2);

      // undoの戻り値を設定
      (historyStore.undo as Mock).mockReturnValue(flow1);

      undo();

      expect(historyStore.undo).toHaveBeenCalled();
      expect(flowStore.setFlowData).toHaveBeenCalledWith(flow1);
    });

    it('undoが正しく動作する - 履歴がなくオリジナルデータがある場合', () => {
      const flowStore = useFlowStore.getState();
      const historyStore = useHistoryStore.getState();

      // 履歴がないことを設定
      (historyStore.getState as Mock).mockReturnValue({ past: [], future: [] });

      // 現在のデータとオリジナルデータを設定
      const currentFlow = flow2;
      const originalFlow = flow1;
      (flowStore.getFlowData as Mock).mockReturnValue(currentFlow);
      (flowStore.originalData as unknown) = originalFlow;

      undo();

      // useHistoryStore.setStateが呼ばれることを確認
      expect(useHistoryStore.setState).toHaveBeenCalledWith({
        history: {
          past: [],
          future: expect.arrayContaining([expect.anything() as Flow]) as Flow[]
        }
      });

      expect(flowStore.setFlowData).toHaveBeenCalled();
    });

    it('redoが正しく動作する', () => {
      const flowStore = useFlowStore.getState();
      const historyStore = useHistoryStore.getState();

      // 現在のデータを設定
      (flowStore.getFlowData as Mock).mockReturnValue(flow1);

      // redoの戻り値を設定
      (historyStore.redo as Mock).mockReturnValue(flow2);

      redo();

      expect(historyStore.redo).toHaveBeenCalled();
      expect(flowStore.setFlowData).toHaveBeenCalledWith(flow2);
    });
  });

  describe('canUndo', () => {
    it('過去の履歴がない場合はfalseを返す', () => {
      (useHistoryStore.getState as Mock).mockReturnValue({
        getState: vi.fn().mockReturnValue({ past: [], future: [] })
      });

      (useFlowStore.getState as Mock).mockReturnValue({
        originalData: null
      });

      expect(canUndo()).toBe(false);
    });

    it('過去の履歴がある場合はtrueを返す', () => {
      (useHistoryStore.getState as Mock).mockReturnValue({
        getState: vi.fn().mockReturnValue({ past: ['something'], future: [] })
      });

      expect(canUndo()).toBe(true);
    });

    it('過去の履歴がなくてもオリジナルデータがある場合はtrueを返す', () => {
      (useHistoryStore.getState as Mock).mockReturnValue({
        getState: vi.fn().mockReturnValue({ past: [], future: [] })
      });

      (useFlowStore.getState as Mock).mockReturnValue({
        originalData: mockData()
      });

      expect(canUndo()).toBe(true);
    });
  });

  describe('canRedo', () => {
    it('未来の履歴がない場合はfalseを返す', () => {
      (useHistoryStore.getState as Mock).mockReturnValue({
        getState: vi.fn().mockReturnValue({ past: [], future: [] })
      });

      expect(canRedo()).toBe(false);
    });

    it('未来の履歴がある場合はtrueを返す', () => {
      (useHistoryStore.getState as Mock).mockReturnValue({
        getState: vi.fn().mockReturnValue({ past: [], future: ['something'] })
      });

      expect(canRedo()).toBe(true);
    });
  });
});