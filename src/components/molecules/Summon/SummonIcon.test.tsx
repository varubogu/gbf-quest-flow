import { screen, fireEvent } from '@testing-library/react';
import { SummonIcon } from './SummonIcon';
import { describe, it, expect, vi } from 'vitest';
import { renderTableCell } from '@/test/table-test-utils';

interface UseTranslationResult {
  t: (_key: string) => string;
}

// i18nのモック
vi.mock('react-i18next', () => ({
  useTranslation: (): UseTranslationResult => ({
    t: (key: string): string => key,
  }),
}));

describe('SummonIcon', () => {
  const defaultProps = {
    name: 'バハムート',
    isEditing: false,
    onChange: vi.fn(),
    'aria-label': 'summon.nameLabel',
  };

  it('表示モードで正しくレンダリングされる', () => {
    renderTableCell(<SummonIcon {...defaultProps} />);
    const cell = screen.getByRole('cell');
    const text = screen.getByRole('text');

    expect(cell).toBeInTheDocument();
    expect(text).toHaveTextContent('バハムート');
    expect(text).toHaveAttribute('aria-label', 'summon.nameLabel');
  });

  it('編集モードで正しくレンダリングされる', () => {
    renderTableCell(<SummonIcon {...defaultProps} isEditing={true} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(input.value).toBe('バハムート');
    expect(input).toHaveAttribute('aria-label', 'summon.nameLabel');
    expect(input).toHaveAttribute('placeholder', 'summon.nameLabel');
  });

  it('入力値の変更が正しく処理される', () => {
    const handleChange = vi.fn();
    renderTableCell(<SummonIcon {...defaultProps} isEditing={true} onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'ルシフェル' } });

    expect(handleChange).toHaveBeenCalledWith('ルシフェル');
  });

  it('メモ化されたコンポーネントが正しく再レンダリングされる', () => {
    const { rerender } = renderTableCell(<SummonIcon {...defaultProps} />);
    const text = screen.getByRole('text');
    expect(text).toHaveTextContent('バハムート');

    rerender(
      <table>
        <tbody>
          <tr>
            <SummonIcon {...defaultProps} name="ルシフェル" />
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByRole('text')).toHaveTextContent('ルシフェル');
  });
});