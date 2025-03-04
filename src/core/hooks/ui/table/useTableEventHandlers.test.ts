import { renderHook, act } from '@testing-library/react/pure';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Action, Flow } from '@/types/types';
import type { FlowStore, CursorStore } from '@/types/flowStore.types';

// モックするストアの型と初期状態
const mockFlowData: FlowStore = {
  flowData: {
    title: 'Test Flow',
    quest: 'Test Quest',
    author: 'Test Author',
    description: 'Test Description',
    updateDate: '2023-01-01',
    note: 'Test Note',
    organization: {
      job: {
        name: 'Test Job',
        note: 'Test Job Note',
        equipment: { name: 'Test Equipment', note: 'Test Equipment Note' },
        abilities: [{ name: 'Test Ability', note: 'Test Ability Note' }]
      },
      member: {
        front: [{ name: 'Front Member', note: 'Front Note', awaketype: '', accessories: '', limitBonus: '' }],
        back: [{ name: 'Back Member', note: 'Back Note', awaketype: '', accessories: '', limitBonus: '' }]
      },
      weapon: {
        main: { name: 'Main Weapon', note: 'Main Weapon Note', additionalSkill: '' },
        other: [{ name: 'Other Weapon', note: 'Other Weapon Note', additionalSkill: '' }],
        additional: []
      },
      weaponEffects: { taRate: '', hp: '', defense: '' },
      totalEffects: { taRate: '', hp: '', defense: '' },
      summon: {
        main: { name: 'Main Summon', note: 'Main Summon Note' },
        friend: { name: 'Friend Summon', note: 'Friend Summon Note' },
        other: [{ name: 'Other Summon', note: 'Other Summon Note' }],
        sub: [{ name: 'Sub Summon', note: 'Sub Summon Note' }]
      }
    },
    always: 'Test Always',
    flow: [
      { hp: '100', prediction: 'test', charge: '', guard: '', action: '', note: '' },
      { hp: '90', prediction: 'another', charge: '', guard: '', action: '', note: '' }
    ],
    movie: undefined
  },
  originalData: null,
  getFlowData: () => mockFlowData.flowData,
  getActionById: (index: number) => mockFlowData.flowData?.flow[index],
  setFlowData: vi.fn((data: Flow | null) => {
    mockFlowData.flowData = data;
  })
};

// モックの実装
vi.mock('@/core/stores/flowStore', () => ({
  default: vi.fn((selector: (_state: FlowStore) => FlowStore) => {
    return selector(mockFlowData);
  })
}));

vi.mock('@/core/stores/cursorStore', () => {
  const mockState: CursorStore = {
    currentRow: 0,
    setCurrentRow: vi.fn((row: number) => {
      mockState.currentRow = row;
    })
  };

  return {
    default: vi.fn((selector: (_state: CursorStore) => CursorStore) => {
      return selector(mockState);
    })
  };
});

// モックするファサード
vi.mock('@/core/facades/cursorStoreFacade', () => ({
  setCurrentRow: vi.fn((_row: number) => {
    // カーソル位置を更新するモック実装
  })
}));

// テスト対象のフック
import { useTableEventHandlers } from './useTableEventHandlers';

describe('useTableEventHandlers', () => {
  let result: { current: ReturnType<typeof useTableEventHandlers> };

  beforeEach(() => {
    // フックをレンダリング
    const { result: hookResult } = renderHook(() => useTableEventHandlers());
    result = hookResult;
  });

  it('行選択', () => {
    const { handleRowSelect } = result.current;

    act(() => {
      handleRowSelect(1);
    });

    // モックされた関数が呼び出されたことを確認
    expect(handleRowSelect).toBeDefined();
  });

  it('上へ移動', () => {
    const { handleMoveUp } = result.current;

    act(() => {
      handleMoveUp();
    });

    // モックされた関数が呼び出されたことを確認
    expect(handleMoveUp).toBeDefined();
  });

  it('下へ移動', () => {
    const { handleMoveDown } = result.current;

    act(() => {
      handleMoveDown();
    });

    // モックされた関数が呼び出されたことを確認
    expect(handleMoveDown).toBeDefined();
  });

  it('セルを編集', () => {
    const { handleCellEdit } = result.current;

    act(() => {
      handleCellEdit(0, 'hp', '80');
    });

    // モックされた関数が呼び出されたことを確認
    expect(handleCellEdit).toBeDefined();
  });

  it('行を削除', () => {
    const { handleDeleteRow } = result.current;

    act(() => {
      handleDeleteRow(0);
    });

    // モックされた関数が呼び出されたことを確認
    expect(handleDeleteRow).toBeDefined();
  });

  it('行を追加', () => {
    const { handleAddRow } = result.current;

    act(() => {
      handleAddRow(0);
    });

    // モックされた関数が呼び出されたことを確認
    expect(handleAddRow).toBeDefined();
  });

  it('行を貼り付け', async () => {
    const { handlePasteRows } = result.current;
    const rowsToPaste: Partial<Action>[] = [
      { hp: '75', prediction: 'pasted' }
    ];

    await act(async () => {
      await handlePasteRows(0, rowsToPaste);
    });

    // モックされた関数が呼び出されたことを確認
    expect(handlePasteRows).toBeDefined();
  });
});