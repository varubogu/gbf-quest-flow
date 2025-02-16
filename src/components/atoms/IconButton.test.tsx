import { render, screen, fireEvent } from '@testing-library/react';
import { IconButton } from './IconButton';
import { Menu } from 'lucide-react';
import { describe, it, expect, vi } from 'vitest';

describe('IconButton', () => {
  it('正しくレンダリングされる', () => {
    render(<IconButton icon={Menu} label="メニュー" aria-label="メニュー" />);

    const button = screen.getByLabelText('メニュー');
    expect(button).toBeDefined();
  });

  it('クリックイベントが正しく動作する', () => {
    const handleClick = vi.fn();

    render(<IconButton icon={Menu} label="メニュー" onClick={handleClick} />);

    const button = screen.getByLabelText('メニュー');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('異なるvariantで正しくレンダリングされる', () => {
    const { rerender } = render(<IconButton icon={Menu} label="メニュー" variant="default" />);

    const defaultButton = screen.getByLabelText('メニュー');
    expect(defaultButton).toHaveClass('bg-primary');

    rerender(<IconButton icon={Menu} label="メニュー" variant="ghost" />);

    const ghostButton = screen.getByLabelText('メニュー');
    expect(ghostButton).toHaveClass('hover:bg-accent');
  });

  it('無効状態で正しく表示される', () => {
    render(<IconButton icon={Menu} label="メニュー" disabled />);

    const button = screen.getByLabelText('メニュー');
    expect(button).toBeDisabled();
  });
});
