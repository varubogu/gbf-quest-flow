import { renderHook, act } from '@testing-library/react';
import { useSheetAnimation } from './useSheetAnimation';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';

describe('useSheetAnimation', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('シートを開く時のアニメーション状態を正しく制御する', () => {
    const { result } = renderHook(() =>
      useSheetAnimation({
        open: true,
        side: 'left',
      })
    );

    // 初期状態
    expect(result.current.isVisible).toBe(true);
    expect(result.current.animateIn).toBe(false);

    // アニメーション開始
    act(() => {
      vi.advanceTimersByTime(20);
    });

    expect(result.current.animateIn).toBe(true);
  });

  it('シートを閉じる時のアニメーション状態を正しく制御する', () => {
    const { result, rerender } = renderHook(
      ({ open }) =>
        useSheetAnimation({
          open,
          side: 'left',
        }),
      {
        initialProps: { open: true },
      }
    );

    // 開いた状態から始める
    act(() => {
      vi.advanceTimersByTime(20);
    });

    // 閉じる
    rerender({ open: false });

    // アニメーション開始直後
    expect(result.current.isVisible).toBe(true);
    expect(result.current.animateIn).toBe(false);

    // アニメーション終了
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.isVisible).toBe(false);
  });

  it('左側のシートに適切なクラスを適用する', () => {
    const { result } = renderHook(() =>
      useSheetAnimation({
        open: true,
        side: 'left',
      })
    );

    expect(result.current.sheetClasses).toContain('left-0');
    expect(result.current.sheetClasses).toContain('-translate-x-full');

    act(() => {
      vi.advanceTimersByTime(20);
    });

    expect(result.current.sheetClasses).toContain('translate-x-0');
  });

  it('右側のシートに適切なクラスを適用する', () => {
    const { result } = renderHook(() =>
      useSheetAnimation({
        open: true,
        side: 'right',
      })
    );

    expect(result.current.sheetClasses).toContain('right-0');
    expect(result.current.sheetClasses).toContain('translate-x-full');

    act(() => {
      vi.advanceTimersByTime(20);
    });

    expect(result.current.sheetClasses).toContain('translate-x-0');
  });

  it('オーバーレイの透明度を適切に制御する', () => {
    const { result } = renderHook(() =>
      useSheetAnimation({
        open: true,
        side: 'left',
      })
    );

    expect(result.current.overlayClasses).toContain('opacity-50');

    const { result: closedResult } = renderHook(() =>
      useSheetAnimation({
        open: false,
        side: 'left',
      })
    );

    expect(closedResult.current.overlayClasses).toContain('opacity-0');
  });
});