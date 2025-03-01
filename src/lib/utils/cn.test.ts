import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('単一のクラス名を正しく処理する', () => {
    expect(cn('test-class')).toBe('test-class');
  });

  it('複数のクラス名を正しく結合する', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('条件付きクラス名を正しく処理する', () => {
    expect(cn('base', true && 'included', false && 'excluded')).toBe('base included');
  });

  it('オブジェクト形式のクラス名を正しく処理する', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active');
  });

  it('配列形式のクラス名を正しく処理する', () => {
    expect(cn('base', ['class1', 'class2'])).toBe('base class1 class2');
  });

  it('重複するクラス名を保持する', () => {
    // clsxは重複するクラス名を削除しない
    expect(cn('base base', 'base')).toBe('base base base');
  });

  it('Tailwindのクラス名の衝突を解決する', () => {
    // Tailwindのクラス名の衝突例: p-4（padding）とp-2（padding）
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });

  it('複雑な組み合わせを正しく処理する', () => {
    const isActive = true;
    const isDisabled = false;
    const size = 'large';

    expect(
      cn(
        'base-class',
        isActive && 'active',
        isDisabled && 'disabled',
        `size-${size}`,
        { 'is-visible': true, 'is-hidden': false },
        ['additional-1', 'additional-2']
      )
    ).toBe('base-class active size-large is-visible additional-1 additional-2');
  });
});