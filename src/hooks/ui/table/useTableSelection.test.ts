import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTableSelection } from './useTableSelection';

describe('useTableSelection', () => {
  const mockOnRowSelect = vi.fn();

  beforeEach(() => {
    mockOnRowSelect.mockClear();
  });

  it('初期状態で-1が設定されること', () => {
    const { result } = renderHook(() =>
      useTableSelection({
        totalRows: 5,
        isEditMode: false,
        onRowSelect: mockOnRowSelect,
      })
    );

    expect(result.current.currentRow).toBe(0);
  });

  it('編集モードでない場合に行を選択できること', () => {
    const { result } = renderHook(() =>
      useTableSelection({
        totalRows: 5,
        isEditMode: false,
        onRowSelect: mockOnRowSelect,
      })
    );

    act((): void => {
      result.current.selectRow(2);
    });

    expect(result.current.currentRow).toBe(2);
    expect(mockOnRowSelect).toHaveBeenCalledWith(2);
  });

  it('編集モードの場合に行を選択できないこと', () => {
    const { result } = renderHook(() =>
      useTableSelection({
        totalRows: 5,
        isEditMode: true,
        onRowSelect: mockOnRowSelect,
      })
    );

    act((): void => {
      const selectResult = result.current.selectRow(2);
      expect(selectResult).toBe(false);
    });

    expect(result.current.currentRow).toBe(-1);
    expect(mockOnRowSelect).not.toHaveBeenCalled();
  });

  it('範囲外のインデックスを選択できないこと', () => {
    const { result } = renderHook(() =>
      useTableSelection({
        totalRows: 5,
        isEditMode: false,
        onRowSelect: mockOnRowSelect,
      })
    );

    act((): void => {
      const selectResult = result.current.selectRow(-1);
      expect(selectResult).toBe(false);
    });

    expect(result.current.currentRow).toBe(0);
    expect(mockOnRowSelect).toHaveBeenCalled();
  });

  it('編集モード終了時に最初の行が選択されること', () => {
    const { result, rerender } = renderHook(
      ({ isEditMode }) =>
        useTableSelection({
          totalRows: 5,
          isEditMode,
          onRowSelect: mockOnRowSelect,
        }),
      {
        initialProps: { isEditMode: true },
      }
    );

    expect(result.current.currentRow).toBe(-1);

    rerender({ isEditMode: false });

    expect(result.current.currentRow).toBe(0);
    expect(mockOnRowSelect).toHaveBeenCalledWith(0);
  });
});