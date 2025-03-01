import { screen, fireEvent } from '@testing-library/react';
import { SkillDisplay } from './SkillDisplay';
import { describe, it, expect, vi } from 'vitest';
import { renderTableCell } from '@/test/table-test-utils';

describe('SkillDisplay', () => {
  const multilineText = `1行目
2行目
3行目`;

  const defaultProps = {
    text: multilineText,
    isEditing: false,
    onChange: vi.fn(),
    'aria-label': 'スキル説明',
  };

  it('表示モードで正しくレンダリングされる', () => {
    const { container } = renderTableCell(<SkillDisplay {...defaultProps} />);

    const cell = screen.getByRole('cell');
    const text = screen.getByRole('text');
    expect(cell).toBeInTheDocument();
    expect(text).toHaveAttribute('aria-label', 'スキル説明');

    // テキストコンテンツの確認
    const td = container.querySelector('td');
    expect(td).toHaveTextContent('1行目');
    expect(td).toHaveTextContent('2行目');
    expect(td).toHaveTextContent('3行目');

    // 改行要素の確認
    const brElements = container.getElementsByTagName('br');
    expect(brElements).toHaveLength(2);
  });

  it('編集モードで正しくレンダリングされる', () => {
    renderTableCell(<SkillDisplay {...defaultProps} isEditing={true} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

    expect(textarea).toBeInTheDocument();
    expect(textarea.value).toBe(multilineText);
    expect(textarea).toHaveAttribute('aria-label', 'スキル説明');
  });

  it('入力値の変更が正しく処理される', () => {
    const handleChange = vi.fn();
    renderTableCell(<SkillDisplay {...defaultProps} isEditing={true} onChange={handleChange} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '新しいテスト' } });

    expect(handleChange).toHaveBeenCalledWith('新しいテスト');
  });

  it('メモ化されたコンポーネントが正しく再レンダリングされる', () => {
    const { rerender } = renderTableCell(<SkillDisplay {...defaultProps} />);
    const initialText = screen.getByRole('text');
    expect(initialText).toHaveTextContent('1行目');

    const newText = '新しいテキスト';
    rerender(
      <table>
        <tbody>
          <tr>
            <SkillDisplay {...defaultProps} text={newText} />
          </tr>
        </tbody>
      </table>
    );
    const updatedText = screen.getByRole('text');
    expect(updatedText).toHaveTextContent(newText);
  });
});