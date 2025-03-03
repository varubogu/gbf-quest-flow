import { describe, it, expect, beforeEach, vi } from 'vitest';
import useEditModeStore from './editModeStore';
import useFlowStore from './flowStore';
import {
  clearHistory
} from '@/core/services/historyService';
import type { Flow } from '@/types/models';
import type { HistoryState } from './historyStore';

// モックデータの準備
const mockFlowData = {
  title: 'テストフロー',
  quest: 'テストクエスト',
  author: '',
  description: '',
  updateDate: '',
  note: '',
  organization: {
    job: {
      name: '',
      note: '',
      equipment: { name: '', note: '' },
      abilities: [],
    },
    member: { front: [], back: [] },
    weapon: { main: { name: '', note: '', additionalSkill: '' }, other: [], additional: [] },
    weaponEffects: { taRate: '', hp: '', defense: '' },
    summon: { main: { name: '', note: '' }, friend: { name: '', note: '' }, other: [], sub: [] },
    totalEffects: { taRate: '', hp: '', defense: '' },
  },
  always: '',
  flow: [{ hp: '', prediction: '', charge: '', guard: '', action: '', note: '' }],
} as Flow;

// historyServiceのモック
vi.mock('@/core/services/historyService', () => {
  const mockClearHistory = vi.fn();
  const emptyHistory: HistoryState = { past: [], future: [] };

  return {
    clearHistory: mockClearHistory,
    useHistoryService: {
      getState: vi.fn(() => ({
        clearHistory: mockClearHistory,
        pushToHistory: vi.fn(),
        undo: vi.fn(),
        redo: vi.fn(),
        getHistoryState: vi.fn(() => emptyHistory),
        canUndo: vi.fn(() => false),
        canRedo: vi.fn(() => false),
      }))
    }
  };
});

describe('EditModeStore', () => {
  beforeEach(() => {
    // ストアの状態をリセット
    useEditModeStore.setState({ isEditMode: false });

    // モックをリセット
    vi.clearAllMocks();

    // flowStoreのメソッドをスパイ
    vi.spyOn(useFlowStore, 'setState').mockImplementation(() => {});
    vi.spyOn(useFlowStore, 'getState').mockImplementation(() => ({
      getFlowData: (): Flow => mockFlowData,
      originalData: null,
      flowData: null,
      setFlowData: vi.fn(),
      getActionById: vi.fn(),
    }));

    // グローバルhistoryオブジェクトをモック
    vi.stubGlobal('history', { back: vi.fn() });
  });

  describe('基本的な状態管理', () => {
    it('初期状態ではisEditModeはfalseであるべき', () => {
      expect(useEditModeStore.getState().isEditMode).toBe(false);
    });

    it('getIsEditModeは正しい値を返すべき', () => {
      // falseの場合
      expect(useEditModeStore.getState().getIsEditMode()).toBe(false);

      // trueに変更した場合
      useEditModeStore.setState({ isEditMode: true });
      expect(useEditModeStore.getState().getIsEditMode()).toBe(true);
    });
  });

  describe('setIsEditMode', () => {
    it('trueに設定するとflowStoreのoriginalDataが更新されるべき', () => {
      // 実行
      useEditModeStore.getState().setIsEditMode(true);

      // 検証
      expect(useEditModeStore.getState().isEditMode).toBe(true);
      expect(useFlowStore.setState).toHaveBeenCalledWith(
        expect.objectContaining({
          originalData: expect.anything()
        })
      );
    });

    it('falseに設定すると履歴がクリアされoriginalDataがnullになるべき', () => {
      // 実行
      useEditModeStore.getState().setIsEditMode(false);

      // 検証
      expect(useEditModeStore.getState().isEditMode).toBe(false);
      expect(clearHistory).toHaveBeenCalled();
      expect(useFlowStore.setState).toHaveBeenCalledWith(
        expect.objectContaining({
          originalData: null
        })
      );
    });
  });

  describe('cancelEdit', () => {
    it('originalDataが存在する場合、編集をキャンセルして元の状態に戻すべき', () => {
      // originalDataが存在するようにモックを設定
      vi.spyOn(useFlowStore, 'getState').mockImplementation(() => ({
        getFlowData: (): Flow => mockFlowData,
        originalData: mockFlowData,
        flowData: null,
        setFlowData: vi.fn(),
        getActionById: vi.fn(),
      }));

      // 事前に編集モードをオンにする
      useEditModeStore.setState({ isEditMode: true });

      // 実行
      useEditModeStore.getState().cancelEdit();

      // 検証
      expect(useEditModeStore.getState().isEditMode).toBe(false);
      expect(useFlowStore.setState).toHaveBeenCalledWith(
        expect.objectContaining({
          flowData: expect.anything(),
          originalData: null
        })
      );
      expect(clearHistory).toHaveBeenCalled();
      expect(history.back).toHaveBeenCalled();
    });

    it('originalDataが存在しない場合、何も起こらないべき', () => {
      // originalDataがnullのままのモックを使用

      // 実行
      useEditModeStore.getState().cancelEdit();

      // setState()やhistory.back()は呼ばれないはず
      expect(useFlowStore.setState).not.toHaveBeenCalled();
      expect(history.back).not.toHaveBeenCalled();
    });
  });

  describe('createNewFlow', () => {
    it('新しいフローを作成し、編集モードをオンにするべき', () => {
      // 実行
      useEditModeStore.getState().createNewFlow();

      // 検証
      expect(useEditModeStore.getState().isEditMode).toBe(true);
      expect(clearHistory).toHaveBeenCalled();
      expect(useFlowStore.setState).toHaveBeenCalledWith(
        expect.objectContaining({
          flowData: expect.objectContaining({
            title: '新しいフロー'
          }),
          originalData: expect.anything(),
        })
      );
    });
  });
});