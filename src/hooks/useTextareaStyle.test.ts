import { renderHook } from '@testing-library/react/pure';
import { useTextareaStyle } from './useTextareaStyle';
import { describe, it, expect } from 'vitest';

describe('useTextareaStyle', () => {
  it('ヘッダーの場合、適切なクラスを返すこと', () => {
    const { result } = renderHook(() => useTextareaStyle());
    const className = result.current.getTextareaClassName({
      isHeader: true,
      alignment: 'left',
    });

    expect(className).toBe('bg-white border-gray-400 resize-none overflow-hidden text-sm leading-normal font-normal text-left w-full p-1 border rounded');
  });

  it('通常セルの場合、適切なクラスを返すこと', () => {
    const { result } = renderHook(() => useTextareaStyle());
    const className = result.current.getTextareaClassName({
      isHeader: false,
      alignment: 'left',
    });

    expect(className).toBe('bg-white border-gray-400 text-sm leading-normal font-normal text-left w-full p-1 border rounded resize-none overflow-hidden whitespace-pre-wrap break-words min-h-[3rem]');
  });

  it('配置に応じたクラスを返すこと', () => {
    const { result } = renderHook(() => useTextareaStyle());

    const alignments = {
      left: 'bg-white border-gray-400 text-sm leading-normal font-normal text-left w-full p-1 border rounded resize-none overflow-hidden whitespace-pre-wrap break-words min-h-[3rem]',
      center: 'bg-white border-gray-400 text-sm leading-normal font-normal text-center w-full p-1 border rounded resize-none overflow-hidden whitespace-pre-wrap break-words min-h-[3rem]',
      right: 'bg-white border-gray-400 text-sm leading-normal font-normal text-right w-full p-1 border rounded resize-none overflow-hidden whitespace-pre-wrap break-words min-h-[3rem]',
    } as const;

    Object.entries(alignments).forEach(([alignment, expected]) => {
      const className = result.current.getTextareaClassName({
        isHeader: false,
        alignment: alignment as 'left' | 'center' | 'right',
      });
      expect(className).toBe(expected);
    });
  });

  it('追加のクラス名が正しく結合されること', () => {
    const { result } = renderHook(() => useTextareaStyle());
    const customClass = 'custom-class';
    const className = result.current.getTextareaClassName({
      isHeader: false,
      alignment: 'left',
      className: customClass,
    });

    expect(className).toBe('bg-white border-gray-400 text-sm leading-normal font-normal text-left w-full p-1 border rounded resize-none overflow-hidden whitespace-pre-wrap break-words min-h-[3rem] custom-class');
  });

  it('クラス名の重複や空文字が含まれていないこと', () => {
    const { result } = renderHook(() => useTextareaStyle());
    const className = result.current.getTextareaClassName({
      isHeader: false,
      alignment: 'left',
    });

    const classArray = className.split(' ');
    expect(classArray.filter(c => c.startsWith('text-')).length).toBe(2); // text-smとtext-alignmentのみ
    expect(classArray.filter(c => c === '').length).toBe(0); // 空文字クラスなし
    expect(new Set(classArray).size).toBe(classArray.length); // 重複なし
  });
});