import { renderHook } from '@testing-library/react';
import { useAlignmentStyle } from './useAlignmentStyle';

describe('useAlignmentStyle', () => {
  it('デフォルトで左揃えのクラスを返すこと', () => {
    const { result } = renderHook(() => useAlignmentStyle());
    expect(result.current.getAlignmentClass()).toBe('text-left');
  });

  it('指定された配置に応じたクラスを返すこと', () => {
    const { result } = renderHook(() => useAlignmentStyle());
    expect(result.current.getAlignmentClass('left')).toBe('text-left');
    expect(result.current.getAlignmentClass('center')).toBe('text-center');
    expect(result.current.getAlignmentClass('right')).toBe('text-right');
  });

  it('alignmentClassesが変更されないこと', () => {
    const { result, rerender } = renderHook(() => useAlignmentStyle());
    const firstClasses = result.current.alignmentClasses;
    rerender();
    expect(result.current.alignmentClasses).toBe(firstClasses);
  });
});