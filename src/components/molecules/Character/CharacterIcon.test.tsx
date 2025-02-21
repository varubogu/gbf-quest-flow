import { render, screen, fireEvent } from '@testing-library/react';
import { CharacterIcon } from './CharacterIcon';
import { describe, it, expect, vi } from 'vitest';

describe('CharacterIcon', () => {
  it('表示モードで正しくレンダリングされる', () => {
    render(<CharacterIcon name="グラン" isEditing={false} onChange={() => {}} />);
    expect(screen.getByText('グラン')).toBeInTheDocument();
  });

  it('編集モードで正しくレンダリングされる', () => {
    render(<CharacterIcon name="グラン" isEditing={true} onChange={() => {}} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('グラン');
  });

  it('入力値の変更が正しく処理される', () => {
    const handleChange = vi.fn();
    render(<CharacterIcon name="グラン" isEditing={true} onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'ジータ' } });

    expect(handleChange).toHaveBeenCalledWith('ジータ');
  });
});