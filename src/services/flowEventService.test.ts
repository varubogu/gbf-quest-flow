import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleFlowSave, handleNewFlow } from './flowEventService';
import type { Flow } from '@/types/models';
import useFlowStore from '@/stores/flowStore';

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
  };
  return {
    default: {
      getState: () => store,
    },
  };
});

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
});