import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SubSummonSection } from './SubSummonSection';
import type { Summon } from '@/types/types';

// モックの設定
vi.mock('react-i18next', () => ({
  useTranslation: (): { t: (_key: string) => string } => ({
    t: (key: string): string => {
      const translations: Record<string, string> = {
        summonSub: 'サブ召喚石',
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
    <td data-testid={`summon-icon-${name}`}>
      <span>{name}</span>
      <span>{isEditing ? 'editing' : 'viewing'}</span>
      <span>{ariaLabel}</span>
    </td>
  )),
}));

vi.mock('./SummonNote', () => ({
  SummonNote: vi.fn(({ note, isEditing, _onChange, 'aria-label': ariaLabel }) => (
    <td data-testid={`summon-note-${note}`}>
      <span>{note}</span>
      <span>{isEditing ? 'editing' : 'viewing'}</span>
      <span>{ariaLabel}</span>
    </td>
  )),
}));

describe('SubSummonSection', () => {
  const mockSummons: Summon[] = [
    { name: 'サブ召喚石1', note: 'サブ召喚石1の説明' },
    { name: 'サブ召喚石2', note: 'サブ召喚石2の説明' },
  ];

  const onSummonChangeMock = vi.fn();

  it('サブ召喚石情報が正しく表示されること', () => {
    render(
      <table>
        <tbody>
          <SubSummonSection
            summons={mockSummons}
            isEditing={false}
            onSummonChange={onSummonChangeMock}
          />
        </tbody>
      </table>
    );

    // サブ召喚石ラベルが表示されていることを確認
    expect(screen.getByText('サブ召喚石')).toBeInTheDocument();

    // 1つ目のサブ召喚石が正しく表示されていることを確認
    const summonIcon1 = screen.getByTestId('summon-icon-サブ召喚石1');
    expect(summonIcon1).toBeInTheDocument();
    expect(summonIcon1).toHaveTextContent('サブ召喚石1');
    expect(summonIcon1).toHaveTextContent('viewing');

    const summonNote1 = screen.getByTestId('summon-note-サブ召喚石1の説明');
    expect(summonNote1).toBeInTheDocument();
    expect(summonNote1).toHaveTextContent('サブ召喚石1の説明');
    expect(summonNote1).toHaveTextContent('viewing');

    // 2つ目のサブ召喚石が正しく表示されていることを確認
    const summonIcon2 = screen.getByTestId('summon-icon-サブ召喚石2');
    expect(summonIcon2).toBeInTheDocument();
    expect(summonIcon2).toHaveTextContent('サブ召喚石2');

    const summonNote2 = screen.getByTestId('summon-note-サブ召喚石2の説明');
    expect(summonNote2).toBeInTheDocument();
    expect(summonNote2).toHaveTextContent('サブ召喚石2の説明');
  });

  it('編集モードで正しく表示されること', () => {
    render(
      <table>
        <tbody>
          <SubSummonSection
            summons={mockSummons}
            isEditing={true}
            onSummonChange={onSummonChangeMock}
          />
        </tbody>
      </table>
    );

    // 編集モードで表示されていることを確認
    const summonIcon1 = screen.getByTestId('summon-icon-サブ召喚石1');
    expect(summonIcon1).toHaveTextContent('editing');

    const summonNote1 = screen.getByTestId('summon-note-サブ召喚石1の説明');
    expect(summonNote1).toHaveTextContent('editing');
  });

  it('召喚石が空の場合、何も表示されないこと', () => {
    const { container } = render(
      <table>
        <tbody>
          <SubSummonSection
            summons={[]}
            isEditing={false}
            onSummonChange={onSummonChangeMock}
          />
        </tbody>
      </table>
    );

    expect(container.firstChild?.firstChild?.childNodes.length).toBe(0);
  });
});