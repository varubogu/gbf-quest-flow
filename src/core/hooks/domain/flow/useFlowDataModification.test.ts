import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFlowDataModification } from './useFlowDataModification';
import type { Flow } from '@/types/models';

// FlowStoreのモック
const mockSetFlowData = vi.fn();
const mockStore = {
  setFlowData: mockSetFlowData,
};

vi.mock('@/stores/flowStore', () => ({
  default: (selector: (_state: typeof mockStore) => unknown): unknown => selector(mockStore),
}));

describe('useFlowDataModification', () => {
  const mockFlowData: Flow = {
    title: 'テストフロー',
    quest: 'テストクエスト',
    author: 'テスト作者',
    description: 'テスト説明',
    updateDate: '2024-01-01',
    note: 'テストノート',
    organization: {
      job: { name: '', note: '', equipment: { name: '', note: '' }, abilities: [] },
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
    always: 'テスト常時実行項目',
    flow: [],
  };

  const mockRecordChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('タイトルを変更できること', () => {
    const { result } = renderHook(() =>
      useFlowDataModification({
        flowData: mockFlowData,
        recordChange: mockRecordChange,
      })
    );

    const newTitle = 'テストフロー更新';
    const event = {
      target: { value: newTitle },
    } as React.ChangeEvent<HTMLInputElement>;

    result.current.handleTitleChange(event);

    const expectedData = {
      ...mockFlowData,
      title: newTitle,
    };

    expect(mockSetFlowData).toHaveBeenCalledWith(expectedData);
    expect(mockRecordChange).toHaveBeenCalledWith(expectedData);
  });

  it('常時実行項目を変更できること', () => {
    const { result } = renderHook(() =>
      useFlowDataModification({
        flowData: mockFlowData,
        recordChange: mockRecordChange,
      })
    );

    const newAlways = 'テスト常時実行項目更新';
    const event = {
      target: { value: newAlways },
    } as React.ChangeEvent<HTMLTextAreaElement>;

    result.current.handleAlwaysChange(event);

    const expectedData = {
      ...mockFlowData,
      always: newAlways,
    };

    expect(mockSetFlowData).toHaveBeenCalledWith(expectedData);
    expect(mockRecordChange).toHaveBeenCalledWith(expectedData);
  });

  it('flowDataがnullの場合、変更が実行されないこと', () => {
    const { result } = renderHook(() =>
      useFlowDataModification({
        flowData: null,
        recordChange: mockRecordChange,
      })
    );

    const titleEvent = {
      target: { value: 'テスト' },
    } as React.ChangeEvent<HTMLInputElement>;

    const alwaysEvent = {
      target: { value: 'テスト' },
    } as React.ChangeEvent<HTMLTextAreaElement>;

    result.current.handleTitleChange(titleEvent);
    result.current.handleAlwaysChange(alwaysEvent);

    expect(mockSetFlowData).not.toHaveBeenCalled();
    expect(mockRecordChange).not.toHaveBeenCalled();
  });
});