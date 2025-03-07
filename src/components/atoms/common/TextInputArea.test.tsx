import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextInputArea } from './TextInputArea';
import { describe, it, expect, afterEach, vi } from 'vitest';

describe('TextInputArea', () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('正しくレンダリングされる', () => {
    render(<TextInputArea placeholder="テスト入力" />);

    const textarea = screen.getByPlaceholderText('テスト入力');
    expect(textarea).toBeDefined();
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('入力値が正しく反映される', async () => {
    const user = userEvent.setup();
    render(<TextInputArea placeholder="テスト入力" />);

    const textarea = screen.getByPlaceholderText('テスト入力') as HTMLTextAreaElement;
    await user.type(textarea, 'テストテキスト\n複数行');

    expect(textarea.value).toBe('テストテキスト\n複数行');
  });

  it('エラー状態が正しく表示される', () => {
    render(
      <TextInputArea
        placeholder="テスト入力"
        error={true}
        errorMessage="エラーメッセージ"
      />
    );

    const textarea = screen.getByPlaceholderText('テスト入力');
    expect(textarea).toHaveClass('border-destructive');

    const errorMessage = screen.getByText('エラーメッセージ');
    expect(errorMessage).toBeDefined();
    expect(errorMessage).toHaveClass('text-destructive');
  });

  it('カスタムクラス名が正しく適用される', () => {
    render(<TextInputArea placeholder="テスト入力" className="custom-class" />);

    const textarea = screen.getByPlaceholderText('テスト入力');
    expect(textarea).toHaveClass('custom-class');
  });

  it('disabled状態が正しく適用される', () => {
    render(<TextInputArea placeholder="テスト入力" disabled />);

    const textarea = screen.getByPlaceholderText('テスト入力');
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass('disabled:opacity-50');
  });

  it('リサイズが可能である', () => {
    render(<TextInputArea placeholder="テスト入力" />);

    const textarea = screen.getByPlaceholderText('テスト入力');
    expect(textarea).toHaveClass('resize-vertical');
  });

  it('onChange イベントが正しく発火する', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<TextInputArea placeholder="テスト入力" onChange={handleChange} />);

    const textarea = screen.getByPlaceholderText('テスト入力');
    await user.type(textarea, 'a');

    expect(handleChange).toHaveBeenCalled();
  });

  it('rows属性が正しく適用される', () => {
    render(<TextInputArea placeholder="テスト入力" rows={10} />);

    const textarea = screen.getByPlaceholderText('テスト入力');
    expect(textarea).toHaveAttribute('rows', '10');
  });
});