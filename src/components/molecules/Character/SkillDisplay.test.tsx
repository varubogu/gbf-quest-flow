import { render, screen, fireEvent } from '@testing-library/react';
import { SkillDisplay } from './SkillDisplay';
import { describe, it, expect, vi } from 'vitest';

describe('SkillDisplay', () => {
  const multilineText = `1行目
2行目
3行目`;

  it('表示モードで正しくレンダリングされる', () => {
    const { container } = render(
      <SkillDisplay text={multilineText} isEditing={false} onChange={() => {}} />
    );

    // tdタグ内のテキストコンテンツ全体を確認
    const td = container.querySelector('td');
    expect(td).toHaveTextContent('1行目');
    expect(td).toHaveTextContent('2行目');
    expect(td).toHaveTextContent('3行目');

    // 改行要素の存在を確認
    const brElements = container.getElementsByTagName('br');
    expect(brElements).toHaveLength(2); // 3行なので改行は2つ
  });

  it('編集モードで正しくレンダリングされる', () => {
    render(<SkillDisplay text={multilineText} isEditing={true} onChange={() => {}} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();
    expect(textarea.value).toBe(multilineText);
  });

  it('入力値の変更が正しく処理される', () => {
    const handleChange = vi.fn();
    render(<SkillDisplay text="テスト" isEditing={true} onChange={handleChange} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '新しいテスト' } });

    expect(handleChange).toHaveBeenCalledWith('新しいテスト');
  });
});