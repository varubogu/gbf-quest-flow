import { render, screen } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { ActionTableHeader } from './ActionTableHeader';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// i18nのモック
// react-i18nextのモック
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => ({
      hpColumn: 'HP',
      triggerColumn: '予兆',
      ougiColumn: '奥義',
      guardColumn: 'ガード',
      actionColumn: 'アクション',
      notesColumn: 'メモ',
    }[key] || key),
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

describe('ActionTableHeader', () => {
  const defaultProps = {
    className: 'test-header-class',
    isEditMode: false,
    onAddRow: vi.fn(),
  };

  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(<ActionTableHeader {...defaultProps} />);
  });

  it('通常モードで正しくヘッダーが表示される', () => {
    // 各カラムヘッダーが表示されていることを確認
    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('予兆')).toBeInTheDocument();
    expect(screen.getByText('奥義')).toBeInTheDocument();
    expect(screen.getByText('ガード')).toBeInTheDocument();
    expect(screen.getByText('アクション')).toBeInTheDocument();
    expect(screen.getByText('メモ')).toBeInTheDocument();

    // 編集モードの要素が表示されていないことを確認
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('編集モードで追加ボタンが表示される', () => {
    rendered.rerender(<ActionTableHeader {...defaultProps} isEditMode={true} />);

    // 追加ボタンが表示されていることを確認
    const addButton = screen.getByRole('button');
    expect(addButton).toBeInTheDocument();
  });

  it('追加ボタンクリックで正しくイベントが発火する', () => {
    rendered.rerender(<ActionTableHeader {...defaultProps} isEditMode={true} />);

    const addButton = screen.getByRole('button');
    addButton.click();

    // onAddRowが-1のインデックスで呼ばれることを確認
    expect(defaultProps.onAddRow).toHaveBeenCalledWith(-1);
    expect(defaultProps.onAddRow).toHaveBeenCalledTimes(1);
  });

  it('指定されたクラス名が適用される', () => {
    const header = screen.getByText('HP').closest('div[class*="test-header-class"]');
    expect(header).toHaveClass('test-header-class');
  });

  it('各カラムが正しい配置で表示される', () => {
    // HPは右寄せ
    const hpCell = screen.getByText('HP').closest('div');
    expect(hpCell).toHaveClass('text-right');

    // アクションは左寄せ
    const actionCell = screen.getByText('アクション').closest('div');
    expect(actionCell).toHaveClass('text-left');

    // 奥義は中央寄せ
    const chargeCell = screen.getByText('奥義').closest('div');
    expect(chargeCell).toHaveClass('text-center');
  });
});