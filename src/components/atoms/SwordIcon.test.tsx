import { render, screen, fireEvent } from '@testing-library/react';
import { SwordIcon } from './SwordIcon';
import { describe, it, expect, vi } from 'vitest';

describe('SwordIcon', () => {
  it('デフォルトのスタイルで正しくレンダリングされる', () => {
    render(<SwordIcon />);

    const button = screen.getByTitle('編成情報');
    expect(button).toBeDefined();
    expect(button).toHaveClass('p-2', 'hover:bg-gray-100', 'rounded-full', 'transition-colors');
  });

  it('SVGアイコンが正しくレンダリングされる', () => {
    render(<SwordIcon />);

    const svg = screen.getByTitle('編成情報').querySelector('svg');
    expect(svg).toBeDefined();
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
    expect(svg).toHaveClass('text-gray-600');
  });

  it('クリックイベントが正しく動作する', () => {
    const handleClick = vi.fn();
    render(<SwordIcon onClick={handleClick} />);

    const button = screen.getByTitle('編成情報');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('カスタムクラス名が正しく適用される', () => {
    render(<SwordIcon className="custom-class" />);

    const button = screen.getByTitle('編成情報');
    expect(button).toHaveClass('custom-class');
  });

  it('SVGのパスが正しく描画される', () => {
    render(<SwordIcon />);

    const paths = screen.getByTitle('編成情報').querySelectorAll('path');
    expect(paths).toHaveLength(4);

    // 各パスの存在を確認
    expect(paths[0]).toHaveAttribute('d', 'M14.5 17.5L3 6V3h3l11.5 11.5');
    expect(paths[1]).toHaveAttribute('d', 'M13 19l6-6');
    expect(paths[2]).toHaveAttribute('d', 'M16 16l4 4');
    expect(paths[3]).toHaveAttribute('d', 'M19 21l2-2');
  });
});
