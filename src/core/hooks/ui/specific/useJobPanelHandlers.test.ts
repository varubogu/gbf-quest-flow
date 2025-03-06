import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useJobPanelHandlers } from './useJobPanelHandlers';
import type { Flow } from '@/types/models';
import type { Job, JobAbility, JobEquipment } from '@/types/types';
import type { FlowStore } from '@/types/flowStore.types';

// テスト用のモックデータ
const mockAbilities: JobAbility[] = [
  { name: 'アビリティ1', note: 'アビリティ1の説明' },
  { name: 'アビリティ2', note: 'アビリティ2の説明' },
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

describe('useJobPanelHandlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentFlowData = mockFlowData;
  });

  it('flowDataが正しく取得できること', () => {
    const { result } = renderHook(() => useJobPanelHandlers());

    expect(result.current.flowData).toEqual(mockFlowData);
  });

  it('handleJobChangeでジョブ名を変更するとupdateFlowDataが呼ばれること', () => {
    const { result } = renderHook(() => useJobPanelHandlers());

    act(() => {
      result.current.handleJobChange('name', '新しいジョブ');
    });

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

  it('handleEquipmentChangeで装備名を変更するとupdateFlowDataが呼ばれること', () => {
    const { result } = renderHook(() => useJobPanelHandlers());

    act(() => {
      result.current.handleEquipmentChange('name', '新しい装備');
    });

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

  it('handleAbilityChangeでアビリティ名を変更するとupdateFlowDataが呼ばれること', () => {
    const { result } = renderHook(() => useJobPanelHandlers());

    act(() => {
      result.current.handleAbilityChange(0, 'name', '新しいアビリティ');
    });

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

  it('flowDataがnullの場合、handleJobChangeは何も行わないこと', () => {
    currentFlowData = null;
    const { result } = renderHook(() => useJobPanelHandlers());

    act(() => {
      result.current.handleJobChange('name', '新しいジョブ');
    });

    expect(updateFlowDataMock).not.toHaveBeenCalled();
  });
});