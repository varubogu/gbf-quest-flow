import { render, screen } from '@testing-library/react';
import { SummonPanel } from './index';
import { describe, it, expect, vi } from 'vitest';
import useFlowStore from '@/stores/flowStore';

interface UseTranslationResult {
  t: (_key: string) => string;
}

// Zustandのモック
vi.mock('@/stores/flowStore', () => ({
  default: vi.fn(),
}));

// i18nのモック
vi.mock('react-i18next', () => ({
  useTranslation: (): UseTranslationResult => ({
    t: (key: string): string => key,
  }),
}));

describe('SummonPanel', () => {
  const mockFlowData = {
    organization: {
      summon: {
        main: {
          name: 'バハムート',
          note: '主召喚石',
        },
        friend: {
          name: 'ルシフェル',
          note: 'フレ石',
        },
        other: [
          {
            name: 'シヴァ',
            note: '火属性攻撃力140%UP',
          },
        ],
        sub: [
          {
            name: 'ゼウス',
            note: '光属性攻撃力140%UP',
          },
        ],
      },
    },
  };

  beforeEach(() => {
    (useFlowStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => ({
      flowData: mockFlowData,
    }));
  });

  it('正しくレンダリングされる', () => {
    render(<SummonPanel isEditing={false} />);

    // タイトルの確認
    expect(screen.getByText('summon.title')).toBeInTheDocument();
    expect(screen.getByText('summon.mainTitle')).toBeInTheDocument();
    expect(screen.getByText('summon.friendTitle')).toBeInTheDocument();
    expect(screen.getByText('summon.otherTitle')).toBeInTheDocument();
    expect(screen.getByText('summon.subTitle')).toBeInTheDocument();

    // データの確認
    expect(screen.getByText('バハムート')).toBeInTheDocument();
    expect(screen.getByText('主召喚石')).toBeInTheDocument();
    expect(screen.getByText('ルシフェル')).toBeInTheDocument();
    expect(screen.getByText('フレ石')).toBeInTheDocument();
    expect(screen.getByText('シヴァ')).toBeInTheDocument();
    expect(screen.getByText('火属性攻撃力140%UP')).toBeInTheDocument();
    expect(screen.getByText('ゼウス')).toBeInTheDocument();
    expect(screen.getByText('光属性攻撃力140%UP')).toBeInTheDocument();
  });

  it('flowDataがnullの場合は何もレンダリングしない', () => {
    (useFlowStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => ({
      flowData: null,
    }));

    const { container } = render(<SummonPanel isEditing={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('アクセシビリティ属性が正しく設定されている', () => {
    render(<SummonPanel isEditing={false} />);

    const region = screen.getByRole('region');
    expect(region).toHaveAttribute('aria-label', 'summon.panelLabel');

    const tables = screen.getAllByRole('table');
    expect(tables).toHaveLength(4); // main, friend, other, sub
    expect(tables[0]).toHaveAttribute('aria-label', 'summon.mainLabel');
    expect(tables[1]).toHaveAttribute('aria-label', 'summon.friendLabel');
    expect(tables[2]).toHaveAttribute('aria-label', 'summon.otherLabel');
    expect(tables[3]).toHaveAttribute('aria-label', 'summon.subLabel');
  });
});