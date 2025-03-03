import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CreateFlowButton } from './CreateFlowButton';
import useEditModeStore from '@/core/stores/editModeStore';
import useEditModeStoreFacade from '@/core/facades/editModeStoreFacade';
import { renderWithI18n } from '@/test/i18n-test-utils';

// モック
vi.mock('@/core/stores/editModeStore', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockFn: any = vi.fn((selector) => selector({
    isEditMode: false,
    createNewFlow: vi.fn()
  }));
  mockFn.getState = vi.fn().mockReturnValue({
    isEditMode: false,
    createNewFlow: vi.fn()
  });
  mockFn.subscribe = vi.fn();
  mockFn.setState = vi.fn();
  return {
    default: mockFn,
  };
});

// useEditModeStoreFacadeのモック
vi.mock('@/core/facades/editModeStoreFacade', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockFn: any = vi.fn((selector) => selector({
    isEditMode: false,
    createNewFlow: vi.fn()
  }));
  return {
    default: mockFn,
  };
});

describe('CreateFlowButton', () => {
  const mockCreateNewFlow = vi.fn();
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // useEditModeStoreFacadeのモック実装を更新
    (useEditModeStoreFacade as any).mockImplementation((selector) =>
      selector({
        isEditMode: false,
        createNewFlow: mockCreateNewFlow
      })
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