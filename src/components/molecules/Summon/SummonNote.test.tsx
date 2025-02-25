import { render, screen, fireEvent } from '@testing-library/react';
import { SummonNote } from './SummonNote';
import { describe, it, expect, vi } from 'vitest';

// i18nのモック
vi.mock('react-i18next', () => ({
  useTranslation: (): {
    t: (_key: string) => string;
    i18n: {
      changeLanguage: () => void;
      language: string;
    };
  } => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
      language: 'ja',
    },
  }),
}));

describe('SummonNote', () => {
  const defaultProps = {
    note: '主召喚石\n攻撃力60%UP',
    isEditing: false,
    onChange: vi.fn(),
    'aria-label': 'summon.noteLabel',
  };

  it('表示モードで正しくレンダリングされる', () => {
    render(<SummonNote {...defaultProps} />);
    const cell = screen.getByRole('cell');
    const text = screen.getByRole('text');

    expect(cell).toBeInTheDocument();
    expect(text).toHaveTextContent('主召喚石');
    expect(text).toHaveTextContent('攻撃力60%UP');
    expect(text).toHaveAttribute('aria-label', 'summon.noteLabel');
  });

  it('編集モードで正しくレンダリングされる', () => {
    render(<SummonNote {...defaultProps} isEditing={true} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

    expect(textarea).toBeInTheDocument();
    expect(textarea.value).toBe('主召喚石\n攻撃力60%UP');
    expect(textarea).toHaveAttribute('aria-label', 'summon.noteLabel');
    expect(textarea).toHaveAttribute('placeholder', 'summon.noteLabel');
  });

  it('入力値の変更が正しく処理される', () => {
    const handleChange = vi.fn();
    render(<SummonNote {...defaultProps} isEditing={true} onChange={handleChange} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '新しい効果' } });

    expect(handleChange).toHaveBeenCalledWith('新しい効果');
  });

  it('メモ化されたコンポーネントが正しく再レンダリングされる', () => {
    const { rerender } = render(<SummonNote {...defaultProps} />);
    const text = screen.getByRole('text');
    expect(text).toHaveTextContent('主召喚石');

    rerender(<SummonNote {...defaultProps} note="新しい効果" />);
    expect(screen.getByRole('text')).toHaveTextContent('新しい効果');
  });
});