import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Table } from './Table';

// 必要なモジュールのモック
vi.mock('../../stores/settingsStore', () => ({
  useSettingsStore: () => ({
    settings: {
      clickType: 'single',
    },
  }),
}));

vi.mock('../../hooks/useTableKeyboardNavigation', () => ({
  useTableKeyboardNavigation: () => ({
    handleKeyDown: vi.fn(),
  }),
}));

vi.mock('../../hooks/useTableScroll', () => ({
  useTableScroll: vi.fn(),
}));

vi.mock('../../hooks/useActionTableConfig', () => ({
  useActionTableConfig: () => ({
    styles: {
      table: {},
    },
  }),
}));

vi.mock('../molecules/TableRow', () => ({
  TableRow: ({ data, index, isCurrentRow, onRowClick }: any) => (
    <tr
      data-testid={`table-row-${index}`}
      data-is-current={isCurrentRow}
      onClick={() => onRowClick()}
    >
      <td>{data.id}</td>
      <td>{data.name}</td>
    </tr>
  ),
}));

vi.mock('../molecules/TableHeader', () => ({
  TableHeader: ({ columns, isEditMode }: any) => (
    <thead data-testid="table-header" data-columns={columns.join(',')} data-edit-mode={isEditMode}>
      <tr>
        {columns.map((col: string) => (
          <th key={col}>{col}</th>
        ))}
      </tr>
    </thead>
  ),
}));

vi.mock('../molecules/TableControls', () => ({
  TableControls: ({ onMoveUp, onMoveDown }: any) => (
    <div data-testid="table-controls">
      <button data-testid="move-up-btn" onClick={onMoveUp}>Up</button>
      <button data-testid="move-down-btn" onClick={onMoveDown}>Down</button>
    </div>
  ),
}));

describe('Table', () => {
  const mockData = [
    { id: '1', name: 'Item 1', hp: '100' },
    { id: '2', name: 'Item 2', hp: '200' },
    { id: '3', name: 'Item 3', hp: '' },
  ];

  const defaultProps = {
    data: mockData,
    currentRow: 0,
    onRowClick: vi.fn(),
    onRowDoubleClick: vi.fn(),
    onCellEdit: vi.fn(),
    onDeleteRow: vi.fn(),
    onAddRow: vi.fn(),
    onMoveRow: vi.fn(),
    columns: ['id', 'name', 'hp'],
    alignments: { id: 'left', name: 'center', hp: 'right' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the table with header and rows', () => {
    render(<Table {...defaultProps} />);

    expect(screen.getByTestId('table-header')).toBeInTheDocument();
    expect(screen.getByTestId('table-header')).toHaveAttribute('data-columns', 'id,name,hp');

    expect(screen.getByTestId('table-row-0')).toBeInTheDocument();
    expect(screen.getByTestId('table-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('table-row-2')).toBeInTheDocument();
  });

  it('renders table controls when onMoveRow is provided', () => {
    render(<Table {...defaultProps} />);

    expect(screen.getByTestId('table-controls')).toBeInTheDocument();
  });

  it('does not render table controls when onMoveRow is not provided', () => {
    render(<Table {...defaultProps} onMoveRow={undefined} />);

    expect(screen.queryByTestId('table-controls')).not.toBeInTheDocument();
  });

  it('calls onRowClick when a row is clicked', () => {
    render(<Table {...defaultProps} />);

    fireEvent.click(screen.getByTestId('table-row-1'));
    expect(defaultProps.onRowClick).toHaveBeenCalledWith(1);
  });

  it('marks the current row correctly', () => {
    render(<Table {...defaultProps} currentRow={1} />);

    expect(screen.getByTestId('table-row-0')).toHaveAttribute('data-is-current', 'false');
    expect(screen.getByTestId('table-row-1')).toHaveAttribute('data-is-current', 'true');
    expect(screen.getByTestId('table-row-2')).toHaveAttribute('data-is-current', 'false');
  });

  it('passes edit mode to header and rows', () => {
    render(<Table {...defaultProps} isEditMode={true} />);

    expect(screen.getByTestId('table-header')).toHaveAttribute('data-edit-mode', 'true');
  });

  it('calls onMoveRow and updates currentRow when move up button is clicked', () => {
    render(<Table {...defaultProps} currentRow={1} />);

    fireEvent.click(screen.getByTestId('move-up-btn'));

    expect(defaultProps.onMoveRow).toHaveBeenCalledWith(1, 0);
    expect(defaultProps.onRowClick).toHaveBeenCalledWith(0);
  });

  it('calls onMoveRow and updates currentRow when move down button is clicked', () => {
    render(<Table {...defaultProps} currentRow={1} />);

    fireEvent.click(screen.getByTestId('move-down-btn'));

    expect(defaultProps.onMoveRow).toHaveBeenCalledWith(1, 2);
    expect(defaultProps.onRowClick).toHaveBeenCalledWith(2);
  });

  it('does not call onMoveRow when at the first row and move up is clicked', () => {
    render(<Table {...defaultProps} currentRow={0} />);

    fireEvent.click(screen.getByTestId('move-up-btn'));

    expect(defaultProps.onMoveRow).not.toHaveBeenCalled();
  });

  it('does not call onMoveRow when at the last row and move down is clicked', () => {
    render(<Table {...defaultProps} currentRow={2} />);

    fireEvent.click(screen.getByTestId('move-down-btn'));

    expect(defaultProps.onMoveRow).not.toHaveBeenCalled();
  });

  it('uses custom renderRow function when provided', () => {
    const customRenderRow = vi.fn().mockImplementation(({ data, index }) => (
      <tr data-testid={`custom-row-${index}`}>
        <td>{data.id}</td>
      </tr>
    ));

    render(<Table {...defaultProps} renderRow={customRenderRow} />);

    expect(customRenderRow).toHaveBeenCalledTimes(3);
    expect(screen.getByTestId('custom-row-0')).toBeInTheDocument();
    expect(screen.getByTestId('custom-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('custom-row-2')).toBeInTheDocument();
  });

  it('selects first row when exiting edit mode with no row selected', () => {
    const { rerender } = render(
      <Table {...defaultProps} isEditMode={true} currentRow={-1} />
    );

    rerender(
      <Table {...defaultProps} isEditMode={false} currentRow={-1} />
    );

    expect(defaultProps.onRowClick).toHaveBeenCalledWith(0);
  });
});