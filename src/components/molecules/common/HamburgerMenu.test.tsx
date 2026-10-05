import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HamburgerMenu } from './HamburgerMenu';

describe('HamburgerMenu', () => {
  it('背景色付きのメニューボタンをレンダリングする', () => {
    const mockOnClick = vi.fn();
    render(<HamburgerMenu onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: 'メニューを開く' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('text-primary-foreground');
  });

  it('クリック時にonClickコールバックを呼び出す', () => {
    const mockOnClick = vi.fn();
    render(<HamburgerMenu onClick={mockOnClick} />);

    fireEvent.click(screen.getByRole('button', { name: 'メニューを開く' }));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
