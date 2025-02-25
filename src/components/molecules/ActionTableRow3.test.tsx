import { render, screen } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { ActionTableRow3 } from './ActionTableRow3';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('ActionTableRow', () => {
  const mockData = {
    hp: '95',
    prediction: 'テスト予兆（1億ダメージ）',
    charge: '◯',
    guard: '×',
    action: 'テストアクション',
    note: 'テストノート',
  };

  const defaultProps = {
    data: mockData,
    index: 0,
    isCurrentRow: false,
    isEditMode: false,
    className: 'test-class',
    onRowClick: vi.fn(),
    onRowDoubleClick: vi.fn(),
    onCellEdit: vi.fn(),
    onDeleteRow: vi.fn(),
    onAddRow: vi.fn(),
  };

  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(<ActionTableRow3 {...defaultProps} />);
  });

  it('通常モードで正しく表示される', () => {
    // 各セルの内容が表示されていることを確認
    const hpCell = screen.getByTestId('cell-hp-0');
    expect(hpCell).toHaveClass('text-right');

    const chargeCell = screen.getByTestId('cell-charge-0');
    expect(chargeCell).toHaveClass('text-center');

    expect(screen.getByText(mockData.hp)).toBeInTheDocument(); // HP
    expect(screen.getByText(mockData.prediction)).toBeInTheDocument();
    expect(screen.getByText(mockData.charge)).toBeInTheDocument();
    expect(screen.getByText(mockData.guard)).toBeInTheDocument();
    expect(screen.getByText(mockData.action)).toBeInTheDocument();
    expect(screen.getByText(mockData.note)).toBeInTheDocument();

    // 編集モードの要素が表示されていないことを確認
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('編集モードで追加・削除ボタンが表示される', () => {
    rendered.rerender(<ActionTableRow3 {...defaultProps} isEditMode={true} />);

    // 追加・削除ボタンが表示されていることを確認
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it('クリックイベントが正しく発火する', () => {
    const row = screen.getByTestId('action-row-0');
    row.click();
    expect(defaultProps.onRowClick).toHaveBeenCalledTimes(1);

    const event = new MouseEvent('dblclick', {
      bubbles: true,
      cancelable: true,
    });
    row.dispatchEvent(event);
    expect(defaultProps.onRowDoubleClick).toHaveBeenCalledTimes(1);
  });

  it('編集モードでボタンクリックイベントが正しく発火する', () => {
    rendered.rerender(<ActionTableRow3 {...defaultProps} isEditMode={true} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);

    const [deleteButton, addButton]: [HTMLButtonElement, HTMLButtonElement] = buttons as [HTMLButtonElement, HTMLButtonElement];
    deleteButton.click();
    expect(defaultProps.onDeleteRow).toHaveBeenCalledTimes(1);

    addButton.click();
    expect(defaultProps.onAddRow).toHaveBeenCalledTimes(1);
  });

  it('指定されたクラス名が適用される', () => {
    const row = screen.getByTestId('action-row-0');
    expect(row).toHaveClass('test-class');
  });

  it('現在の行のスタイルが正しく適用される', () => {
    // 通常の行
    let row = screen.getByTestId('action-row-0');
    expect(row).toHaveClass('test-class');

    // 現在の行
    rendered.rerender(<ActionTableRow3 {...defaultProps} isCurrentRow={true} />);
    row = screen.getByTestId('action-row-0');
    expect(row).toHaveClass('test-class');
  });
});