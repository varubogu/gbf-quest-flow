import { render, screen } from '@testing-library/react';
import { CharacterPanel } from './index';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useFlowStore from '@/core/stores/flowStore';

// Zustandのモック
vi.mock('@/core/stores/flowStore');

// useCharacterFormフックのモック
vi.mock('@/core/hooks/domain/characters/useCharacterForm', () => ({
  useCharacterForm: () => ({
    handleMemberChange: vi.fn(),
  }),
}));

interface UseTranslationResult {
  t: (_key: string) => string;
}

interface UseMockResult {
  useTranslation: () => UseTranslationResult;
}

// i18nのモック
vi.mock('react-i18next', (): UseMockResult => ({
  useTranslation: (): UseTranslationResult => ({
    t: (key: string): string => key,
  }),
}));

describe('CharacterPanel', () => {
  const mockFlowData = {
    organization: {
      member: {
        front: [
          {
            name: 'グラン',
            note: 'メインキャラ',
            awaketype: '4凸',
            accessories: '指輪',
            limitBonus: 'HP+300',
          },
        ],
        back: [
          {
            name: 'ジータ',
            note: 'サブキャラ',
            awaketype: '3凸',
            accessories: 'なし',
            limitBonus: '',
          },
        ],
      },
      weapon: {
        main: { name: '', note: '', additionalSkill: '' },
        other: [],
        additional: [],
      },
      weaponEffects: {
        taRate: '',
        hp: '',
        defense: '',
      },
      totalEffects: {
        taRate: '',
        hp: '',
        defense: '',
      },
      summon: {
        main: { name: '', note: '' },
        friend: { name: '', note: '' },
        other: [],
        sub: [],
      },
      job: {
        name: '',
        note: '',
        equipment: {
          name: '',
          note: '',
        },
        abilities: [],
      },
    },
    title: '',
    quest: '',
    author: '',
    description: '',
    updateDate: '',
    note: '',
    always: '',
    flow: [],
  };

  beforeEach(() => {
    // モックの実装を更新
    vi.mocked(useFlowStore).mockImplementation((selector) => {
      if (selector) {
        return selector({ flowData: mockFlowData });
      }
      return { flowData: mockFlowData };
    });
  });

  it('正しくレンダリングされる', () => {
    render(<CharacterPanel isEditing={false} />);

    // ヘッダーの確認
    expect(screen.getByText('characterPosition')).toBeInTheDocument();
    expect(screen.getByText('characterName')).toBeInTheDocument();
    expect(screen.getByText('characterUsage')).toBeInTheDocument();
    expect(screen.getByText('characterAwakening')).toBeInTheDocument();
    expect(screen.getByText('characterAccessories')).toBeInTheDocument();
    expect(screen.getByText('characterLimitBonus')).toBeInTheDocument();

    // データの確認
    expect(screen.getByText('グラン')).toBeInTheDocument();
    expect(screen.getByText('メインキャラ')).toBeInTheDocument();
    expect(screen.getByText('ジータ')).toBeInTheDocument();
    expect(screen.getByText('サブキャラ')).toBeInTheDocument();
  });

  it('flowDataがnullの場合は何もレンダリングしない', () => {
    vi.mocked(useFlowStore).mockImplementation((selector) => {
      if (selector) {
        return selector({ flowData: null });
      }
      return { flowData: null };
    });

    const { container } = render(<CharacterPanel isEditing={false} />);
    expect(container.firstChild).toBeNull();
  });
});