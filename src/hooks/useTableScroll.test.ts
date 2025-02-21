import { renderHook } from '@testing-library/react';
import { useTableScroll } from './useTableScroll';
import { fireEvent } from '@testing-library/dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Action } from '@/types/models';

describe('useTableScroll', () => {
  const mockOnRowSelect = vi.fn();
  const mockSingleAction: Action = { hp: '', prediction: '', charge: '', guard: '', action: '', note: '' };
  const mockData: Action[] = Array(5).fill(mockSingleAction);

  const mockContainer = document.createElement('div');
  const mockTarget = document.createElement('div');
  mockTarget.id = 'action-row-2';

  // スクロール位置計算のためのモック
  const mockContainerRect = {
    top: 100,
    height: 500,
  };
  const mockTargetRect = {
    top: 300,
    height: 50,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
    document.body.appendChild(mockContainer);
    document.body.appendChild(mockTarget);

    // getBoundingClientRectのモック
    mockContainer.getBoundingClientRect = vi.fn().mockReturnValue(mockContainerRect);
    mockTarget.getBoundingClientRect = vi.fn().mockReturnValue(mockTargetRect);

    // scrollToのモック
    mockContainer.scrollTo = vi.fn();
  });

  it('編集モード時はスクロール制御を無効にする', () => {
    const containerRef = { current: mockContainer };
    renderHook(() =>
      useTableScroll({
        containerRef,
        currentRow: 2,
        data: mockData,
        onRowSelect: mockOnRowSelect,
        isEditMode: true,
      })
    );

    fireEvent.wheel(mockContainer, { deltaY: 100, deltaMode: 1 });

    expect(mockOnRowSelect).not.toHaveBeenCalled();
  });

  it('マウスホイールで下にスクロールすると次の行に移動する', () => {
    const containerRef = { current: mockContainer };
    renderHook(() =>
      useTableScroll({
        containerRef,
        currentRow: 2,
        data: mockData,
        onRowSelect: mockOnRowSelect,
        isEditMode: false,
      })
    );

    fireEvent.wheel(mockContainer, { deltaY: 100, deltaMode: 1 });

    expect(mockOnRowSelect).toHaveBeenCalledWith(3);
  });

  it('マウスホイールで上にスクロールすると前の行に移動する', () => {
    const containerRef = { current: mockContainer };
    renderHook(() =>
      useTableScroll({
        containerRef,
        currentRow: 2,
        data: mockData,
        onRowSelect: mockOnRowSelect,
        isEditMode: false,
      })
    );

    fireEvent.wheel(mockContainer, { deltaY: -100, deltaMode: 1 });

    expect(mockOnRowSelect).toHaveBeenCalledWith(1);
  });

  it('行が選択されると自動的にその行が表示される位置までスクロールする', () => {
    const containerRef = { current: mockContainer };
    renderHook(() =>
      useTableScroll({
        containerRef,
        currentRow: 2,
        data: mockData,
        onRowSelect: mockOnRowSelect,
        isEditMode: false,
      })
    );

    // スクロール位置の計算が正しく行われ、scrollToが呼ばれることを確認
    expect(mockContainer.scrollTo).toHaveBeenCalledWith({
      top: expect.any(Number),
      behavior: 'smooth',
    });
  });
});