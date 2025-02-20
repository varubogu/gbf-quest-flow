import { renderHook } from '@testing-library/react/pure';
import { useTableCellBaseStyle } from './useTableCellBaseStyle';
import { describe, it, expect, vi } from 'vitest';

// モックの設定
vi.mock('@/stores/settingsStore', () => ({
  default: () => ({
    settings: {
      tablePadding: 8,
    },
  }),
}));

describe('useTableCellBaseStyle', () => {
  it('ヘッダーセルの場合、適切なクラスを返すこと', () => {
    const { result } = renderHook(() => useTableCellBaseStyle());
    const className = result.current.getBaseClassName({ isHeader: true });
    expect(className).toContain('border-b border-r border-gray-400');
    expect(className).toContain('bg-green-300 font-medium');
    expect(className).not.toContain('cursor-text');
  });

  it('通常セルの場合、適切なクラスを返すこと', () => {
    const { result } = renderHook(() => useTableCellBaseStyle());
    const className = result.current.getBaseClassName({ isHeader: false });
    expect(className).toContain('border-b border-r border-gray-400');
    expect(className).toContain('bg-background');
    expect(className).toContain('cursor-text');
  });

  it('追加のクラス名が正しく結合されること', () => {
    const { result } = renderHook(() => useTableCellBaseStyle());
    const className = result.current.getBaseClassName({ isHeader: false, className: 'custom-class' });
    expect(className).toContain('custom-class');
  });

  it('パディングの設定が正しく反映されること', () => {
    const { result } = renderHook(() => useTableCellBaseStyle());
    const padding = result.current.getBasePadding();
    expect(padding).toEqual({
      paddingTop: '8px',
      paddingBottom: '8px',
      paddingLeft: '8px',
      paddingRight: '8px',
    });
  });

  it('baseClassesが変更されないこと', () => {
    const { result, rerender } = renderHook(() => useTableCellBaseStyle());
    const firstClasses = result.current.baseClasses;
    rerender();
    expect(result.current.baseClasses).toBe(firstClasses);
  });
});