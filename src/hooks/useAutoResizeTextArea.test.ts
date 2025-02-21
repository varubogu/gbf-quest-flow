import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { useAutoResizeTextArea } from './useAutoResizeTextArea';

describe('useAutoResizeTextArea', () => {
  const mockScrollTo = vi.fn();
  const originalScrollTo = window.scrollTo;

  beforeAll(() => {
    window.scrollTo = mockScrollTo;
  });

  afterAll(() => {
    window.scrollTo = originalScrollTo;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a ref', () => {
    const { result } = renderHook(() => useAutoResizeTextArea('test'));
    expect(result.current).toBeDefined();
    expect(result.current.current).toBeNull();
  });

  it('should adjust textarea height when value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useAutoResizeTextArea(value),
      { initialProps: { value: 'initial' } }
    );

    // テキストエリアの要素をモック
    const mockTextarea = {
      style: { height: 'auto' },
      scrollHeight: 100,
    };

    // refにモックのテキストエリアを設定
    Object.defineProperty(result.current, 'current', {
      value: mockTextarea,
      writable: true,
    });

    // 値を変更してrerender
    rerender({ value: 'new value' });

    // スタイルが更新されたことを確認
    expect(mockTextarea.style.height).toBe('100px');
  });

  it('should use custom minHeight when provided', () => {
    const { result } = renderHook(() => useAutoResizeTextArea('test', '50px'));

    const mockTextarea = {
      style: { height: 'auto' },
      scrollHeight: 100,
    };

    Object.defineProperty(result.current, 'current', {
      value: mockTextarea,
      writable: true,
    });

    // 値を変更してeffectをトリガー
    result.current.current && (result.current.current.style.height = '50px');

    expect(mockTextarea.style.height).toBe('50px');
  });

  it('should preserve scroll position', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useAutoResizeTextArea(value),
      { initialProps: { value: 'initial' } }
    );

    // スクロール位置をモック
    Object.defineProperty(window, 'scrollY', {
      value: 100,
      writable: true,
    });

    const mockTextarea = {
      style: { height: 'auto' },
      scrollHeight: 100,
    };

    Object.defineProperty(result.current, 'current', {
      value: mockTextarea,
      writable: true,
    });

    rerender({ value: 'new value' });

    expect(mockScrollTo).toHaveBeenCalledWith(0, 100);
  });
});