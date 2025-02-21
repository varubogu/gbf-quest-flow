import { render, screen, fireEvent } from '@testing-library/react';
import { SummonIcon } from './SummonIcon';
import { describe, it, expect, vi } from 'vitest';

// i18nのモック
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('SummonIcon', () => {
  const defaultProps = {
    name: 'バハムート',
    isEditing: false,
    onChange: () => {},
    'aria-label': 'summon.nameLabel',
  };

  it('表示モードで正しくレンダリングされる', () => {
    render(<SummonIcon {...defaultProps} />);
    const cell = screen.getByRole('cell');
    const text = screen.getByRole('text');

    expect(cell).toBeInTheDocument();
    expect(text).toHaveTextContent('バハムート');
    expect(text).toHaveAttribute('aria-label', 'summon.nameLabel');
  });

  it('編集モードで正しくレンダリングされる', () => {
    render(<SummonIcon {...defaultProps} isEditing={true} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(input.value).toBe('バハムート');
    expect(input).toHaveAttribute('aria-label', 'summon.nameLabel');
    expect(input).toHaveAttribute('placeholder', 'summon.nameLabel');
  });

  it('入力値の変更が正しく処理される', () => {
    const handleChange = vi.fn();
    render(<SummonIcon {...defaultProps} isEditing={true} onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'ルシフェル' } });

    expect(handleChange).toHaveBeenCalledWith('ルシフェル');
  });

  it('メモ化されたコンポーネントが正しく再レンダリングされる', () => {
    const { rerender } = render(<SummonIcon {...defaultProps} />);
    const text = screen.getByRole('text');
    expect(text).toHaveTextContent('バハムート');

    rerender(<SummonIcon {...defaultProps} name="ルシフェル" />);
    expect(screen.getByRole('text')).toHaveTextContent('ルシフェル');
  });
});