import {
  pushToHistory,
  undo,
  redo,
  canUndo,
  canRedo
} from './historyService';
import useHistoryStore from '@/core/stores/historyStore';
import useBaseFlowStore from '@/core/stores/baseFlowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import { type Flow } from '@/types/types';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

// モック化
vi.mock('@/core/stores/historyStore', () => ({
  default: {
    getState: vi.fn()
  }
}));

vi.mock('@/core/stores/baseFlowStore', () => ({
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
      getHistoryState: vi.fn().mockReturnValue({ past: [], present: null, future: [] }),
      pushToHistory: vi.fn(),
      undoWithData: vi.fn(),
      redoWithData: vi.fn(),
      clearHistory: vi.fn()
    });

    (useBaseFlowStore.getState as Mock).mockReturnValue({
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

      expect(historyStore.pushToHistory).toHaveBeenCalledWith(flow1);
    });

    it('編集モードでない時は履歴に追加されない', () => {
      const flow1 = mockData();

      (useEditModeStore.getState as Mock).mockReturnValue({
        isEditMode: false
      });

      const historyStore = useHistoryStore.getState();

      pushToHistory(flow1);

      expect(historyStore.pushToHistory).not.toHaveBeenCalled();
    });
  });

  describe('undo/redo', () => {
    const flow1 = mockData();
    flow1.title = 'Test Flow 1';

    const flow2 = mockData();
    flow2.title = 'Test Flow 2';

    it('undoが正しく動作する', () => {
      const baseFlowStore = useBaseFlowStore.getState();
      const historyStore = useHistoryStore.getState();

      // 現在のデータを設定
      (baseFlowStore.getFlowData as Mock).mockReturnValue(flow2);
      // undoWithDataの戻り値を設定
      (historyStore.undoWithData as Mock).mockReturnValue(flow1);

      undo();

      expect(baseFlowStore.setFlowData).toHaveBeenCalledWith(flow1);
    });

    it('redoが正しく動作する', () => {
      const baseFlowStore = useBaseFlowStore.getState();
      const historyStore = useHistoryStore.getState();

      // 現在のデータを設定
      (baseFlowStore.getFlowData as Mock).mockReturnValue(flow1);
      // redoWithDataの戻り値を設定
      (historyStore.redoWithData as Mock).mockReturnValue(flow2);

      redo();

      expect(baseFlowStore.setFlowData).toHaveBeenCalledWith(flow2);
    });
  });

  describe('canUndo', () => {
    it('過去の履歴がない場合はfalseを返す', () => {
      expect(canUndo()).toBe(false);
    });

    it('過去の履歴がある場合はtrueを返す', () => {
      (useHistoryStore.getState as Mock).mockReturnValue({
        getHistoryState: vi.fn().mockReturnValue({ past: ['something'], present: null, future: [] })
      });

      expect(canUndo()).toBe(true);
    });
  });

  describe('canRedo', () => {
    it('未来の履歴がない場合はfalseを返す', () => {
      expect(canRedo()).toBe(false);
    });

    it('未来の履歴がある場合はtrueを返す', () => {
      (useHistoryStore.getState as Mock).mockReturnValue({
        getHistoryState: vi.fn().mockReturnValue({ past: [], present: null, future: ['something'] })
      });

      expect(canRedo()).toBe(true);
    });
  });
});