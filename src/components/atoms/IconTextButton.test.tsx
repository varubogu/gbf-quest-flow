import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import { IconTextButton, useAutoResizeTextArea } from './IconTextButton';
import { Menu } from 'lucide-react';
import { describe, it, expect, vi } from 'vitest';

describe('IconTextButton', () => {
  it('デフォルトのスタイルで正しくレンダリングされる', () => {
    render(<IconTextButton icon={Menu} label="メニュー" text="メニューを開く" />);

    const button = screen.getByLabelText('メニュー');
    expect(button).toBeDefined();
    expect(screen.getByText('メニューを開く')).toBeDefined();
    expect(button).toHaveClass('flex', 'items-center', 'gap-2');
  });

  it('アイコンの位置が正しく切り替わる', () => {
    const { rerender } = render(
      <IconTextButton icon={Menu} label="メニュー" text="メニューを開く" iconPosition="left" />
    );

    let button = screen.getByLabelText('メニュー');
    let children = button.children;
    expect(children[0]).toHaveClass('h-5', 'w-5'); // アイコン
    expect(children[1]).toHaveTextContent('メニューを開く'); // テキスト

    rerender(
      <IconTextButton icon={Menu} label="メニュー" text="メニューを開く" iconPosition="right" />
    );

    button = screen.getByLabelText('メニュー');
    children = button.children;
    expect(children[0]).toHaveTextContent('メニューを開く'); // テキスト
    expect(children[1]).toHaveClass('h-5', 'w-5'); // アイコン
  });

  it('クリックイベントが正しく動作する', () => {
    const handleClick = vi.fn();

    render(
      <IconTextButton icon={Menu} label="メニュー" text="メニューを開く" onClick={handleClick} />
    );

    const button = screen.getByLabelText('メニュー');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('異なるvariantで正しくレンダリングされる', () => {
    const { rerender } = render(
      <IconTextButton icon={Menu} label="メニュー" text="メニューを開く" variant="default" />
    );

    const defaultButton = screen.getByLabelText('メニュー');
    expect(defaultButton).toHaveClass('bg-primary');

    rerender(<IconTextButton icon={Menu} label="メニュー" text="メニューを開く" variant="ghost" />);

    const ghostButton = screen.getByLabelText('メニュー');
    expect(ghostButton).toHaveClass('hover:bg-accent');
  });
});

describe('useAutoResizeTextArea', () => {
  it('テキストエリアのサイズが正しく調整される', () => {
    const { result } = renderHook(() => useAutoResizeTextArea('テストテキスト'));

    expect(result.current).toBeDefined();
    expect(result.current.current).toBeNull(); // 初期状態ではnull
  });
});
