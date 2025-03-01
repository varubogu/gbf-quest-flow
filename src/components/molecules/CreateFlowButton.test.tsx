import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CreateFlowButton } from './CreateFlowButton';
import useEditModeStore from '@/core/stores/editModeStore';
import { renderWithI18n } from '@/test/i18n-test-utils';

// モック
vi.mock('@/core/stores/editModeStore', () => ({
  default: vi.fn(),
}));

describe('CreateFlowButton', () => {
  const mockCreateNewFlow = vi.fn();
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // useEditModeStoreのモック実装
    (useEditModeStore as any).mockImplementation((selector) =>
      selector({ createNewFlow: mockCreateNewFlow })
    );
  });

  it('ボタンが正しくレンダリングされる', () => {
    renderWithI18n(<CreateFlowButton />);

    const button = screen.getByTestId('create-flow-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('newData');
  });

  it('クラス名が正しく適用される', () => {
    renderWithI18n(<CreateFlowButton className="test-class" />);

    const button = screen.getByTestId('create-flow-button');
    expect(button).toHaveClass('test-class');
  });

  it('クリック時に新規フロー作成関数が呼ばれる', async () => {
    renderWithI18n(<CreateFlowButton onClick={mockOnClick} />);

    const button = screen.getByTestId('create-flow-button');
    fireEvent.click(button);

    expect(mockCreateNewFlow).toHaveBeenCalledTimes(1);

    // ローディング状態になることを確認
    expect(button).toHaveTextContent('creating');
    expect(button).toBeDisabled();

    // タイマーを進める
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // ローディング状態が解除されることを確認
    expect(button).toHaveTextContent('newData');
    expect(button).not.toBeDisabled();

    // onClickコールバックが呼ばれることを確認
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('エラー発生時にローディング状態が解除される', async () => {
    // エラーをスローするようにモックを設定
    mockCreateNewFlow.mockImplementation(() => {
      throw new Error('テストエラー');
    });

    // コンソールエラーをモック化
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithI18n(<CreateFlowButton />);

    const button = screen.getByTestId('create-flow-button');
    fireEvent.click(button);

    // エラーが発生してもローディング状態が解除されることを確認
    expect(button).toHaveTextContent('newData');
    expect(button).not.toBeDisabled();

    // コンソールエラーが出力されることを確認
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});