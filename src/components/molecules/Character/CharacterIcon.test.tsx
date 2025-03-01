import { screen, fireEvent } from '@testing-library/react';
import { CharacterIcon } from './CharacterIcon';
import { describe, it, expect, vi } from 'vitest';
import { renderTableCell } from '@/test/table-test-utils';

describe('CharacterIcon', () => {
  const defaultProps = {
    name: 'グラン',
    isEditing: false,
    onChange: vi.fn(),
    'aria-label': 'キャラクター名',
  };

  it('表示モードで正しくレンダリングされる', () => {
    renderTableCell(<CharacterIcon {...defaultProps} />);
    const cell = screen.getByRole('cell');
    const text = screen.getByRole('text');

    expect(cell).toBeInTheDocument();
    expect(text).toHaveTextContent('グラン');
    expect(text).toHaveAttribute('aria-label', 'キャラクター名');
  });

  it('編集モードで正しくレンダリングされる', () => {
    renderTableCell(<CharacterIcon {...defaultProps} isEditing={true} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(input.value).toBe('グラン');
    expect(input).toHaveAttribute('aria-label', 'キャラクター名');
  });

  it('入力値の変更が正しく処理される', () => {
    const handleChange = vi.fn();
    renderTableCell(<CharacterIcon {...defaultProps} isEditing={true} onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'ジータ' } });

    expect(handleChange).toHaveBeenCalledWith('ジータ');
  });

  it('メモ化されたコンポーネントが正しく再レンダリングされる', () => {
    const { rerender } = renderTableCell(<CharacterIcon {...defaultProps} />);
    expect(screen.getByText('グラン')).toBeInTheDocument();

    // プロパティを変更して再レンダリング
    rerender(
      <table>
        <tbody>
          <tr>
            <CharacterIcon {...defaultProps} name="ジータ" />
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByText('ジータ')).toBeInTheDocument();
  });
});