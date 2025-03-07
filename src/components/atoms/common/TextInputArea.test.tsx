import { render, screen, cleanup, fireEvent } from '@testing-library/react';
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

  it('入力値が正しく反映される', () => {
    render(<TextInputArea placeholder="テスト入力" />);
    const textarea = screen.getByPlaceholderText('テスト入力') as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: 'テストテキスト\n複数行' } });
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

  it('onChange イベントが正しく発火する', () => {
    const handleChange = vi.fn();
    render(<TextInputArea placeholder="テスト入力" onChange={handleChange} />);

    const textarea = screen.getByPlaceholderText('テスト入力');
    fireEvent.change(textarea, { target: { value: 'a' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('rows属性が正しく適用される', () => {
    render(<TextInputArea placeholder="テスト入力" rows={10} />);

    const textarea = screen.getByPlaceholderText('テスト入力');
    expect(textarea).toHaveAttribute('rows', '10');
  });
});