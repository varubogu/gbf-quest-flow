import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkillTotalPanel } from './SkillTotalPanel';
import useBaseFlowStore from '@/core/stores/baseFlowStore';
import type { Flow } from '@/types/models';
import type { WeaponSkillTotal } from '@/types/types';

// モックの設定
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        totalAmount: '合計値',
      };
      return translations[key] || key;
    },
  }),
}));

// SkillTableコンポーネントのモック
vi.mock('@/components/molecules/SkillTable', () => ({
  SkillTable: ({ id, isEditing, titleKey, values, onChange }) => (
    <div data-testid="skill-table" id={id}>
      <div data-testid="skill-table-title">{titleKey}</div>
      <div data-testid="skill-table-editing">{isEditing ? 'true' : 'false'}</div>
      <div data-testid="skill-table-values">
        {Object.entries(values).map(([key, value]) => (
          <div key={key} data-testid={`skill-value-${key}`}>
            {key}: {value}
          </div>
        ))}
      </div>
      <button
        data-testid="skill-table-change-button"
        onClick={() => onChange('taRate', '変更後のTA率')}
      >
        値を変更
      </button>
    </div>
  ),
}));

vi.mock('@/core/stores/baseFlowStore');

describe('SkillTotalPanel', () => {
  // テスト用のモックデータ
  const mockSkillTotal: WeaponSkillTotal = {
    taRate: '10%',
    hp: '200%',
    defense: '50%',
  };

  const mockFlowData: Flow = {
    title: 'テストフロー',
    quest: 'テストクエスト',
    author: 'テスト作者',
    description: 'テスト説明',
    updateDate: '2023-01-01',
    note: 'テストノート',
    organization: {
      job: {
        name: 'テストジョブ',
        note: 'テストジョブの説明',
        equipment: { name: 'テスト装備', note: 'テスト装備の説明' },
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
        main: { name: '', note: '' },
        friend: { name: '', note: '' },
        other: [],
        sub: [],
      },
      totalEffects: mockSkillTotal,
    },
    always: '',
    flow: [],
  };

  const mockUpdateFlowData = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // useBaseFlowStoreのモック
    (useBaseFlowStore as any).mockImplementation((selector: Function) => {
      const state = { flowData: mockFlowData, updateFlowData: mockUpdateFlowData };
      return selector(state);
    });
  });

  describe('単体テスト', () => {
    it('スキル総合値パネルが表示されること', () => {
      render(<SkillTotalPanel isEditing={false} />);

      // SkillTableコンポーネントが表示されていることを確認
      expect(screen.getByTestId('skill-table')).toBeInTheDocument();
      expect(screen.getByTestId('skill-table')).toHaveAttribute('id', 'skill-total-table');

      // タイトルが正しく設定されていることを確認
      expect(screen.getByTestId('skill-table-title')).toHaveTextContent('totalAmount');

      // 編集モードが正しく設定されていることを確認
      expect(screen.getByTestId('skill-table-editing')).toHaveTextContent('false');

      // スキル値が表示されていることを確認
      expect(screen.getByTestId('skill-value-taRate')).toHaveTextContent('taRate: 10%');
      expect(screen.getByTestId('skill-value-hp')).toHaveTextContent('hp: 200%');
      expect(screen.getByTestId('skill-value-defense')).toHaveTextContent('defense: 50%');
    });

    it('編集モードが正しく設定されること', () => {
      render(<SkillTotalPanel isEditing={true} />);

      // 編集モードが正しく設定されていることを確認
      expect(screen.getByTestId('skill-table-editing')).toHaveTextContent('true');
    });

    it('flowDataがnullの場合、nullを返すこと', () => {
      // flowDataをnullに設定
      (useBaseFlowStore as any).mockImplementation((selector: Function) => {
        const state = { flowData: null, updateFlowData: mockUpdateFlowData };
        return selector(state);
      });

      const { container } = render(<SkillTotalPanel isEditing={false} />);

      // 何も表示されないことを確認
      expect(container.firstChild).toBeNull();
    });
  });

  describe('結合テスト', () => {
    it('スキル値を変更するとupdateFlowData関数が呼ばれること', () => {
      render(<SkillTotalPanel isEditing={true} />);

      // 値変更ボタンをクリック
      const changeButton = screen.getByTestId('skill-table-change-button');
      changeButton.click();

      // updateFlowData関数が呼ばれたことを確認
      expect(mockUpdateFlowData).toHaveBeenCalledTimes(1);
      expect(mockUpdateFlowData).toHaveBeenCalledWith({
        organization: {
          ...mockFlowData.organization,
          totalEffects: {
            ...mockFlowData.organization.totalEffects,
            taRate: '変更後のTA率',
          },
        },
      });
    });
  });
});