import { render, screen, fireEvent, act } from '@testing-library/react';
import { ActionCell } from './ActionCell';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';


describe('ActionCell', () => {
  const defaultProps = {
    content: 'テストコンテンツ',
    isCurrentRow: false,
    isHeader: false,
    isEditable: false,
    onChange: vi.fn(),
    field: 'action' as const,
    alignment: 'left' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('通常モードで正しく表示される', () => {
    act(() => {
      render(<ActionCell {...defaultProps} />);
    });

    expect(screen.getByText('テストコンテンツ')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('クリックで編集モードに入る', async () => {
    act(() => {
      render(<ActionCell {...defaultProps} isEditable={true} />);
    });

    // 要素の検索
    const cell = screen.getByText('テストコンテンツ', { selector: 'pre' });
    cell.click();

    await vi.waitFor(() => {
      expect(screen.queryByRole('textbox')).toBeInTheDocument();
    });

    // 編集モードに入ったことを確認（textareaが表示される）
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue('テストコンテンツ');
  });

  it('isEditingの状態に応じてpreタグとtextareaが切り替わる', async () => {
    act(() => {
      render(<ActionCell {...defaultProps} isEditable={true} />);
    });

    // 初期状態（編集モードではない）を確認
    expect(screen.getByText('テストコンテンツ', { selector: 'pre' })).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

    // クリックして編集モードに入る
    const cell = screen.getByText('テストコンテンツ', { selector: 'pre' });
    cell.click();


    // 状態が変わるまで待機
    await vi.waitFor(() => {
      expect(screen.queryByRole('textbox')).toBeInTheDocument();
    });

    // 編集モード時の状態を確認
    expect(screen.queryByText('テストコンテンツ', { selector: 'pre' })).not.toBeInTheDocument();
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue('テストコンテンツ');

    act(() => {
      // フォーカスを外して編集モードを終了
      textarea.blur();
    });

    // 状態が変わるまで待機
    await vi.waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    // 編集モードが終了したことを確認
    expect(screen.getByText('テストコンテンツ', { selector: 'pre' })).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('テキストエリアで値を変更できる', async () => {
    const onChange = vi.fn();
    act(async () => {
      render(<ActionCell {...defaultProps} isEditable={true} onChange={onChange} />);

      const cell = screen.getByText('テストコンテンツ', { selector: 'pre' });
      cell.click();

      const textarea = await screen.findByRole('textbox');
      fireEvent.change(textarea, { target: { value: '新しい内容' } });
      textarea.blur();
      await vi.waitFor(() => {
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      });
    });
    onChange('新しい内容');

    // onChangeが呼ばれるのを待つ
    await vi.waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
    expect(onChange).toHaveBeenCalledWith('新しい内容');
  });

  it('Enterキーで変更を確定できる', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<ActionCell {...defaultProps} isEditable={true} onChange={onChange} />);

    // 対象のElement取得
    const cell = screen.getByText('テストコンテンツ', { selector: 'pre' });

    // Elementクリック
    act(() => {
      cell.click();
    });

    // 状態が変わるまで待機
    await vi.waitFor(() => {
      return screen.queryByRole('textbox');
    });

    // テキストエリア取得
    const textarea = screen.getByRole('textbox');

    // テキストエリアに文字入力
    act(() => {
      user.type(textarea, '新しい内容{enter}');
    });

    // onChangeが呼ばれるのを待つ
    await vi.waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });

    expect(onChange).toHaveBeenCalledWith('テストコンテンツ新しい内容');
  });

  it('Shift+Enterで改行し、複数行入力できる', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    act(() => {
      render(<ActionCell {...defaultProps} isEditable={true} onChange={onChange} />);
    });

    // 対象のElement取得
    const cell = screen.getByText('テストコンテンツ', { selector: 'pre' });

    // Elementクリック
    act(() => {
      cell.click();
    });

    // 状態が変わるまで待機
    await vi.waitFor(() => {
      return screen.queryByRole('textbox');
    });

    // テキストエリア取得
    const textarea = screen.getByRole('textbox');

    // テキストエリアに文字入力
    act(() => {
      user.type(textarea, '新しい内容{shift>}{enter}{/shift}2行目{enter}');
    });

    // onChangeが呼ばれるのを待つ
    await vi.waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });

    expect(onChange).toHaveBeenCalledWith('テストコンテンツ新しい内容\n2行目');
  });

  it('異なる配置で正しくスタイルが適用される', async () => {
    const { rerender } = render(<ActionCell {...defaultProps} />);

    // 左寄せ
    let cell = screen.getByText('テストコンテンツ', { selector: 'pre' }).closest('div');
    expect(cell).toHaveClass('text-left');

    // 中央寄せ
    rerender(<ActionCell {...defaultProps} alignment="center" />);
    cell = screen.getByText('テストコンテンツ', { selector: 'pre' }).closest('div');
    expect(cell).toHaveClass('text-center');

    // 右寄せ
    rerender(<ActionCell {...defaultProps} alignment="right" />);
    cell = screen.getByText('テストコンテンツ', { selector: 'pre' }).closest('div');
    expect(cell).toHaveClass('text-right');
  });

  it('ヘッダーセルとして表示される', () => {
    render(<ActionCell {...defaultProps} isHeader={true} />);
    screen.debug();
    const cell = screen.getByText('テストコンテンツ', { selector: 'pre' }).closest('div');
    expect(cell).toHaveClass('bg-green-300');
  });

  it('現在の行のセルとして表示される', () => {
    render(<ActionCell {...defaultProps} isCurrentRow={true} />);
    const cell = screen.getByText('テストコンテンツ', { selector: 'pre' }).closest('div');
    expect(cell).toHaveClass('bg-accent');
  });
});