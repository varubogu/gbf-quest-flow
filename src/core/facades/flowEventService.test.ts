import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleFlowSave, handleNewFlow, handleExitEditMode, handleCancel } from './flowEventService';
import * as flowOperations from '@/lib/utils/flowOperations';
import * as editModeService from '@/core/services/editModeService';
import * as flowInitService from '@/core/services/flowInitService';
import useFlowStore from '@/core/stores/flowStore';
import type { Flow, Organization } from '@/types/models';

// グローバルオブジェクトのモック
vi.stubGlobal('window', {
  confirm: vi.fn()
});

// モックの設定
vi.mock('@/lib/utils/flowOperations', () => ({
  saveFlow: vi.fn(),
  updateNewFlowState: vi.fn()
}));

vi.mock('@/core/services/editModeService', () => ({
  startEdit: vi.fn(),
  finishEdit: vi.fn(),
  cancelEdit: vi.fn()
}));

vi.mock('@/core/services/flowInitService', () => ({
  newFlowData: vi.fn()
}));

vi.mock('@/lib/utils/accessibility', () => ({
  announceToScreenReader: vi.fn(),
  handleError: vi.fn()
}));

// flowStoreのモック関数
const mockSetFlowData = vi.fn();

// flowStoreのモック
vi.mock('@/core/stores/flowStore', () => {
  return {
    default: {
      getState: vi.fn()
    }
  };
});

describe('flowEventService', () => {
  // テスト用のモックデータ
  const mockFlow: Flow = {
    title: 'テストフロー',
    quest: 'テストクエスト',
    author: 'テスト作者',
    description: 'テスト説明',
    updateDate: '2023-01-01',
    note: 'テストノート',
    organization: {
      job: {
        name: '',
        note: '',
        equipment: {
          name: '',
          note: '',
        },
        abilities: [],
      },
      member: {
        front: [],
        back: [],
      },
      weapon: {
        main: {
          name: '',
          note: '',
          additionalSkill: '',
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
        main: { name: '', note: '' },
        friend: { name: '', note: '' },
        other: [],
        sub: [],
      },
      totalEffects: {
        taRate: '',
        hp: '',
        defense: '',
      },
    } as Organization,
    always: 'テスト常時効果',
    flow: [
      {
        hp: '100%',
        prediction: 'テスト予兆',
        charge: '◯',
        guard: '×',
        action: 'テストアクション',
        note: 'テストノート'
      }
    ]
  };

  // モック用の関数
  const mockClearHistory = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // flowStoreのモックをリセット
    vi.mocked(useFlowStore.getState).mockReturnValue({
      setFlowData: mockSetFlowData,
      originalData: mockFlow,
      flowData: mockFlow,
      getFlowData: vi.fn().mockReturnValue(mockFlow),
      getActionById: vi.fn()
    });
  });

  describe('handleFlowSave', () => {
    it('ファイルを保存し、編集モードを終了する', async () => {
      // モックの設定
      vi.mocked(flowOperations.saveFlow).mockResolvedValue(true);

      // テスト実行
      const result = await handleFlowSave(mockFlow, null, mockClearHistory);

      // 検証
      expect(flowOperations.saveFlow).toHaveBeenCalledWith(mockFlow, null);
      expect(editModeService.finishEdit).toHaveBeenCalled();
      expect(mockClearHistory).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('handleNewFlow', () => {
    it('新しいフローを作成する', () => {
      // テスト実行
      handleNewFlow(mockFlow);

      // 検証
      expect(flowInitService.newFlowData).toHaveBeenCalled();
      expect(flowOperations.updateNewFlowState).toHaveBeenCalledWith(mockFlow);
    });
  });

  describe('handleExitEditMode', () => {
    it('変更がある場合、確認ダイアログを表示し、OKなら元のデータを復元する', async () => {
      // モックの設定
      vi.mocked(window.confirm).mockReturnValue(true);

      // テスト実行
      const result = await handleExitEditMode(true, mockClearHistory);

      // 検証
      expect(window.confirm).toHaveBeenCalled();
      expect(result).toBe(true);
      expect(mockClearHistory).toHaveBeenCalled();
      expect(editModeService.cancelEdit).toHaveBeenCalled();
      expect(mockSetFlowData).toHaveBeenCalled();
    });

    it('変更がある場合、確認ダイアログでキャンセルを選択すると処理を中断する', async () => {
      // モックの設定
      vi.mocked(window.confirm).mockReturnValue(false);

      // テスト実行
      const result = await handleExitEditMode(true, mockClearHistory);

      // 検証
      expect(window.confirm).toHaveBeenCalled();
      expect(result).toBe(false);
      expect(mockClearHistory).not.toHaveBeenCalled();
      expect(editModeService.cancelEdit).not.toHaveBeenCalled();
      expect(mockSetFlowData).not.toHaveBeenCalled();
    });
  });

  describe('handleCancel', () => {
    it('handleExitEditModeを呼び出す', async () => {
      // モックの設定
      vi.mocked(window.confirm).mockReturnValue(true);

      // テスト実行
      const result = await handleCancel(true, mockClearHistory);

      // 検証
      expect(window.confirm).toHaveBeenCalled();
      expect(result).toBe(true);
      expect(mockClearHistory).toHaveBeenCalled();
      expect(editModeService.cancelEdit).toHaveBeenCalled();
    });
  });
});