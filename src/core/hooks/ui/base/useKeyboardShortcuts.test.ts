import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import type { Flow } from '@/types/models';
import type { EditModeStore, FlowStore } from '@/types/flowStore.types';

// テスト用のモックデータ
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

// flowEventServiceのモック
vi.mock('@/core/facades/flowEventService', () => ({
  handleFlowSave: vi.fn().mockResolvedValue(true),
  handleNewFlow: vi.fn(),
}));

// flowStoreとeditModeStoreのモック
vi.mock('@/core/stores/flowStore', () => ({
  default: vi.fn((selector: (_state: FlowStore) => Partial<FlowStore>) => selector({ flowData: mockFlowData } as FlowStore)),
}));

vi.mock('@/core/stores/editModeStore', () => ({
  default: vi.fn((selector: (_state: EditModeStore) => Partial<EditModeStore>) => selector({ isEditMode: true } as EditModeStore)),
}));

describe('useKeyboardShortcuts', () => {
  // 新しいインターフェースに合わせたモックプロップス
  const mockProps = {
    onSave: vi.fn().mockResolvedValue(true),
    onNew: vi.fn(),
    onExitEditMode: vi.fn().mockResolvedValue(undefined),
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

    expect(mockProps.onSave).toHaveBeenCalled();
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

    expect(mockProps.onNew).toHaveBeenCalled();
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
