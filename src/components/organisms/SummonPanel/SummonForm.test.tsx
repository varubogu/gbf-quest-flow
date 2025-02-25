import { render, screen } from '@testing-library/react';
import { SummonForm } from './SummonForm';
import { describe, it, expect, vi } from 'vitest';
import type { Summon } from '@/types/types';

interface UseTranslationResult {
  t: (_key: string) => string;
}

// i18nのモック
vi.mock('react-i18next', () => ({
  useTranslation: (): UseTranslationResult => ({
    t: (key: string): string => key,
  }),
}));

interface UseSummonFormResult {
  handleSummonChange: (_type: 'main' | 'friend' | 'other' | 'sub', _index: number, _field: keyof Summon, _value: string) => void;
}

// useSummonFormのモック
vi.mock('@/hooks/summons/useSummonForm', () => ({
  useSummonForm: (): UseSummonFormResult => ({
    handleSummonChange: vi.fn(),
  }),
}));

describe('SummonForm', () => {
  const mockSummons: Summon[] = [
    {
      name: 'バハムート',
      note: '主召喚石\n攻撃力150%UP',
    },
    {
      name: 'ルシフェル',
      note: 'HP30%UP',
    },
  ];

  const defaultProps = {
    type: 'main' as const,
    summons: mockSummons,
    isEditing: false,
  };

  it('表示モードで正しくレンダリングされる', () => {
    const { container } = render(<SummonForm {...defaultProps} />);

    // テーブルの存在確認
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    expect(table).toHaveAttribute('aria-label', 'summon.mainLabel');

    // ヘッダーの確認
    expect(screen.getByText('summon.name')).toBeInTheDocument();
    expect(screen.getByText('summon.note')).toBeInTheDocument();

    // データの確認
    expect(screen.getByText('バハムート')).toBeInTheDocument();
    expect(screen.getByText('ルシフェル')).toBeInTheDocument();

    // 改行を含むテキストの確認
    const cells = container.querySelectorAll('td');
    const noteCell1 = Array.from(cells).find(cell => cell.textContent?.includes('主召喚石'));
    const noteCell2 = Array.from(cells).find(cell => cell.textContent?.includes('HP30%UP'));

    expect(noteCell1).toHaveTextContent('主召喚石');
    expect(noteCell1).toHaveTextContent('攻撃力150%UP');
    expect(noteCell2).toHaveTextContent('HP30%UP');
  });

  it('編集モードで正しくレンダリングされる', () => {
    render(<SummonForm {...defaultProps} isEditing={true} />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(4); // 名前×2、説明×2

    // アクセシビリティ属性の確認
    inputs.forEach(input => {
      expect(input).toHaveAttribute('aria-label');
    });

    // テキストエリアの値を確認
    const textareas = inputs.filter(input => input.tagName === 'TEXTAREA');
    expect(textareas[0]).toHaveValue('主召喚石\n攻撃力150%UP');
    expect(textareas[1]).toHaveValue('HP30%UP');
  });

  it('メモ化されたコンポーネントが正しく再レンダリングされる', () => {
    const { rerender } = render(<SummonForm {...defaultProps} />);
    expect(screen.getByText('バハムート')).toBeInTheDocument();

    const newSummons: Summon[] = [{
      name: 'シヴァ',
      note: '火属性攻撃力140%UP',
    }];

    rerender(<SummonForm {...defaultProps} summons={newSummons} />);
    expect(screen.getByText('シヴァ')).toBeInTheDocument();
  });
});