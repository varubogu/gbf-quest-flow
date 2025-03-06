import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SummonPanel } from './SummonPanel';
import type { Flow, SummonType } from '@/types/models';
import type { Summon } from '@/types/types';

// モックの設定
vi.mock('react-i18next', () => ({
  useTranslation: (): { t: (_key: string) => string } => ({
    t: (key: string): string => {
      const translations: Record<string, string> = {
        summonCategory: 'カテゴリ',
        summonName: '召喚石名',
        overview: '概要',
      };
      return translations[key] || key;
    },
  }),
}));

// 各セクションコンポーネントのモック
vi.mock('@/components/molecules/specific/summon/MainSummonSection', () => {
  interface MainSummonSectionProps {
    summon: Summon;
    isEditing: boolean;
    _onSummonChange: (_type: SummonType, _index: number | null, _field: keyof Summon, _value: string) => void;
  }

  return {
    MainSummonSection: vi.fn(({ summon, isEditing, _onSummonChange }: MainSummonSectionProps) => (
      <tr data-testid="main-summon-section">
        <td>{summon.name}</td>
        <td>{isEditing ? 'editing' : 'viewing'}</td>
      </tr>
    )),
  };
});

vi.mock('@/components/molecules/specific/summon/FriendSummonSection', () => {
  interface FriendSummonSectionProps {
    summon: Summon;
    isEditing: boolean;
    _onSummonChange: (_type: SummonType, _index: number | null, _field: keyof Summon, _value: string) => void;
  }
  return {
    FriendSummonSection: vi.fn(({ summon, isEditing, _onSummonChange }: FriendSummonSectionProps) => (
      <tr data-testid="friend-summon-section">
        <td>{summon.name}</td>
        <td>{isEditing ? 'editing' : 'viewing'}</td>
      </tr>
    )),
  };
});

vi.mock('@/components/molecules/specific/summon/OtherSummonSection', () => {
  interface OtherSummonSectionProps {
    summons: Summon[];
    isEditing: boolean;
    _onSummonChange: (_type: SummonType, _index: number | null, _field: keyof Summon, _value: string) => void;
  }
  return {
    OtherSummonSection: vi.fn(({ summons, isEditing, _onSummonChange }: OtherSummonSectionProps) => (
      <tr data-testid="other-summon-section">
        <td>{summons.length} items</td>
      <td>{isEditing ? 'editing' : 'viewing'}</td>
    </tr>
    )),
  };
});

vi.mock('@/components/molecules/specific/summon/SubSummonSection', () => {
  interface SubSummonSectionProps {
    summons: Summon[];
    isEditing: boolean;
    _onSummonChange: (_type: SummonType, _index: number | null, _field: keyof Summon, _value: string) => void;
  }
  return {
    SubSummonSection: vi.fn(({ summons, isEditing, _onSummonChange }: SubSummonSectionProps) => (
      <tr data-testid="sub-summon-section">
        <td>{summons.length} items</td>
        <td>{isEditing ? 'editing' : 'viewing'}</td>
      </tr>
    )),
  };
});

// カスタムフックのモック
const handleSummonChangeMock = vi.fn();

vi.mock('@/core/hooks/ui/specific/useSummonHandlers', () => ({
  useSummonHandlers: vi.fn(() => ({
    flowData: currentFlowData,
    handleSummonChange: handleSummonChangeMock,
  })),
}));

// テスト用のモックデータ
const mockMainSummon: Summon = {
  name: 'メイン召喚石',
  note: 'メイン召喚石の説明',
};

const mockFriendSummon: Summon = {
  name: 'フレンド召喚石',
  note: 'フレンド召喚石の説明',
};

const mockOtherSummons: Summon[] = [
  { name: 'その他召喚石1', note: 'その他召喚石1の説明' },
  { name: 'その他召喚石2', note: 'その他召喚石2の説明' },
];

const mockSubSummons: Summon[] = [
  { name: 'サブ召喚石1', note: 'サブ召喚石1の説明' },
  { name: 'サブ召喚石2', note: 'サブ召喚石2の説明' },
];

const mockFlowData: Flow = {
  title: 'テストフロー',
  quest: 'テストクエスト',
  author: 'テスト作者',
  description: 'テスト説明',
  updateDate: '2023-01-01',
  note: 'テストノート',
  organization: {
    job: {
      name: '',
      note: '',
      equipment: { name: '', note: '' },
      abilities: [],
    },
    member: { front: [], back: [] },
    weapon: {
      main: { name: '', note: '', additionalSkill: '' },
      other: [],
      additional: [],
    },
    weaponEffects: { taRate: '', hp: '', defense: '' },
    summon: {
      main: mockMainSummon,
      friend: mockFriendSummon,
      other: mockOtherSummons,
      sub: mockSubSummons,
    },
    totalEffects: { taRate: '', hp: '', defense: '' },
  },
  always: '',
  flow: [],
};

// flowStoreのモック
let currentFlowData: Flow | null = mockFlowData;

describe('SummonPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentFlowData = mockFlowData;
  });

  describe('単体テスト', () => {
    it('召喚石パネルが表示されること', () => {
      render(<SummonPanel isEditing={false} />);

      // テーブルヘッダーが表示されていることを確認
      expect(screen.getByText('カテゴリ')).toBeInTheDocument();
      expect(screen.getByText('召喚石名')).toBeInTheDocument();
      expect(screen.getByText('概要')).toBeInTheDocument();

      // 各セクションが表示されていることを確認
      expect(screen.getByTestId('main-summon-section')).toBeInTheDocument();
      expect(screen.getByTestId('friend-summon-section')).toBeInTheDocument();
      expect(screen.getByTestId('other-summon-section')).toBeInTheDocument();
      expect(screen.getByTestId('sub-summon-section')).toBeInTheDocument();
    });

    it('flowDataがnullの場合、nullを返すこと', () => {
      // flowDataをnullに設定
      currentFlowData = null;

      const { container } = render(<SummonPanel isEditing={false} />);

      // 何も表示されないことを確認
      expect(container.firstChild).toBeNull();
    });

    it('編集モードで正しく表示されること', () => {
      render(<SummonPanel isEditing={true} />);

      // 編集モードで表示されていることを確認
      const mainSummonSection = screen.getByTestId('main-summon-section');
      expect(mainSummonSection).toHaveTextContent('editing');

      const friendSummonSection = screen.getByTestId('friend-summon-section');
      expect(friendSummonSection).toHaveTextContent('editing');

      const otherSummonSection = screen.getByTestId('other-summon-section');
      expect(otherSummonSection).toHaveTextContent('editing');

      const subSummonSection = screen.getByTestId('sub-summon-section');
      expect(subSummonSection).toHaveTextContent('editing');
    });
  });
});