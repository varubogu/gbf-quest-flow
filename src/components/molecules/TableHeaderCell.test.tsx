import { render, screen } from '@testing-library/react';
import TableHeaderCell from './TableHeaderCell';
import { describe, it, expect, vi } from 'vitest';

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

// i18nのモック
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
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
    render(<TableHeaderCell column="action" alignment="left" />);
    expect(screen.getByText('アクション')).toBeInTheDocument();
  });

  it('カスタム翻訳キーが指定された場合、その翻訳が表示される', () => {
    render(<TableHeaderCell column="custom" alignment="left" translationKey="customKey" />);
    expect(screen.getByText('カスタム値')).toBeInTheDocument();
  });

  it('翻訳キーがない場合、columnの値がそのまま表示される', () => {
    render(<TableHeaderCell column="customColumn" alignment="left" />);
    expect(screen.getByText('customColumn')).toBeInTheDocument();
  });

  it('alignmentに応じてテキスト配置が設定される', () => {
    const { rerender } = render(<TableHeaderCell column="action" alignment="left" />);
    let cell = screen.getByText('アクション').closest('th');
    expect(cell).toHaveStyle({ textAlign: 'left' });

    rerender(<TableHeaderCell column="action" alignment="center" />);
    cell = screen.getByText('アクション').closest('th');
    expect(cell).toHaveStyle({ textAlign: 'center' });

    rerender(<TableHeaderCell column="action" alignment="right" />);
    cell = screen.getByText('アクション').closest('th');
    expect(cell).toHaveStyle({ textAlign: 'right' });
  });

  it('data-field属性が設定される', () => {
    render(<TableHeaderCell column="action" alignment="left" />);
    const cell = screen.getByText('アクション').closest('th');
    expect(cell).toHaveAttribute('data-field', 'action');
  });
});