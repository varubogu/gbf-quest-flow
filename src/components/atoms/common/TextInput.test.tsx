import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextInput } from './TextInput';
import { describe, it, expect, afterEach, vi } from 'vitest';

describe('TextInput', () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('正しくレンダリングされる', () => {
    render(<TextInput placeholder="テスト入力" />);

    const input = screen.getByPlaceholderText('テスト入力');
    expect(input).toBeDefined();
    expect(input.tagName).toBe('INPUT');
  });

  it('入力値が正しく反映される', async () => {
    const user = userEvent.setup();
    render(<TextInput placeholder="テスト入力" />);

    const input = screen.getByPlaceholderText('テスト入力') as HTMLInputElement;
    await user.type(input, 'テストテキスト');

    expect(input.value).toBe('テストテキスト');
  });

  it('エラー状態が正しく表示される', () => {
    render(
      <TextInput
        placeholder="テスト入力"
        error={true}
        errorMessage="エラーメッセージ"
      />
    );

    const input = screen.getByPlaceholderText('テスト入力');
    expect(input).toHaveClass('border-destructive');

    const errorMessage = screen.getByText('エラーメッセージ');
    expect(errorMessage).toBeDefined();
    expect(errorMessage).toHaveClass('text-destructive');
  });

  it('rightElementが正しく表示される', () => {
    render(
      <TextInput
        placeholder="テスト入力"
        rightElement={<span data-testid="right-element">アイコン</span>}
      />
    );

    const rightElement = screen.getByTestId('right-element');
    expect(rightElement).toBeDefined();
    expect(rightElement.textContent).toBe('アイコン');
  });

  it('カスタムクラス名が正しく適用される', () => {
    render(<TextInput placeholder="テスト入力" className="custom-class" />);

    const input = screen.getByPlaceholderText('テスト入力');
    expect(input).toHaveClass('custom-class');
  });

  it('disabled状態が正しく適用される', () => {
    render(<TextInput placeholder="テスト入力" disabled />);

    const input = screen.getByPlaceholderText('テスト入力');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:opacity-50');
  });

  it('onChange イベントが正しく発火する', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<TextInput placeholder="テスト入力" onChange={handleChange} />);

    const input = screen.getByPlaceholderText('テスト入力');
    await user.type(input, 'a');

    expect(handleChange).toHaveBeenCalled();
  });
});