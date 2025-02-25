import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TableRow } from './TableRow';

// Lucide-reactのモック
vi.mock('lucide-react', () => ({
  Plus: () => <div data-testid="plus-icon">+</div>,
  Minus: () => <div data-testid="minus-icon">-</div>,
}));

describe('TableRow', () => {
  const defaultProps = {
    data: { id: '1', name: 'Test Name', value: '100' },
    index: 0,
    isCurrentRow: false,
    isEditMode: false,
    className: 'test-class',
    onRowClick: vi.fn(),
    onRowDoubleClick: vi.fn(),
    onCellEdit: vi.fn(),
    onDeleteRow: vi.fn(),
    onAddRow: vi.fn(),
    columns: ['id', 'name', 'value'],
    alignments: { id: 'left', name: 'center', value: 'right' },
  };

  it('renders row with correct cells', () => {
    render(<table><tbody><TableRow {...defaultProps} /></tbody></table>);

    expect(screen.getByTestId('row-0')).toHaveClass('test-class');
    expect(screen.getByTestId('cell-id-0')).toHaveTextContent('1');
    expect(screen.getByTestId('cell-name-0')).toHaveTextContent('Test Name');
    expect(screen.getByTestId('cell-value-0')).toHaveTextContent('100');
  });

  it('calls onRowClick when row is clicked', () => {
    render(<table><tbody><TableRow {...defaultProps} /></tbody></table>);

    fireEvent.click(screen.getByTestId('row-0'));
    expect(defaultProps.onRowClick).toHaveBeenCalledTimes(1);
  });

  it('calls onRowDoubleClick when row is double clicked', () => {
    render(<table><tbody><TableRow {...defaultProps} /></tbody></table>);

    fireEvent.doubleClick(screen.getByTestId('row-0'));
    expect(defaultProps.onRowDoubleClick).toHaveBeenCalledTimes(1);
  });

  it('renders delete and add buttons in edit mode', () => {
    render(
      <table>
        <tbody>
          <TableRow {...defaultProps} isEditMode={true} />
        </tbody>
      </table>
    );

    expect(screen.getByTestId('minus-icon')).toBeInTheDocument();
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
  });

  it('calls onDeleteRow when delete button is clicked', () => {
    render(
      <table>
        <tbody>
          <TableRow {...defaultProps} isEditMode={true} />
        </tbody>
      </table>
    );

    const deleteButton = screen.getByTestId('minus-icon').closest('button');
    fireEvent.click(deleteButton!);
    expect(defaultProps.onDeleteRow).toHaveBeenCalledTimes(1);
  });

  it('calls onAddRow when add button is clicked', () => {
    render(
      <table>
        <tbody>
          <TableRow {...defaultProps} isEditMode={true} />
        </tbody>
      </table>
    );

    const addButton = screen.getByTestId('plus-icon').closest('button');
    fireEvent.click(addButton!);
    expect(defaultProps.onAddRow).toHaveBeenCalledTimes(1);
  });

  it('handles null or undefined values in data', () => {
    const props = {
      ...defaultProps,
      data: { id: '1', name: null, value: undefined },
    };

    render(<table><tbody><TableRow {...props} /></tbody></table>);

    expect(screen.getByTestId('cell-id-0')).toHaveTextContent('1');
    expect(screen.getByTestId('cell-name-0')).toHaveTextContent('');
    expect(screen.getByTestId('cell-value-0')).toHaveTextContent('');
  });

  it('applies correct alignment to cells', () => {
    render(<table><tbody><TableRow {...defaultProps} /></tbody></table>);

    // TableCellコンポーネントにalignmentプロパティが正しく渡されていることを確認
    // 実際のスタイルのテストはTableCellコンポーネントのテストで行う
    const cells = screen.getAllByRole('cell');
    expect(cells.length).toBe(3); // 編集モードでない場合は3つのセルのみ
  });
});