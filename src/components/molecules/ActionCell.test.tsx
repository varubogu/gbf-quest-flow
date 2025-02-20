import { render, screen, fireEvent, act } from '@testing-library/react';
import { ActionCell } from './ActionCell';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

// モックの設定
const mockSetIsEditing = vi.fn();
const mockSetValue = vi.fn();

// モックの設定を修正
vi.mock('@/hooks/useActionCellEvents', () => ({
  useActionCellEvents: () => ({
    handleClick: vi.fn((e) => {
      e?.preventDefault();
      mockSetIsEditing(true);
    }),
    handleBlur: vi.fn(),
    handleKeyDown: vi.fn(),
    handleChange: vi.fn(),
    handlePaste: vi.fn(),
  }),
}));

vi.mock('@/hooks/useActionCellState', () => ({
  useActionCellState: () => ({
    isEditing: false,
    setIsEditing: mockSetIsEditing,
    value: 'テストコンテンツ',
    setValue: mockSetValue,
    textareaRef: { current: null },
    adjustTextareaHeight: vi.fn(),
  }),
}));

vi.mock('@/stores/settingsStore', () => ({
  default: () => ({
    settings: {
      actionTableClickType: 'single',
    },
  }),
}));

// スタイル関連のモックを追加
vi.mock('@/hooks/useAlignmentStyle', () => ({
  useAlignmentStyle: () => ({
    getAlignmentClass: () => 'text-left',
  }),
}));

vi.mock('@/hooks/useTableCellBaseStyle', () => ({
  useTableCellBaseStyle: () => ({
    getBaseClassName: () => 'base-class',
    getBasePadding: () => ({}),
  }),
}));

vi.mock('@/hooks/useTableCellStateStyle', () => ({
  useTableCellStateStyle: () => ({
    getStateClassName: () => '',
    getTextVariant: () => 'default',
  }),
}));

vi.mock('@/hooks/useTextareaStyle', () => ({
  useTextareaStyle: () => ({
    getTextareaClassName: () => 'textarea-class',
  }),
}));

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

  it('クリックで編集モードに入る', () => {
    act(() => {
      render(<ActionCell {...defaultProps} />);
    });

    // 要素の検索を試みる
    const cell = screen.queryByText('テストコンテンツ', { selector: 'pre' });

    if (!cell) {
      throw new Error('Cell element not found');
    }

    act(() => {
      cell.click();
      console.log('クリック後のDOM:');
      screen.debug();
    });

    act(() => {
      cell.click();
    });

    // isEditingがtrueになることを確認
    expect(defaultProps.onChange).not.toHaveBeenCalled();
    expect(mockSetIsEditing).toHaveBeenCalledWith(true);
  });

  it('編集モードに入るとテキストエリアが表示される', async () => {
    await act(async () => {
      render(<ActionCell {...defaultProps} isEditable={true} />);
    });

    // 通常モードではテキストエリアが表示されていないことを確認
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('textarea')).not.toBeInTheDocument();

    // 該当セルを取得
    const cell = screen.getByText('テストコンテンツ');
    expect(cell).toBeInTheDocument();

    // セルをクリック（編集モードに入る）
    act(() => {
      cell.click();
    });

    // クリック後のDOM状態を確認
    console.log('クリック後のDOM:');
    screen.debug();

    // テキストエリアが表示されるのを待機
    const textarea = await screen.findByRole('textarea');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue('テストコンテンツ');
  });

  it('テキストエリアで値を変更できる', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ActionCell {...defaultProps} isEditable={true} onChange={onChange} />);

    const cell = screen.getByText('テストコンテンツ', { selector: 'pre' });
    await user.click(cell);

    const textarea = await screen.findByRole('textbox');
    await user.type(textarea, '新しい内容');
    await user.tab();

    expect(onChange).toHaveBeenCalledWith('テストコンテンツ新しい内容');
  });

  it('Enterキーで変更を確定できる', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ActionCell {...defaultProps} isEditable={true} onChange={onChange} />);

    const cell = screen.getByText('テストコンテンツ', { selector: 'pre' });
    await user.click(cell);

    const textarea = await screen.findByRole('textbox');
    await user.type(textarea, '新しい内容{enter}');

    expect(onChange).toHaveBeenCalledWith('テストコンテンツ新しい内容');
  });

  it('異なる配置で正しくスタイルが適用される', async () => {
    const { rerender } = render(<ActionCell {...defaultProps} />);

    // 左寄せ
    let cell = screen.getByText('テストコンテンツ', { selector: 'pre' }).parentElement;
    expect(cell).toHaveClass('text-left');

    // 中央寄せ
    rerender(<ActionCell {...defaultProps} alignment="center" />);
    cell = screen.getByText('テストコンテンツ', { selector: 'pre' }).parentElement;
    expect(cell).toHaveClass('text-center');

    // 右寄せ
    rerender(<ActionCell {...defaultProps} alignment="right" />);
    cell = screen.getByText('テストコンテンツ', { selector: 'pre' }).parentElement;
    expect(cell).toHaveClass('text-right');
  });

  it('ヘッダーセルとして表示される', () => {
    render(<ActionCell {...defaultProps} isHeader={true} />);
    const cell = screen.getByText('テストコンテンツ', { selector: 'pre' }).closest('div');
    expect(cell).toHaveClass('bg-green-300');
  });

  it('現在の行のセルとして表示される', () => {
    render(<ActionCell {...defaultProps} isCurrentRow={true} />);
    const content = screen.getByText('テストコンテンツ', { selector: 'pre' });
    const variant = content.parentElement?.getAttribute('data-variant');
    expect(variant).toBe('current');
  });

  it('ペースト機能が正しく動作する', async () => {
    const user = userEvent.setup();
    const onPasteRows = vi.fn();
    render(<ActionCell {...defaultProps} isEditable={true} onPasteRows={onPasteRows} />);

    const cell = screen.getByText('テストコンテンツ', { selector: 'pre' });
    await user.click(cell);

    const textarea = await screen.findByRole('textbox');
    const clipboardText = '100\tテスト予測\t100\tなし\tテストアクション\tメモ';

    const clipboardData = {
      getData: () => clipboardText,
    };

    fireEvent.paste(textarea, {
      clipboardData,
      preventDefault: vi.fn(),
    });

    expect(onPasteRows).toHaveBeenCalledWith(expect.any(Number), [
      {
        hp: '100',
        prediction: 'テスト予測',
        charge: '100',
        guard: 'なし',
        action: 'テストアクション',
        note: 'メモ',
      },
    ]);
  });
});