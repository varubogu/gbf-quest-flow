import { render, screen, fireEvent } from '@testing-library/react';
import { WeaponPanel } from './index';
import useFlowStore from '@/core/stores/flowStore';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import type { Flow } from '@/types/types';

interface UseTranslationResult {
  t: (_key: string) => string;
}

// i18nのモック
vi.mock('react-i18next', () => ({
  useTranslation: (): UseTranslationResult => ({
    t: (key: string): string => key,
  }),
}));

// モックデータ
const mockFlowData: Flow = {
  title: 'テストフロー',
  quest: 'テストクエスト',
  author: 'テストユーザー',
  description: 'テスト用フローデータ',
  updateDate: '2024-03-21',
  note: 'テストノート',
  always: '',
  flow: [],
  organization: {
    job: {
      name: 'テストジョブ',
      note: 'テストジョブノート',
      equipment: {
        name: 'テスト装備',
        note: 'テスト装備ノート'
      },
      abilities: []
    },
    member: {
      front: [],
      back: []
    },
    weapon: {
      main: {
        name: 'テスト武器',
        additionalSkill: 'テストスキル',
        note: 'テストノート',
      },
      other: [
        {
          name: 'その他武器1',
          additionalSkill: 'その他スキル1',
          note: 'その他ノート1',
        },
      ],
      additional: [
        {
          name: '追加武器1',
          additionalSkill: '追加スキル1',
          note: '追加ノート1',
        },
      ],
    },
    weaponEffects: {
      taRate: '50%',
      hp: '3000',
      defense: '10%',
    },
    totalEffects: {
      taRate: '50%',
      hp: '3000',
      defense: '10%',
    },
    summon: {
      main: {
        name: 'テスト召喚石',
        note: 'テスト召喚石ノート'
      },
      friend: {
        name: 'フレンド召喚石',
        note: 'フレンド召喚石ノート'
      },
      other: [],
      sub: []
    }
  }
};

// モックの設定
vi.mock('@/core/stores/flowStore');

describe('WeaponPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // モックの実装を更新
    vi.mocked(useFlowStore).mockImplementation((selector) => {
      if (selector) {
        return selector({ flowData: mockFlowData });
      }
      return { flowData: mockFlowData, updateFlowData: vi.fn() };
    });
  });

  describe('単体テスト', () => {
    it('flowDataがnullの場合、nullを返す', () => {
      vi.mocked(useFlowStore).mockImplementation((selector) => {
        if (selector) {
          return selector({ flowData: null });
        }
        return { flowData: null, updateFlowData: vi.fn() };
      });

      const { container } = render(<WeaponPanel isEditing={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('updateFlowDataが正しく呼び出される', () => {
      const mockUpdateFlowData = vi.fn();
      vi.mocked(useFlowStore).mockImplementation((selector) => {
        if (selector) {
          return selector({ flowData: mockFlowData, updateFlowData: mockUpdateFlowData });
        }
        return { flowData: mockFlowData, updateFlowData: mockUpdateFlowData };
      });

      render(<WeaponPanel isEditing={true} />);

      // メイン武器の名前を変更
      const input = screen.getByDisplayValue('テスト武器');
      fireEvent.change(input, { target: { value: '新しい武器名' } });

      const expectedData = {
        organization: {
          ...mockFlowData.organization,
          weapon: {
            ...mockFlowData.organization.weapon,
            main: {
              ...mockFlowData.organization.weapon.main,
              name: '新しい武器名',
            },
          },
        },
      };

      expect(mockUpdateFlowData).toHaveBeenCalledWith(expectedData);
    });
  });

  describe('結合テスト', () => {
    it('表示モードで正しくデータが表示される', () => {
      render(<WeaponPanel isEditing={false} />);

      // メイン武器の確認
      expect(screen.getByText('テスト武器')).toBeInTheDocument();
      expect(screen.getByText('テストスキル')).toBeInTheDocument();
      expect(screen.getByText('テストノート')).toBeInTheDocument();

      // その他武器の確認
      expect(screen.getByText('その他武器1')).toBeInTheDocument();
      expect(screen.getByText('その他スキル1')).toBeInTheDocument();
      expect(screen.getByText('その他ノート1')).toBeInTheDocument();

      // 追加武器の確認
      expect(screen.getByText('追加武器1')).toBeInTheDocument();
      expect(screen.getByText('追加スキル1')).toBeInTheDocument();
      expect(screen.getByText('追加ノート1')).toBeInTheDocument();

      // スキル効果の確認
      expect(screen.getByText('50%')).toBeInTheDocument();
      expect(screen.getByText('3000')).toBeInTheDocument();
      expect(screen.getByText('10%')).toBeInTheDocument();
    });

    it('編集モードで入力フィールドが表示される', () => {
      render(<WeaponPanel isEditing={true} />);

      // メイン武器の入力フィールド確認
      expect(screen.getByDisplayValue('テスト武器')).toBeInTheDocument();
      expect(screen.getByDisplayValue('テストスキル')).toBeInTheDocument();
      expect(screen.getByDisplayValue('テストノート')).toBeInTheDocument();

      // その他武器の入力フィールド確認
      expect(screen.getByDisplayValue('その他武器1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('その他スキル1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('その他ノート1')).toBeInTheDocument();

      // 追加武器の入力フィールド確認
      expect(screen.getByDisplayValue('追加武器1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('追加スキル1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('追加ノート1')).toBeInTheDocument();

      // スキル効果の入力フィールド確認
      expect(screen.getByDisplayValue('50%')).toBeInTheDocument();
      expect(screen.getByDisplayValue('3000')).toBeInTheDocument();
      expect(screen.getByDisplayValue('10%')).toBeInTheDocument();
    });

    it('武器データの編集が正しく機能する', () => {
      const mockUpdateFlowData = vi.fn();
      vi.mocked(useFlowStore).mockImplementation((selector) => {
        if (selector) {
          return selector({ flowData: mockFlowData, updateFlowData: mockUpdateFlowData });
        }
        return { flowData: mockFlowData, updateFlowData: mockUpdateFlowData };
      });

      render(<WeaponPanel isEditing={true} />);

      // メイン武器、その他武器、追加武器の編集をテスト
      const inputs = [
        { current: 'テスト武器', new: '新メイン武器' },
        { current: 'その他武器1', new: '新その他武器' },
        { current: '追加武器1', new: '新追加武器' },
      ];

      inputs.forEach(({ current, new: newValue }) => {
        const input = screen.getByDisplayValue(current);
        fireEvent.change(input, { target: { value: newValue } });
      });

      // スキル効果の編集をテスト
      const skillInput = screen.getByDisplayValue('50%');
      fireEvent.change(skillInput, { target: { value: '60%' } });

      expect(mockUpdateFlowData).toHaveBeenCalled();
    });
  });
});