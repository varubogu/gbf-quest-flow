import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSummonHandlers } from './useSummonHandlers';
import type { Flow } from '@/types/models';
import type { Summon } from '@/types/types';
import type { FlowStore } from '@/types/flowStore.types';

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
vi.mock('@/core/stores/flowStore', () => ({
  __esModule: true,
  default: vi.fn((selector: (_state: FlowStore) => Partial<FlowStore>) => selector({ flowData: currentFlowData } as FlowStore))
}));

// flowFacadeのモック
const updateFlowDataMock = vi.fn();
vi.mock('@/core/facades/flowFacade', () => ({
  updateFlowData: vi.fn((...args) => updateFlowDataMock(...args))
}));

describe('useSummonHandlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentFlowData = mockFlowData;
  });

  it('flowDataが正しく取得できること', () => {
    const { result } = renderHook(() => useSummonHandlers());

    expect(result.current.flowData).toEqual(mockFlowData);
  });

  it('handleSummonChangeでメイン召喚石を変更するとupdateFlowDataが呼ばれること', () => {
    const { result } = renderHook(() => useSummonHandlers());

    act(() => {
      result.current.handleSummonChange('main', null, 'name', '新しいメイン召喚石');
    });

    expect(updateFlowDataMock).toHaveBeenCalledWith({
      organization: {
        ...mockFlowData.organization,
        summon: {
          ...mockFlowData.organization.summon,
          main: {
            ...mockFlowData.organization.summon.main,
            name: '新しいメイン召喚石',
          },
        },
      },
    });
  });

  it('handleSummonChangeでフレンド召喚石を変更するとupdateFlowDataが呼ばれること', () => {
    const { result } = renderHook(() => useSummonHandlers());

    act(() => {
      result.current.handleSummonChange('friend', null, 'note', '新しいフレンド召喚石の説明');
    });

    expect(updateFlowDataMock).toHaveBeenCalledWith({
      organization: {
        ...mockFlowData.organization,
        summon: {
          ...mockFlowData.organization.summon,
          friend: {
            ...mockFlowData.organization.summon.friend,
            note: '新しいフレンド召喚石の説明',
          },
        },
      },
    });
  });

  it('handleSummonChangeでその他召喚石を変更するとupdateFlowDataが呼ばれること', () => {
    const { result } = renderHook(() => useSummonHandlers());

    act(() => {
      result.current.handleSummonChange('other', 0, 'name', '新しいその他召喚石');
    });

    expect(updateFlowDataMock).toHaveBeenCalledWith({
      organization: {
        ...mockFlowData.organization,
        summon: {
          ...mockFlowData.organization.summon,
          other: [
            {
              ...mockFlowData.organization.summon.other[0],
              name: '新しいその他召喚石',
            },
            mockFlowData.organization.summon.other[1],
          ],
        },
      },
    });
  });

  it('handleSummonChangeでサブ召喚石を変更するとupdateFlowDataが呼ばれること', () => {
    const { result } = renderHook(() => useSummonHandlers());

    act(() => {
      result.current.handleSummonChange('sub', 1, 'note', '新しいサブ召喚石の説明');
    });

    expect(updateFlowDataMock).toHaveBeenCalledWith({
      organization: {
        ...mockFlowData.organization,
        summon: {
          ...mockFlowData.organization.summon,
          sub: [
            mockFlowData.organization.summon.sub[0],
            {
              ...mockFlowData.organization.summon.sub[1],
              note: '新しいサブ召喚石の説明',
            },
          ],
        },
      },
    });
  });

  it('flowDataがnullの場合、handleSummonChangeは何も行わないこと', () => {
    currentFlowData = null;
    const { result } = renderHook(() => useSummonHandlers());

    act(() => {
      result.current.handleSummonChange('main', null, 'name', '新しいメイン召喚石');
    });

    expect(updateFlowDataMock).not.toHaveBeenCalled();
  });
});