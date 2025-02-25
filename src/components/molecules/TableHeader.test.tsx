import { render, screen } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { TableHeader } from './TableHeader';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { JSX } from 'react';
import type { TableAlignment } from '@/types/types';
// TableHeaderCellコンポーネントのモック
vi.mock('@/components/molecules/TableHeaderCell', () => ({
  default: ({ column, alignment }: { column: string; alignment: TableAlignment }): JSX.Element => (
    <th
      data-testid={`header-cell-${column}`}
      data-alignment={alignment}
      className={`text-${alignment}`}
    >
      {column}
    </th>
  ),
}));

interface UseTranslationResult {
  t: (_key: string) => string;
}

// i18nのモック
vi.mock('react-i18next', () => ({
  useTranslation: (): UseTranslationResult => ({
    t: (key: string): string => ({
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

describe('TableHeader', () => {
  const defaultProps = {
    className: 'test-header-class',
    isEditMode: false,
    onAddRow: vi.fn(),
  };

  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(<table><TableHeader {...defaultProps} /></table>);
  });

  it('通常モードで正しくヘッダーが表示される', () => {
    // 各カラムヘッダーが表示されていることを確認
    expect(screen.getByTestId('header-cell-hp')).toBeInTheDocument();
    expect(screen.getByTestId('header-cell-prediction')).toBeInTheDocument();
    expect(screen.getByTestId('header-cell-charge')).toBeInTheDocument();
    expect(screen.getByTestId('header-cell-guard')).toBeInTheDocument();
    expect(screen.getByTestId('header-cell-action')).toBeInTheDocument();
    expect(screen.getByTestId('header-cell-note')).toBeInTheDocument();

    // 編集モードの要素が表示されていないことを確認
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('編集モードで追加ボタンが表示される', () => {
    rendered.rerender(<table><TableHeader {...defaultProps} isEditMode={true} /></table>);

    // 追加ボタンが表示されていることを確認
    const addButton = screen.getByRole('button');
    expect(addButton).toBeInTheDocument();
  });

  it('追加ボタンクリックで正しくイベントが発火する', () => {
    rendered.rerender(<table><TableHeader {...defaultProps} isEditMode={true} /></table>);

    const addButton = screen.getByRole('button');
    addButton.click();

    // onAddRowが-1のインデックスで呼ばれることを確認
    expect(defaultProps.onAddRow).toHaveBeenCalledWith(-1);
    expect(defaultProps.onAddRow).toHaveBeenCalledTimes(1);
  });

  it('指定されたクラス名が適用される', () => {
    // テーブルヘッダー行にクラス名が適用されていることを確認
    const headerRow = screen.getByRole('row');
    expect(headerRow).toHaveClass('test-header-class');
  });

  it('各カラムが正しい配置で表示される', () => {
    // HPは右寄せ
    const hpCell = screen.getByTestId('header-cell-hp');
    expect(hpCell).toHaveAttribute('data-alignment', 'right');

    // アクションは左寄せ
    const actionCell = screen.getByTestId('header-cell-action');
    expect(actionCell).toHaveAttribute('data-alignment', 'left');

    // 奥義は中央寄せ
    const chargeCell = screen.getByTestId('header-cell-charge');
    expect(chargeCell).toHaveAttribute('data-alignment', 'center');
  });
});