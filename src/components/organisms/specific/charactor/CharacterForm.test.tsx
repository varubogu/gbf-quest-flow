import { render, screen, fireEvent } from '@testing-library/react';
import { CharacterForm } from './CharacterForm';
import { describe, it, expect, vi } from 'vitest';
import type { Member } from '@/types/types';

interface UseTranslationResult {
  t: (_key: string) => string;
}

// i18nのモック
vi.mock('react-i18next', () => ({
  useTranslation: (): UseTranslationResult => ({
    t: (key: string): string => key,
  }),
}));

describe('CharacterForm', () => {
  const mockMembers: Member[] = [
    {
      name: 'グラン',
      note: 'メインキャラ',
      awaketype: '4凸',
      accessories: '指輪',
      limitBonus: 'HP+300',
    },
    {
      name: 'ジータ',
      note: 'サブキャラ',
      awaketype: '3凸',
      accessories: 'なし',
      limitBonus: '',
    },
  ];

  const defaultProps = {
    position: 'front' as const,
    members: mockMembers,
    isEditing: false,
    onMemberChange: vi.fn(),
  };

  it('表示モードで正しくレンダリングされる', () => {
    render(
      <table>
        <tbody>
          <CharacterForm {...defaultProps} />
        </tbody>
      </table>
    );

    // 行の存在確認
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(2);

    // セルの内容確認
    expect(screen.getByText('characterFront')).toBeInTheDocument();
    expect(screen.getByText('グラン')).toBeInTheDocument();
    expect(screen.getByText('メインキャラ')).toBeInTheDocument();
    expect(screen.getByText('4凸')).toBeInTheDocument();
    expect(screen.getByText('指輪')).toBeInTheDocument();
    expect(screen.getByText('HP+300')).toBeInTheDocument();

    // アクセシビリティ属性の確認
    const cells = screen.getAllByRole('cell');
    expect(cells[0]).toHaveAttribute('aria-label', 'characterFront');
  });

  it('編集モードで正しくレンダリングされる', () => {
    render(
      <table>
        <tbody>
          <CharacterForm {...defaultProps} isEditing={true} />
        </tbody>
      </table>
    );

    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBe(10); // 名前、ノート、覚醒、アクセサリー、LB × 2キャラ分

    // アクセシビリティ属性の確認
    inputs.forEach(input => {
      expect(input).toHaveAttribute('aria-label');
    });
  });

  it('入力値の変更が正しく処理される', () => {
    const handleMemberChange = vi.fn();
    render(
      <table>
        <tbody>
          <CharacterForm {...defaultProps} isEditing={true} onMemberChange={handleMemberChange} />
        </tbody>
      </table>
    );

    const nameInput = screen.getAllByRole('textbox')[0] as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'カタリナ' } });

    expect(handleMemberChange).toHaveBeenCalledWith('front', 0, 'name', 'カタリナ');
  });

  it('メモ化されたコンポーネントが正しく再レンダリングされる', () => {
    const { rerender } = render(
      <table>
        <tbody>
          <CharacterForm {...defaultProps} />
        </tbody>
      </table>
    );

    expect(screen.getByText('グラン')).toBeInTheDocument();

    const newMembers: Member[] = [{
      name: 'カタリナ',
      note: 'メインキャラ',
      awaketype: '4凸',
      accessories: '指輪',
      limitBonus: 'HP+300',
    }];

    rerender(
      <table>
        <tbody>
          <CharacterForm {...defaultProps} members={newMembers} />
        </tbody>
      </table>
    );

    expect(screen.getByText('カタリナ')).toBeInTheDocument();
  });
});