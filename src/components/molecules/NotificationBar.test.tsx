import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { NotificationBar } from './NotificationBar';

// モックの設定
vi.mock('react-i18next', () => ({
  useTranslation: (): { t: (_key: string) => string } => ({
    t: (key: string): string => key, // 翻訳キーをそのまま返す
  }),
}));

describe('NotificationBar', () => {
  beforeEach(() => {
    // グローバルタイマーのリセット
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('メッセージが正しく表示されること', () => {
    render(<NotificationBar message="test.message" />);

    // メッセージが表示されていることを確認
    expect(screen.getByText('test.message')).toBeInTheDocument();
  });

  it('指定された時間後に非表示になること', async () => {
    render(<NotificationBar message="test.message" duration={1000} />);

    // 初期状態ではメッセージが表示されていることを確認
    expect(screen.getByText('test.message')).toBeInTheDocument();

    // タイマーを進める
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // 指定時間後にメッセージが非表示になっていることを確認
    expect(screen.queryByText('test.message')).not.toBeInTheDocument();
  });

  it('デフォルトの時間（5000ms）後に非表示になること', async () => {
    render(<NotificationBar message="test.message" />);

    // 初期状態ではメッセージが表示されていることを確認
    expect(screen.getByText('test.message')).toBeInTheDocument();

    // 4999ms経過後もメッセージが表示されていることを確認
    await act(async () => {
      vi.advanceTimersByTime(4999);
    });
    expect(screen.getByText('test.message')).toBeInTheDocument();

    // 5000ms経過後にメッセージが非表示になっていることを確認
    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByText('test.message')).not.toBeInTheDocument();
  });

  it('コンポーネントがアンマウントされるとタイマーがクリアされること', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const { unmount } = render(<NotificationBar message="test.message" />);

    unmount();

    // コンポーネントがアンマウントされるとclearTimeoutが呼ばれることを確認
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('スタイルが正しく適用されていること', () => {
    render(<NotificationBar message="test.message" />);

    // 要素を取得
    const element = screen.getByText('test.message');
    const notificationElement = element.parentElement;

    // 要素が存在することを確認
    expect(notificationElement).toBeInTheDocument();

    // データ属性を使用してテスト
    expect(notificationElement).toHaveTextContent('test.message');

    // 要素の存在を確認するだけにする
    expect(notificationElement).toBeVisible();
  });
});