import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useActionTableState } from './useActionTableState';
import type { Action } from '@/types/models';

describe('useActionTableState', () => {
  const mockInitialData: Action[] = [
    { hp: '100', prediction: '', charge: '', guard: '', action: 'アクション1', note: '' },
    { hp: '200', prediction: '', charge: '', guard: '', action: 'アクション2', note: '' },
  ];

  const mockOnDataChange = vi.fn();
  const mockOnRowSelect = vi.fn();

  beforeEach(() => {
    mockOnDataChange.mockClear();
    mockOnRowSelect.mockClear();
  });

  it('初期状態が正しく設定されること', () => {
    const { result } = renderHook(() =>
      useActionTableState({
        initialData: mockInitialData,
        isEditMode: false,
        onDataChange: mockOnDataChange,
        onRowSelect: mockOnRowSelect,
      })
    );

    expect(result.current.data).toEqual(mockInitialData);
    expect(result.current.currentRow).toBe(0);
    expect(result.current.editMode).toBe(false);
  });

  it('編集モードでない場合、編集関連の関数がundefinedになること', () => {
    const { result } = renderHook(() =>
      useActionTableState({
        initialData: mockInitialData,
        isEditMode: false,
      })
    );

    expect(result.current.addRow).toBeUndefined();
    expect(result.current.deleteRow).toBeUndefined();
    expect(result.current.updateRow).toBeUndefined();
  });

  it('編集モードの場合、編集関連の関数が利用可能になること', () => {
    const { result } = renderHook(() =>
      useActionTableState({
        initialData: mockInitialData,
        isEditMode: true,
      })
    );

    expect(result.current.addRow).toBeDefined();
    expect(result.current.deleteRow).toBeDefined();
    expect(result.current.updateRow).toBeDefined();
  });

  it('isEditModeの変更が反映されること', () => {
    const { result, rerender } = renderHook(
      ({ isEditMode }) =>
        useActionTableState({
          initialData: mockInitialData,
          isEditMode,
        }),
      {
        initialProps: { isEditMode: false },
      }
    );

    expect(result.current.editMode).toBe(false);

    rerender({ isEditMode: true });

    expect(result.current.editMode).toBe(true);
  });
});