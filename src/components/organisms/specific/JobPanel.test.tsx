import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JobPanel } from './JobPanel';
import type { Flow } from '@/types/models';
import type { Job, JobAbility, JobEquipment } from '@/types/types';

// モックの設定
vi.mock('react-i18next', () => ({
  useTranslation: (): { t: (_key: string) => string } => ({
    t: (key: string): string => {
      const translations: Record<string, string> = {
        jobItem: '項目',
        jobValue: '値',
        overview: '概要',
        jobClass: 'ジョブ',
        jobMainHand: '特殊装備',
        characterAbilities: 'アビリティ',
      };
      return translations[key] || key;
    },
  }),
}));

// 新しいコンポーネントのモック
vi.mock('@/components/molecules/specific/JobInfoPanel', () => ({
  JobInfoPanel: vi.fn(({ job, _isEditing, _onJobChange }) => (
    <tr data-testid="job-info-panel">
      <td>ジョブ</td>
      <td>{job.name}</td>
      <td>{job.note}</td>
    </tr>
  )),
}));

vi.mock('@/components/molecules/specific/JobEquipmentPanel', () => ({
  JobEquipmentPanel: vi.fn(({ equipment, _isEditing, _onEquipmentChange }) => (
    <tr data-testid="job-equipment-panel">
      <td>特殊装備</td>
      <td>{equipment.name}</td>
      <td>{equipment.note}</td>
    </tr>
  )),
}));

vi.mock('@/components/molecules/specific/AbilityRow', () => ({
  AbilityRow: vi.fn(({ ability, index, _isEditing, totalAbilities, _onAbilityChange }) => (
    <tr data-testid={`ability-row-${index}`}>
      {index === 0 && <td rowSpan={totalAbilities}>アビリティ</td>}
      <td>{ability.name}</td>
      <td>{ability.note}</td>
    </tr>
  )),
}));

// カスタムフックのモック
const handleJobChangeMock = vi.fn();
const handleEquipmentChangeMock = vi.fn();
const handleAbilityChangeMock = vi.fn();

vi.mock('@/core/hooks/ui/specific/useJobPanelHandlers', () => ({
  useJobPanelHandlers: vi.fn(() => ({
    flowData: currentFlowData,
    handleJobChange: handleJobChangeMock,
    handleEquipmentChange: handleEquipmentChangeMock,
    handleAbilityChange: handleAbilityChangeMock,
  })),
}));

// テスト用のモックデータ
const mockAbilities: JobAbility[] = [
  { name: 'アビリティ1', note: 'アビリティ1の説明' },
  { name: 'アビリティ2', note: 'アビリティ2の説明\n複数行あり' },
];

const mockEquipment: JobEquipment = {
  name: 'テスト装備',
  note: 'テスト装備の説明',
};

const mockJob: Job = {
  name: 'テストジョブ',
  note: 'テストジョブの説明',
  equipment: mockEquipment,
  abilities: mockAbilities,
};

const mockFlowData: Flow = {
  title: 'テストフロー',
  quest: 'テストクエスト',
  author: 'テスト作者',
  description: 'テスト説明',
  updateDate: '2023-01-01',
  note: 'テストノート',
  organization: {
    job: mockJob,
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
    totalEffects: { taRate: '', hp: '', defense: '' },
  },
  always: '',
  flow: [],
};

// flowStoreのモック
let currentFlowData: Flow | null = mockFlowData;

describe('JobPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentFlowData = mockFlowData;
  });

  describe('単体テスト', () => {
    it('ジョブパネルが表示されること', () => {
      render(<JobPanel isEditing={false} />);

      // テーブルヘッダーが表示されていることを確認
      expect(screen.getByText('項目')).toBeInTheDocument();
      expect(screen.getByText('値')).toBeInTheDocument();
      expect(screen.getByText('概要')).toBeInTheDocument();

      // 各コンポーネントが表示されていることを確認
      expect(screen.getByTestId('job-info-panel')).toBeInTheDocument();
      expect(screen.getByTestId('job-equipment-panel')).toBeInTheDocument();
      expect(screen.getByTestId('ability-row-0')).toBeInTheDocument();
      expect(screen.getByTestId('ability-row-1')).toBeInTheDocument();
    });

    it('flowDataがnullの場合、nullを返すこと', () => {
      // flowDataをnullに設定
      currentFlowData = null;

      const { container } = render(<JobPanel isEditing={false} />);

      // 何も表示されないことを確認
      expect(container.firstChild).toBeNull();
    });
  });
});