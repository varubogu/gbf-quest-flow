import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTableData } from './useTableData';
import type { Action } from '@/types/models';

describe('useTableData', () => {
  const mockInitialData: Action[] = [
    { hp: '100', prediction: '', charge: '', guard: '', action: 'アクション1', note: '' },
    { hp: '200', prediction: '', charge: '', guard: '', action: 'アクション2', note: '' },
  ];

  const mockOnDataChange = vi.fn();

  beforeEach(() => {
    mockOnDataChange.mockClear();
  });

  it('初期データが正しく設定されること', () => {
    const { result } = renderHook(() =>
      useTableData({ initialData: mockInitialData })
    );

    expect(result.current.data).toEqual(mockInitialData);
  });

  it('行を追加できること', () => {
    const { result } = renderHook(() =>
      useTableData({ initialData: mockInitialData, onDataChange: mockOnDataChange })
    );

    act(() => {
      result.current.addRow(0);
    });

    expect(result.current.data).toHaveLength(3);
    expect(mockOnDataChange).toHaveBeenCalled();
  });

  it('行を削除できること', () => {
    const { result } = renderHook(() =>
      useTableData({ initialData: mockInitialData, onDataChange: mockOnDataChange })
    );

    act(() => {
      result.current.deleteRow(0);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0]).toEqual(mockInitialData[1]);
    expect(mockOnDataChange).toHaveBeenCalled();
  });

  it('行を更新できること', () => {
    const { result } = renderHook(() =>
      useTableData({ initialData: mockInitialData, onDataChange: mockOnDataChange })
    );

    const updatedAction = 'アクション1更新';
    act(() => {
      result.current.updateRow(0, { action: updatedAction });
    });

    const updatedData = result.current.data[0];
    expect(updatedData?.action).toBe(updatedAction);
    expect(mockOnDataChange).toHaveBeenCalled();
  });

  it('無効なインデックスの操作は失敗すること', () => {
    const { result } = renderHook(() =>
      useTableData({ initialData: mockInitialData, onDataChange: mockOnDataChange })
    );

    act(() => {
      const deleteResult = result.current.deleteRow(-1);
      expect(deleteResult).toBe(false);
    });

    act(() => {
      const updateResult = result.current.updateRow(-1, { action: 'test' });
      expect(updateResult).toBe(false);
    });

    expect(mockOnDataChange).not.toHaveBeenCalled();
  });
});