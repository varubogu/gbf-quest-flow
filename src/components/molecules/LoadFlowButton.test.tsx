import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { LoadFlowButton } from './LoadFlowButton';
import useFileOperationsFacade from '@/core/facades/fileOperationsFacade';
import { renderWithI18n } from '@/test/i18n-test-utils';

// モック
vi.mock('@/core/facades/fileOperationsFacade', () => ({
  default: vi.fn(),
}));

describe('LoadFlowButton', () => {
  const mockLoadFlowFromFile = vi.fn();
  const mockOnLoadComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // useFileOperationsFacadeのモック実装
    (useFileOperationsFacade as unknown as Mock).mockImplementation((selector) =>
      selector({ loadFlowFromFile: mockLoadFlowFromFile })
    );
  });

  it('ボタンが正しくレンダリングされる', () => {
    renderWithI18n(<LoadFlowButton />);

    const button = screen.getByTestId('load-flow-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('loadData');
  });

  it('クラス名が正しく適用される', () => {
    renderWithI18n(<LoadFlowButton className="test-class" />);

    const button = screen.getByTestId('load-flow-button');
    expect(button).toHaveClass('test-class');
  });

  it('クリック時にファイル読み込み関数が呼ばれる', async () => {
    mockLoadFlowFromFile.mockResolvedValue(undefined);

    renderWithI18n(<LoadFlowButton onLoadComplete={mockOnLoadComplete} />);

    const button = screen.getByTestId('load-flow-button');
    fireEvent.click(button);

    expect(mockLoadFlowFromFile).toHaveBeenCalledTimes(1);

    // ローディング状態になることを確認
    expect(button).toHaveTextContent('loadingFile');
    expect(button).toBeDisabled();

    // Promiseの解決を待つ
    await Promise.resolve();

    // タイマーを進める
    await act(async () => {
      vi.advanceTimersByTime(500);
      await Promise.resolve(); // 状態更新を待つ
    });

    // ローディング状態が解除されることを確認
    expect(button).toHaveTextContent('loadData');
    expect(button).not.toBeDisabled();

    // onLoadCompleteコールバックが呼ばれることを確認
    expect(mockOnLoadComplete).toHaveBeenCalledTimes(1);
  });

  it('エラー発生時にローディング状態が解除される', async () => {
    // エラーをスローするようにモックを設定
    const testError = new Error('テストエラー');
    mockLoadFlowFromFile.mockImplementation(() => {
      return Promise.reject(testError);
    });

    // コンソールエラーをモック化
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithI18n(<LoadFlowButton />);

    const button = screen.getByTestId('load-flow-button');

    // クリックイベントを発火
    await act(async () => {
      fireEvent.click(button);
      // Promiseの拒否を待つ
      try {
        await mockLoadFlowFromFile();
      } catch {
        // エラーは期待通り
      }
    });

    // エラーが発生してもローディング状態が解除されることを確認
    expect(button).toHaveTextContent('loadData');
    expect(button).not.toBeDisabled();

    // コンソールエラーが出力されることを確認
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});