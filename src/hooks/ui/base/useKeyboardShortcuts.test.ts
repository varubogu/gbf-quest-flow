import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import type { Flow } from '@/types/models';

// flowEventServiceのモック
vi.mock('@/services/flowEventService', () => ({
  handleFlowSave: vi.fn().mockResolvedValue(true),
  handleNewFlow: vi.fn(),
}));

describe('useKeyboardShortcuts', () => {
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

  const mockProps = {
    isEditMode: true,
    flowData: mockFlowData,
    onExitEditMode: vi.fn().mockResolvedValue(undefined),
    clearHistory: vi.fn(),
    sourceId: 'test-id',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Ctrl + Sで保存処理が実行される', async () => {
    renderHook(() => useKeyboardShortcuts(mockProps));

    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true,
      bubbles: true,
    });

    await act(async () => {
      window.dispatchEvent(event);
    });

    const { handleFlowSave } = await import('@/services/flowEventService');
    expect(handleFlowSave).toHaveBeenCalledWith(
      mockFlowData,
      mockProps.sourceId,
      mockProps.clearHistory
    );
  });

  it('Ctrl + Nで新規作成処理が実行される', async () => {
    renderHook(() => useKeyboardShortcuts(mockProps));

    const event = new KeyboardEvent('keydown', {
      key: 'n',
      ctrlKey: true,
      bubbles: true,
    });

    await act(async () => {
      window.dispatchEvent(event);
    });

    const { handleNewFlow } = await import('@/services/flowEventService');
    expect(handleNewFlow).toHaveBeenCalledWith(mockFlowData);
  });

  it('Escapeで編集モード終了処理が実行される', async () => {
    renderHook(() => useKeyboardShortcuts(mockProps));

    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });

    await act(async () => {
      window.dispatchEvent(event);
    });

    expect(mockProps.onExitEditMode).toHaveBeenCalled();
  });
});
