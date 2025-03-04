import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JobPanel } from './JobPanel';
import type { Flow } from '@/types/models';
import type { Job, JobAbility, JobEquipment } from '@/types/types';
import type { FlowStore } from '@/types/flowStore.types';

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

vi.mock('@/core/hooks/ui/base/useAutoResizeTextArea', () => ({
  useAutoResizeTextArea: (): { current: null } => ({ current: null }),
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
vi.mock('@/core/stores/flowStore', () => ({
  __esModule: true,
  default: vi.fn((selector: (_state: FlowStore) => Partial<FlowStore>) => selector({ flowData: currentFlowData } as FlowStore))
}));

// flowFacadeのモック
const updateFlowDataMock = vi.fn();
vi.mock('@/core/facades/flowFacade', () => ({
  updateFlowData: vi.fn((...args) => updateFlowDataMock(...args))
}));

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

      // ジョブ情報が表示されていることを確認
      expect(screen.getByText('ジョブ')).toBeInTheDocument();
      expect(screen.getByText('テストジョブ')).toBeInTheDocument();
      expect(screen.getByText('テストジョブの説明')).toBeInTheDocument();

      // 特殊装備情報が表示されていることを確認
      expect(screen.getByText('特殊装備')).toBeInTheDocument();
      expect(screen.getByText('テスト装備')).toBeInTheDocument();
      expect(screen.getByText('テスト装備の説明')).toBeInTheDocument();

      // アビリティ情報が表示されていることを確認
      expect(screen.getByText('アビリティ')).toBeInTheDocument();
      expect(screen.getByText('アビリティ1')).toBeInTheDocument();
      expect(screen.getByText('アビリティ1の説明')).toBeInTheDocument();
      expect(screen.getByText('アビリティ2')).toBeInTheDocument();
      expect(screen.getByText('アビリティ2の説明複数行あり')).toBeInTheDocument();
    });

    it('flowDataがnullの場合、nullを返すこと', () => {
      // flowDataをnullに設定
      currentFlowData = null;

      const { container } = render(<JobPanel isEditing={false} />);

      // 何も表示されないことを確認
      expect(container.firstChild).toBeNull();
    });
  });

  describe('結合テスト', () => {
    it('編集モードでジョブ名を変更するとupdateFlowData関数が呼ばれること', () => {
      render(<JobPanel isEditing={true} />);

      // ジョブ名の入力フィールドを取得
      const jobNameInput = screen.getByDisplayValue('テストジョブ');
      expect(jobNameInput).toBeInTheDocument();

      // ジョブ名を変更
      fireEvent.change(jobNameInput, { target: { value: '新しいジョブ' } });

      // updateFlowData関数が呼ばれたことを確認
      expect(updateFlowDataMock).toHaveBeenCalledWith({
        organization: {
          ...mockFlowData.organization,
          job: {
            ...mockFlowData.organization.job,
            name: '新しいジョブ',
          },
        },
      });
    });

    it('編集モードでジョブ説明を変更するとupdateFlowData関数が呼ばれること', () => {
      render(<JobPanel isEditing={true} />);

      // ジョブ説明の入力フィールドを取得
      const jobNoteTextarea = screen.getByDisplayValue('テストジョブの説明');
      expect(jobNoteTextarea).toBeInTheDocument();

      // ジョブ説明を変更
      fireEvent.change(jobNoteTextarea, { target: { value: '新しいジョブの説明' } });

      // updateFlowData関数が呼ばれたことを確認
      expect(updateFlowDataMock).toHaveBeenCalledWith({
        organization: {
          ...mockFlowData.organization,
          job: {
            ...mockFlowData.organization.job,
            note: '新しいジョブの説明',
          },
        },
      });
    });

    it('編集モードで特殊装備名を変更するとupdateFlowData関数が呼ばれること', () => {
      render(<JobPanel isEditing={true} />);

      // 特殊装備名の入力フィールドを取得
      const equipmentNameInput = screen.getByDisplayValue('テスト装備');
      expect(equipmentNameInput).toBeInTheDocument();

      // 特殊装備名を変更
      fireEvent.change(equipmentNameInput, { target: { value: '新しい装備' } });

      // updateFlowData関数が呼ばれたことを確認
      expect(updateFlowDataMock).toHaveBeenCalledWith({
        organization: {
          ...mockFlowData.organization,
          job: {
            ...mockFlowData.organization.job,
            equipment: {
              ...mockFlowData.organization.job.equipment,
              name: '新しい装備',
            },
          },
        },
      });
    });

    it('編集モードでアビリティ名を変更するとupdateFlowData関数が呼ばれること', () => {
      render(<JobPanel isEditing={true} />);

      // アビリティ名の入力フィールドを取得（最初のアビリティ）
      const abilityNameInput = screen.getByDisplayValue('アビリティ1');
      expect(abilityNameInput).toBeInTheDocument();

      // アビリティ名を変更
      fireEvent.change(abilityNameInput, { target: { value: '新しいアビリティ' } });

      // updateFlowData関数が呼ばれたことを確認
      expect(updateFlowDataMock).toHaveBeenCalledWith({
        organization: {
          ...mockFlowData.organization,
          job: {
            ...mockFlowData.organization.job,
            abilities: [
              {
                ...mockFlowData.organization.job.abilities[0],
                name: '新しいアビリティ',
              },
              mockFlowData.organization.job.abilities[1],
            ],
          },
        },
      });
    });

    it('編集モードでアビリティ説明を変更するとupdateFlowData関数が呼ばれること', () => {
      render(<JobPanel isEditing={true} />);

      // アビリティ説明の入力フィールドを取得（最初のアビリティ）
      const abilityNoteTextarea = screen.getByDisplayValue('アビリティ1の説明');
      expect(abilityNoteTextarea).toBeInTheDocument();

      // アビリティ説明を変更
      fireEvent.change(abilityNoteTextarea, { target: { value: '新しいアビリティの説明' } });

      // updateFlowData関数が呼ばれたことを確認
      expect(updateFlowDataMock).toHaveBeenCalledWith({
        organization: {
          ...mockFlowData.organization,
          job: {
            ...mockFlowData.organization.job,
            abilities: [
              {
                ...mockFlowData.organization.job.abilities[0],
                note: '新しいアビリティの説明',
              },
              mockFlowData.organization.job.abilities[1],
            ],
          },
        },
      });
    });

    it('閲覧モードでは入力フィールドが表示されないこと', () => {
      render(<JobPanel isEditing={false} />);

      // 入力フィールドが表示されていないことを確認
      expect(screen.queryByDisplayValue('テストジョブ')).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue('テストジョブの説明')).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue('テスト装備')).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue('テスト装備の説明')).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue('アビリティ1')).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue('アビリティ1の説明')).not.toBeInTheDocument();
    });
  });
});