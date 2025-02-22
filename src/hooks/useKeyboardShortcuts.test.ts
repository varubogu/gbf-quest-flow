import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import useFlowStore from '@/stores/flowStore';
import type { Flow } from '@/types/models';

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
    sourceId: null,
    onExitEditMode: vi.fn().mockResolvedValue(undefined),
    clearHistory: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // BlobとURL操作のモック
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:test'),
      revokeObjectURL: vi.fn(),
    });
    // document.createElement のモック
    const mockAnchor = {
      href: '',
      download: '',
      setAttribute: vi.fn(),
      click: vi.fn(),
    };
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
    // document.body のメソッドをモック
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => document.body);
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => document.body);
  });

  it('Ctrl + Sで保存処理が実行される', async () => {
    renderHook(() => useKeyboardShortcuts(mockProps));

    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);

    expect(mockProps.clearHistory).toHaveBeenCalled();
    expect(useFlowStore.getState().setIsEditMode).toHaveBeenCalledWith(false);
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('Ctrl + Nで新規作成処理が実行される', () => {
    renderHook(() => useKeyboardShortcuts(mockProps));

    const event = new KeyboardEvent('keydown', {
      key: 'n',
      ctrlKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);

    expect(useFlowStore.getState().createNewFlow).toHaveBeenCalled();
    expect(useFlowStore.getState().setIsEditMode).toHaveBeenCalledWith(true);
  });

  it('Escapeで編集モード終了処理が実行される', async () => {
    renderHook(() => useKeyboardShortcuts(mockProps));

    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });
    window.dispatchEvent(event);

    expect(mockProps.onExitEditMode).toHaveBeenCalled();
  });

  it('編集モードでない場合、Ctrl + Sは実行されない', () => {
    renderHook(() =>
      useKeyboardShortcuts({
        ...mockProps,
        isEditMode: false,
      })
    );

    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);

    expect(mockProps.clearHistory).not.toHaveBeenCalled();
    expect(useFlowStore.getState().setIsEditMode).not.toHaveBeenCalled();
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });

  it('flowDataがない場合、Ctrl + Sは実行されない', () => {
    renderHook(() =>
      useKeyboardShortcuts({
        ...mockProps,
        flowData: null,
      })
    );

    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);

    expect(mockProps.clearHistory).not.toHaveBeenCalled();
    expect(useFlowStore.getState().setIsEditMode).not.toHaveBeenCalled();
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });
});
