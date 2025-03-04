import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkillTotalPanel } from './SkillTotalPanel';
import type { Flow } from '@/types/models';
import type { WeaponSkillTotal } from '@/types/types';
import type { FlowStore } from '@/types/flowStore.types';
import type { JSX } from 'react';

// モックの設定
vi.mock('react-i18next', () => ({
  useTranslation: (): { t: (_key: string) => string } => ({
    t: (key: string): string => {
      const translations: Record<string, string> = {
        totalAmount: '合計値',
      };
      return translations[key] || key;
    },
  }),
}));

// SkillTableコンポーネントのモック
vi.mock('@/components/molecules/SkillTable', () => ({
  SkillTable: (
    { id,
      isEditing,
      titleKey,
      values,
      onChange,
    }: {
      id: string,
      isEditing: boolean,
      titleKey: string,
      values: Record<string, string>,
      onChange: (_key: string, _value: string) => void
    }): JSX.Element => (
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

// flowStoreのモック
let currentFlowData: Flow | null = mockFlowData;
vi.mock('@/core/stores/flowStore', () => ({
  __esModule: true,
  default: vi.fn((selector: (_state: FlowStore) => Partial<FlowStore>) => selector({ flowData: currentFlowData } as FlowStore))
}));

// flowFacadeのモック
const updateFlowDataMock = vi.fn();
vi.mock('@/core/facades/flowFacade', () => ({
  updateFlowData: vi.fn((...args) => updateFlowDataMock(...args))
}));

describe('SkillTotalPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentFlowData = mockFlowData;
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
      currentFlowData = null;

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
      expect(updateFlowDataMock).toHaveBeenCalledTimes(1);
      expect(updateFlowDataMock).toHaveBeenCalledWith({
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