import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HamburgerMenu } from './HamburgerMenu';
import type { JSX } from 'react';

// IconButtonのモック
vi.mock('@/components/atoms/common/IconButton', () => ({
  IconButton: ({ onClick, label }: { onClick: () => void; label: string }): JSX.Element => (
    <button onClick={onClick} aria-label={label} data-testid="mock-icon-button">
      Menu Icon
    </button>
  ),
}));

describe('HamburgerMenu', () => {
  it('IconButtonをレンダリングする', () => {
    const mockOnClick = vi.fn();
    render(<HamburgerMenu onClick={mockOnClick} />);

    const button = screen.getByTestId('mock-icon-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'メニューを開く');
  });

  it('クリック時にonClickコールバックを呼び出す', () => {
    const mockOnClick = vi.fn();
    render(<HamburgerMenu onClick={mockOnClick} />);

    const button = screen.getByTestId('mock-icon-button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});