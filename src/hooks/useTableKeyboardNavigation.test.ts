import { renderHook } from '@testing-library/react';
import { useTableKeyboardNavigation } from './useTableKeyboardNavigation';
import { fireEvent } from '@testing-library/dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('useTableKeyboardNavigation', () => {
  const mockOnRowSelect = vi.fn();
  const mockData = Array(5).fill({ hp: '', prediction: '', charge: '', guard: '', action: '', note: '' });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('編集モード時はキーボードナビゲーションを無効にする', () => {
    renderHook(() =>
      useTableKeyboardNavigation({
        currentRow: 2,
        data: mockData,
        onRowSelect: mockOnRowSelect,
        isEditMode: true,
      })
    );

    fireEvent.keyDown(document, { key: 'ArrowUp' });
    fireEvent.keyDown(document, { key: 'ArrowDown' });

    expect(mockOnRowSelect).not.toHaveBeenCalled();
  });

  it('上矢印キーで前の行に移動する', () => {
    renderHook(() =>
      useTableKeyboardNavigation({
        currentRow: 2,
        data: mockData,
        onRowSelect: mockOnRowSelect,
        isEditMode: false,
      })
    );

    fireEvent.keyDown(document, { key: 'ArrowUp' });

    expect(mockOnRowSelect).toHaveBeenCalledWith(1);
  });

  it('下矢印キーで次の行に移動する', () => {
    renderHook(() =>
      useTableKeyboardNavigation({
        currentRow: 2,
        data: mockData,
        onRowSelect: mockOnRowSelect,
        isEditMode: false,
      })
    );

    fireEvent.keyDown(document, { key: 'ArrowDown' });

    expect(mockOnRowSelect).toHaveBeenCalledWith(3);
  });

  it('最初の行で上矢印キーを押しても移動しない', () => {
    renderHook(() =>
      useTableKeyboardNavigation({
        currentRow: 0,
        data: mockData,
        onRowSelect: mockOnRowSelect,
        isEditMode: false,
      })
    );

    fireEvent.keyDown(document, { key: 'ArrowUp' });

    expect(mockOnRowSelect).not.toHaveBeenCalled();
  });

  it('最後の行で下矢印キーを押しても移動しない', () => {
    renderHook(() =>
      useTableKeyboardNavigation({
        currentRow: mockData.length - 1,
        data: mockData,
        onRowSelect: mockOnRowSelect,
        isEditMode: false,
      })
    );

    fireEvent.keyDown(document, { key: 'ArrowDown' });

    expect(mockOnRowSelect).not.toHaveBeenCalled();
  });
});