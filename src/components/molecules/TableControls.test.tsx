import { render, screen } from '@testing-library/react';
import { TableControls } from '@/components/molecules/TableControls';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import type { JSX } from 'react';

interface UseTranslationResult {
  t: (_key: string) => string;
}

// react-i18nextのモック
vi.mock('react-i18next', () => ({
  useTranslation: (): UseTranslationResult => ({
    t: (key: string): string => {
      const translations = {
        moveUp: '上へ移動',
        moveDown: '下へ移動',
      };
      return translations[key as keyof typeof translations] || key;
    },
  }),
}));

// IconButtonのモック
vi.mock('../atoms/IconButton', () => ({
  IconButton: ({ label, onClick, disabled }: { label: string, onClick: () => void, disabled: boolean }): JSX.Element => (
    <button
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  ),
}));

describe('TableControls', () => {
  const mockOnMoveUp = vi.fn();
  const mockOnMoveDown = vi.fn();

  it('正しくボタンが表示される', () => {
    render(
      <TableControls
        buttonPosition="left"
        currentRow={1}
        totalRows={3}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );

    const upButton = screen.getByLabelText('上へ移動');
    const downButton = screen.getByLabelText('下へ移動');

    expect(upButton).toBeInTheDocument();
    expect(downButton).toBeInTheDocument();
  });

  it('最初の行ではUpボタンが無効になる', () => {
    render(
      <TableControls
        buttonPosition="left"
        currentRow={0}
        totalRows={3}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );

    const upButton = screen.getByLabelText('上へ移動');
    expect(upButton).toBeDisabled();
  });

  it('最後の行ではDownボタンが無効になる', () => {
    render(
      <TableControls
        buttonPosition="left"
        currentRow={2}
        totalRows={3}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );

    const downButton = screen.getByLabelText('下へ移動');
    expect(downButton).toBeDisabled();
  });

  it('ボタンクリックでイベントが発火する', () => {
    render(
      <TableControls
        buttonPosition="left"
        currentRow={1}
        totalRows={3}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );

    const upButton = screen.getByLabelText('上へ移動');
    const downButton = screen.getByLabelText('下へ移動');

    upButton.click();
    expect(mockOnMoveUp).toHaveBeenCalledTimes(1);

    downButton.click();
    expect(mockOnMoveDown).toHaveBeenCalledTimes(1);
  });

  it('ボタン位置が右側に設定される', () => {
    const { container } = render(
      <TableControls
        buttonPosition="right"
        currentRow={1}
        totalRows={3}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );

    const buttonContainer = container.querySelector('.flex.gap-2');
    expect(buttonContainer).toHaveClass('ml-auto');
  });

  it('ボタン位置が左側に設定される', () => {
    const { container } = render(
      <TableControls
        buttonPosition="left"
        currentRow={1}
        totalRows={3}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );

    const buttonContainer = container.querySelector('.flex.gap-2');
    expect(buttonContainer).not.toHaveClass('ml-auto');
  });
});