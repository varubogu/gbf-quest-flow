import { screen } from '@testing-library/react';
import TableHeaderCell from './TableHeaderCell';
import { describe, it, expect, vi } from 'vitest';
import { renderTableHeaderCell } from '@/test/table-test-utils';

// columnTranslationKeysのモック
vi.mock('@/config/actionTable', () => ({
  columnTranslationKeys: {
    hp: 'hpColumn',
    prediction: 'triggerColumn',
    charge: 'ougiColumn',
    guard: 'guardColumn',
    action: 'actionColumn',
    note: 'notesColumn',
  }
}));

interface UseTranslationResult {
  t: (_key: string) => string;
}

// i18nのモック
vi.mock('react-i18next', () => ({
  useTranslation: (): UseTranslationResult => ({
    t: (key: string): string => {
      const translations: Record<string, string> = {
        'hpColumn': 'HP',
        'actionColumn': 'アクション',
        'notesColumn': 'メモ',
        'customKey': 'カスタム値'
      };
      return translations[key] || key;
    }
  })
}));

describe('TableHeaderCell', () => {
  it('ActionTableColumnの場合、翻訳されたテキストが表示される', () => {
    renderTableHeaderCell(<TableHeaderCell column="action" alignment="left" />);
    expect(screen.getByText('アクション')).toBeInTheDocument();
  });

  it('カスタム翻訳キーが指定された場合、その翻訳が表示される', () => {
    renderTableHeaderCell(<TableHeaderCell column="custom" alignment="left" translationKey="customKey" />);
    expect(screen.getByText('カスタム値')).toBeInTheDocument();
  });

  it('翻訳キーがない場合、columnの値がそのまま表示される', () => {
    renderTableHeaderCell(<TableHeaderCell column="customColumn" alignment="left" />);
    expect(screen.getByText('customColumn')).toBeInTheDocument();
  });

  it('alignmentに応じてテキスト配置が設定される', () => {
    const { rerender } = renderTableHeaderCell(<TableHeaderCell column="action" alignment="left" />);
    let cell = screen.getByText('アクション').closest('th');
    expect(cell).toHaveStyle({ textAlign: 'left' });

    rerender(
      <table>
        <thead>
          <tr>
            <TableHeaderCell column="action" alignment="center" />
          </tr>
        </thead>
      </table>
    );
    cell = screen.getByText('アクション').closest('th');
    expect(cell).toHaveStyle({ textAlign: 'center' });

    rerender(
      <table>
        <thead>
          <tr>
            <TableHeaderCell column="action" alignment="right" />
          </tr>
        </thead>
      </table>
    );
    cell = screen.getByText('アクション').closest('th');
    expect(cell).toHaveStyle({ textAlign: 'right' });
  });

  it('data-field属性が設定される', () => {
    renderTableHeaderCell(<TableHeaderCell column="action" alignment="left" />);
    const cell = screen.getByText('アクション').closest('th');
    expect(cell).toHaveAttribute('data-field', 'action');
  });
});