import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MainSummonSection } from './MainSummonSection';
import type { Summon } from '@/types/types';

// モックの設定
vi.mock('react-i18next', () => ({
  useTranslation: (): { t: (_key: string) => string } => ({
    t: (key: string): string => {
      const translations: Record<string, string> = {
        summonMain: 'メイン召喚石',
        summonName: '召喚石名',
        overview: '概要',
      };
      return translations[key] || key;
    },
  }),
}));

// SummonIconとSummonNoteのモック
vi.mock('./SummonIcon', () => ({
  SummonIcon: vi.fn(({ name, isEditing, _onChange, 'aria-label': ariaLabel }) => (
    <td data-testid="summon-icon">
      <span>{name}</span>
      <span>{isEditing ? 'editing' : 'viewing'}</span>
      <span>{ariaLabel}</span>
    </td>
  )),
}));

vi.mock('./SummonNote', () => ({
  SummonNote: vi.fn(({ note, isEditing, _onChange, 'aria-label': ariaLabel }) => (
    <td data-testid="summon-note">
      <span>{note}</span>
      <span>{isEditing ? 'editing' : 'viewing'}</span>
      <span>{ariaLabel}</span>
    </td>
  )),
}));

describe('MainSummonSection', () => {
  const mockSummon: Summon = {
    name: 'テストメイン召喚石',
    note: 'テストメイン召喚石の説明',
  };

  const onSummonChangeMock = vi.fn();

  it('メイン召喚石情報が正しく表示されること', () => {
    render(
      <table>
        <tbody>
          <MainSummonSection
            summon={mockSummon}
            isEditing={false}
            onSummonChange={onSummonChangeMock}
          />
        </tbody>
      </table>
    );

    // メイン召喚石ラベルが表示されていることを確認
    expect(screen.getByText('メイン召喚石')).toBeInTheDocument();

    // SummonIconコンポーネントが正しく表示されていることを確認
    const summonIcon = screen.getByTestId('summon-icon');
    expect(summonIcon).toBeInTheDocument();
    expect(summonIcon).toHaveTextContent('テストメイン召喚石');
    expect(summonIcon).toHaveTextContent('viewing');
    expect(summonIcon).toHaveTextContent('召喚石名');

    // SummonNoteコンポーネントが正しく表示されていることを確認
    const summonNote = screen.getByTestId('summon-note');
    expect(summonNote).toBeInTheDocument();
    expect(summonNote).toHaveTextContent('テストメイン召喚石の説明');
    expect(summonNote).toHaveTextContent('viewing');
    expect(summonNote).toHaveTextContent('概要');
  });

  it('編集モードで正しく表示されること', () => {
    render(
      <table>
        <tbody>
          <MainSummonSection
            summon={mockSummon}
            isEditing={true}
            onSummonChange={onSummonChangeMock}
          />
        </tbody>
      </table>
    );

    // 編集モードで表示されていることを確認
    const summonIcon = screen.getByTestId('summon-icon');
    expect(summonIcon).toHaveTextContent('editing');

    const summonNote = screen.getByTestId('summon-note');
    expect(summonNote).toHaveTextContent('editing');
  });
});