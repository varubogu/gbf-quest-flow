import { render, screen } from '@testing-library/react';
import { CharacterPanel } from './index';
import { describe, it, expect, vi } from 'vitest';
import useFlowStore from '@/stores/flowStore';

// Zustandのモック
vi.mock('@/stores/flowStore', () => ({
  default: vi.fn(),
}));

// i18nのモック
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
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
    },
  };

  beforeEach(() => {
    (useFlowStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => ({
      flowData: mockFlowData,
      handleMemberChange: vi.fn(),
    }));
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
    (useFlowStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => ({
      flowData: null,
    }));

    const { container } = render(<CharacterPanel isEditing={false} />);
    expect(container.firstChild).toBeNull();
  });
});