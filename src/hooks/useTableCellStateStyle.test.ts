import { renderHook } from '@testing-library/react';
import { useTableCellStateStyle } from './useTableCellStateStyle';

describe('useTableCellStateStyle', () => {
  it('現在の行の場合、適切なクラスを返すこと', () => {
    const { result } = renderHook(() => useTableCellStateStyle());
    const className = result.current.getStateClassName({ isCurrentRow: true });
    expect(className).toContain('bg-accent');
  });

  it('現在の行でない場合、空のクラスを返すこと', () => {
    const { result } = renderHook(() => useTableCellStateStyle());
    const className = result.current.getStateClassName({ isCurrentRow: false });
    expect(className).toBe('');
  });

  describe('getTextVariant', () => {
    it('ヘッダーの場合、defaultを返すこと', () => {
      const { result } = renderHook(() => useTableCellStateStyle());
      const variant = result.current.getTextVariant({ isCurrentRow: false, isHeader: true });
      expect(variant).toBe('default');
    });

    it('現在の行の場合、defaultを返すこと', () => {
      const { result } = renderHook(() => useTableCellStateStyle());
      const variant = result.current.getTextVariant({ isCurrentRow: true, isHeader: false });
      expect(variant).toBe('default');
    });

    it('通常の行の場合、dimmedを返すこと', () => {
      const { result } = renderHook(() => useTableCellStateStyle());
      const variant = result.current.getTextVariant({ isCurrentRow: false, isHeader: false });
      expect(variant).toBe('dimmed');
    });
  });

  it('stateClassesが変更されないこと', () => {
    const { result, rerender } = renderHook(() => useTableCellStateStyle());
    const firstClasses = result.current.stateClasses;
    rerender();
    expect(result.current.stateClasses).toBe(firstClasses);
  });
});