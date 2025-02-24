import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleFlowSave, handleNewFlow, handleExitEditMode, handleCancel } from './flowEventService';
import type { Flow } from '@/types/models';
import useFlowStore, { type FlowStore } from '@/stores/flowStore';

// flowOperationsのモック
vi.mock('@/utils/flowOperations', () => ({
  saveFlow: vi.fn().mockResolvedValue(true),
  updateNewFlowState: vi.fn(),
}));

// FlowStoreのモック
vi.mock('@/stores/flowStore', () => {
  const store = {
    setIsEditMode: vi.fn(),
    createNewFlow: vi.fn(),
    setFlowData: vi.fn(),
    originalData: {
      title: '元のフロー',
    },
    flowData: {
      title: 'テストフロー',
      quest: 'テストクエスト',
      author: 'テスト作者',
      description: 'テスト説明',
      updateDate: '2024-01-01',
      note: 'テストノート',
      organization: {
        job: { name: '', note: '', equipment: { name: '', note: '' }, abilities: [] },
        member: { front: [], back: [] },
        weapon: { main: { name: '', note: '', additionalSkill: '' }, other: [], additional: [] },
        weaponEffects: { taRate: '', hp: '', defense: '' },
        summon: { main: { name: '', note: '' }, friend: { name: '', note: '' }, other: [], sub: [] },
        totalEffects: { taRate: '', hp: '', defense: '' },
      },
      always: '',
      flow: [],
    },
    currentRow: 0,
    history: { past: [], future: [] },
    updateFlowData: vi.fn(),
    loadFlowFromFile: vi.fn(),
    setCurrentRow: vi.fn(),
    isEditMode: false,
    clearHistory: vi.fn(),
    cancelEdit: vi.fn(),
    pushToHistory: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    updateAction: vi.fn(),
  };
  return {
    default: {
      getState: (): FlowStore => store,
    },
  };
});

// window.confirmのモック
const mockConfirm = vi.spyOn(window, 'confirm');

describe('flowEventService', () => {
  const mockFlowData: Flow = {
    title: 'テストフロー',
    quest: 'テストクエスト',
    author: 'テスト作者',
    description: 'テスト説明',
    updateDate: '2024-01-01',
    note: 'テストノート',
    organization: {
      job: { name: '', note: '', equipment: { name: '', note: '' }, abilities: [] },
      member: { front: [], back: [] },
      weapon: {
        main: { name: '', note: '', additionalSkill: '' },
        other: [],
        additional: [],
      },
      weaponEffects: { taRate: '', hp: '', defense: '' },
      summon: {
        main: { name: '', note: '' },
        friend: { name: '', note: '' },
        other: [],
        sub: [],
      },
      totalEffects: { taRate: '', hp: '', defense: '' },
    },
    always: '',
    flow: [],
  };

  const mockClearHistory = vi.fn();
  const mockSourceId = 'test-id';

  beforeEach(() => {
    vi.clearAllMocks();
    mockConfirm.mockImplementation(() => true);
  });

  describe('handleFlowSave', () => {
    it('保存が成功したら履歴をクリアして編集モードを終了する', async () => {
      const { saveFlow } = await import('@/utils/flowOperations');
      const result = await handleFlowSave(mockFlowData, mockSourceId, mockClearHistory);

      expect(saveFlow).toHaveBeenCalledWith(mockFlowData, mockSourceId);
      expect(mockClearHistory).toHaveBeenCalled();
      expect(useFlowStore.getState().setIsEditMode).toHaveBeenCalledWith(false);
      expect(result).toBe(true);
    });

    it('保存が失敗したら履歴をクリアせず編集モードも変更しない', async () => {
      const { saveFlow } = await import('@/utils/flowOperations');
      vi.mocked(saveFlow).mockResolvedValueOnce(false);

      const result = await handleFlowSave(mockFlowData, mockSourceId, mockClearHistory);

      expect(saveFlow).toHaveBeenCalledWith(mockFlowData, mockSourceId);
      expect(mockClearHistory).not.toHaveBeenCalled();
      expect(useFlowStore.getState().setIsEditMode).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('handleNewFlow', () => {
    it('新規フローを作成してURL状態を更新する', async () => {
      const { updateNewFlowState } = await import('@/utils/flowOperations');

      handleNewFlow(mockFlowData);

      expect(useFlowStore.getState().createNewFlow).toHaveBeenCalled();
      expect(updateNewFlowState).toHaveBeenCalledWith(mockFlowData);
    });

    it('flowDataがnullでも処理を実行できる', async () => {
      const { updateNewFlowState } = await import('@/utils/flowOperations');

      handleNewFlow(null);

      expect(useFlowStore.getState().createNewFlow).toHaveBeenCalled();
      expect(updateNewFlowState).toHaveBeenCalledWith(null);
    });
  });

  describe('handleExitEditMode', () => {
    it('変更がない場合は確認なしで編集モードを終了する', async () => {
      const result = await handleExitEditMode(false, mockClearHistory);

      expect(mockConfirm).not.toHaveBeenCalled();
      expect(useFlowStore.getState().setFlowData).toHaveBeenCalledWith(useFlowStore.getState().originalData);
      expect(useFlowStore.getState().setIsEditMode).toHaveBeenCalledWith(false);
      expect(mockClearHistory).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('変更があり確認でキャンセルした場合は編集モードを維持する', async () => {
      mockConfirm.mockImplementationOnce(() => false);

      const result = await handleExitEditMode(true, mockClearHistory);

      expect(mockConfirm).toHaveBeenCalled();
      expect(useFlowStore.getState().setFlowData).not.toHaveBeenCalled();
      expect(useFlowStore.getState().setIsEditMode).not.toHaveBeenCalled();
      expect(mockClearHistory).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('変更があり確認でOKした場合は編集モードを終了する', async () => {
      const result = await handleExitEditMode(true, mockClearHistory);

      expect(mockConfirm).toHaveBeenCalled();
      expect(useFlowStore.getState().setFlowData).toHaveBeenCalledWith(useFlowStore.getState().originalData);
      expect(useFlowStore.getState().setIsEditMode).toHaveBeenCalledWith(false);
      expect(mockClearHistory).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('handleCancel', () => {
    it('handleExitEditModeを呼び出す', async () => {
      const result = await handleCancel(true, mockClearHistory);

      expect(mockConfirm).toHaveBeenCalled();
      expect(useFlowStore.getState().setFlowData).toHaveBeenCalledWith(useFlowStore.getState().originalData);
      expect(useFlowStore.getState().setIsEditMode).toHaveBeenCalledWith(false);
      expect(mockClearHistory).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});