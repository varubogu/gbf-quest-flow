import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TableControls } from './TableControls';

// Lucide-reactのモック
vi.mock('lucide-react', () => ({
  ChevronUp: () => <div data-testid="chevron-up">↑</div>,
  ChevronDown: () => <div data-testid="chevron-down">↓</div>,
}));

// react-i18nextのモック
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'action.moveUp': '上に移動',
        'action.moveDown': '下に移動',
      };
      return translations[key] || key;
    },
  }),
}));

describe('TableControls', () => {
  const defaultProps = {
    onMoveUp: vi.fn(),
    onMoveDown: vi.fn(),
  };

  it('renders both buttons by default', () => {
    render(<TableControls {...defaultProps} />);

    expect(screen.getByTestId('chevron-up')).toBeInTheDocument();
    expect(screen.getByTestId('chevron-down')).toBeInTheDocument();
  });

  it('calls onMoveUp when up button is clicked', () => {
    render(<TableControls {...defaultProps} />);

    const upButton = screen.getByTestId('chevron-up').closest('button');
    fireEvent.click(upButton!);
    expect(defaultProps.onMoveUp).toHaveBeenCalledTimes(1);
  });

  it('calls onMoveDown when down button is clicked', () => {
    render(<TableControls {...defaultProps} />);

    const downButton = screen.getByTestId('chevron-down').closest('button');
    fireEvent.click(downButton!);
    expect(defaultProps.onMoveDown).toHaveBeenCalledTimes(1);
  });

  it('only renders top button when buttonPosition is "top"', () => {
    render(<TableControls {...defaultProps} buttonPosition="top" />);

    expect(screen.getByTestId('chevron-up')).toBeInTheDocument();
    expect(screen.queryByTestId('chevron-down')).not.toBeInTheDocument();
  });

  it('only renders bottom button when buttonPosition is "bottom"', () => {
    render(<TableControls {...defaultProps} buttonPosition="bottom" />);

    expect(screen.queryByTestId('chevron-up')).not.toBeInTheDocument();
    expect(screen.getByTestId('chevron-down')).toBeInTheDocument();
  });

  it('renders both buttons when buttonPosition is "both"', () => {
    render(<TableControls {...defaultProps} buttonPosition="both" />);

    expect(screen.getByTestId('chevron-up')).toBeInTheDocument();
    expect(screen.getByTestId('chevron-down')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<TableControls {...defaultProps} className="custom-class" />);

    // コンテナの最初の子要素（divタグ）を取得
    const controlsContainer = container.firstChild as HTMLElement;
    expect(controlsContainer).toHaveClass('custom-class');
  });

  it('sets correct accessibility attributes', () => {
    render(<TableControls {...defaultProps} />);

    const upButton = screen.getByTestId('chevron-up').closest('button');
    const downButton = screen.getByTestId('chevron-down').closest('button');

    expect(upButton).toHaveAttribute('title', '上に移動');
    expect(upButton).toHaveAttribute('aria-label', '上に移動');
    expect(downButton).toHaveAttribute('title', '下に移動');
    expect(downButton).toHaveAttribute('aria-label', '下に移動');
  });
});