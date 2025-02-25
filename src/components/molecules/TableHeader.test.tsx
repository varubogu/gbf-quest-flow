import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TableHeader } from './TableHeader';

// TableHeaderCellコンポーネントのモック
vi.mock('./TableHeaderCell', () => ({
  TableHeaderCell: ({ column, translationKey, alignment }: any) => (
    <th data-testid={`header-cell-${column}`} data-translation-key={translationKey} data-alignment={alignment}>
      {column}
    </th>
  ),
}));

describe('TableHeader', () => {
  const defaultProps = {
    columns: ['id', 'name', 'value'],
    isEditMode: false,
    alignments: { id: 'left', name: 'center', value: 'right' },
  };

  it('renders header with correct columns', () => {
    render(<table><TableHeader {...defaultProps} /></table>);

    expect(screen.getByTestId('header-cell-id')).toBeInTheDocument();
    expect(screen.getByTestId('header-cell-name')).toBeInTheDocument();
    expect(screen.getByTestId('header-cell-value')).toBeInTheDocument();
  });

  it('passes correct translation keys to header cells', () => {
    const translationKeys = { id: 'custom.id', name: 'custom.name' };
    render(<table><TableHeader {...defaultProps} translationKeys={translationKeys} /></table>);

    expect(screen.getByTestId('header-cell-id')).toHaveAttribute('data-translation-key', 'custom.id');
    expect(screen.getByTestId('header-cell-name')).toHaveAttribute('data-translation-key', 'custom.name');
    expect(screen.getByTestId('header-cell-value')).toHaveAttribute('data-translation-key', 'column.value');
  });

  it('passes correct alignments to header cells', () => {
    render(<table><TableHeader {...defaultProps} /></table>);

    expect(screen.getByTestId('header-cell-id')).toHaveAttribute('data-alignment', 'left');
    expect(screen.getByTestId('header-cell-name')).toHaveAttribute('data-alignment', 'center');
    expect(screen.getByTestId('header-cell-value')).toHaveAttribute('data-alignment', 'right');
  });

  it('renders delete and add column headers in edit mode', () => {
    render(<table><TableHeader {...defaultProps} isEditMode={true} /></table>);

    const headers = screen.getAllByRole('columnheader');
    expect(headers.length).toBe(5); // 3 columns + delete + add
    expect(headers[0]).toHaveTextContent('削除');
    expect(headers[1]).toHaveTextContent('追加');
  });

  it('does not render delete and add column headers when not in edit mode', () => {
    render(<table><TableHeader {...defaultProps} /></table>);

    const headers = screen.getAllByRole('columnheader');
    expect(headers.length).toBe(3); // Just the 3 columns
  });

  it('uses default alignment when not specified', () => {
    const props = {
      ...defaultProps,
      alignments: { id: 'left' }, // Only specify alignment for id
    };

    render(<table><TableHeader {...props} /></table>);

    expect(screen.getByTestId('header-cell-id')).toHaveAttribute('data-alignment', 'left');
    expect(screen.getByTestId('header-cell-name')).toHaveAttribute('data-alignment', 'left'); // Default
    expect(screen.getByTestId('header-cell-value')).toHaveAttribute('data-alignment', 'left'); // Default
  });
});