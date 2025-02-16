import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';
import { describe, it, expect, vi } from 'vitest';

describe('Button', () => {
  it('デフォルトのスタイルで正しくレンダリングされる', () => {
    render(<Button>テストボタン</Button>);

    const button = screen.getByText('テストボタン');
    expect(button).toBeDefined();
    expect(button).toHaveClass('bg-primary');
  });

  it('各variantで正しくレンダリングされる', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;

    variants.forEach((variant, index: number) => {
      render(<Button variant={variant}>テストボタン{index}</Button>);
      const button = screen.getByText(`テストボタン${index}`);

      switch (variant) {
        case 'default':
          expect(button).toHaveClass('bg-primary');
          break;
        case 'destructive':
          expect(button).toHaveClass('bg-destructive');
          break;
        case 'outline':
          expect(button).toHaveClass('border-input');
          break;
        case 'secondary':
          expect(button).toHaveClass('bg-secondary');
          break;
        case 'ghost':
          expect(button).toHaveClass('hover:bg-accent');
          break;
        case 'link':
          expect(button).toHaveClass('text-primary');
          break;
      }
    });
  });

  it('各サイズで正しくレンダリングされる', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const;

    sizes.forEach((size, index: number) => {
      render(<Button size={size}>テストボタン{index}</Button>);
      const button = screen.getByText(`テストボタン${index}`);

      switch (size) {
        case 'default':
          expect(button).toHaveClass('h-9 px-4 py-2');
          break;
        case 'sm':
          expect(button).toHaveClass('h-8');
          break;
        case 'lg':
          expect(button).toHaveClass('h-10');
          break;
        case 'icon':
          expect(button).toHaveClass('h-9 w-9');
          break;
      }
    });
  });

  it('クリックイベントが正しく動作する', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>テストボタン</Button>);

    const button = screen.getByText('テストボタン');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('無効状態で正しく表示される', () => {
    render(<Button disabled>テストボタン</Button>);

    const button = screen.getByText('テストボタン');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('カスタムクラス名が正しく適用される', () => {
    render(<Button className="custom-class">テストボタン</Button>);

    const button = screen.getByText('テストボタン');
    expect(button).toHaveClass('custom-class');
  });
});
