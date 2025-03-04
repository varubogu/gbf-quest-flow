import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFlowDataModification } from './useFlowDataModification';
import type { Flow } from '@/types/models';

// FlowStoreのモック
vi.mock('@/core/facades/flowFacade', () => ({
  updateFlowData: vi.fn()
}));

// flowEventServiceのモック
vi.mock('@/core/facades/flowEventService', () => ({
  handleFlowSave: vi.fn().mockResolvedValue(true),
  handleNewFlow: vi.fn(),
  handleCancel: vi.fn().mockResolvedValue(true)
}));

// i18nのモック
vi.mock('react-i18next', () => ({
  useTranslation: (): { t: (_key: string, _fallback: string) => string } => ({
    t: (_key: string, fallback: string): string => fallback
  })
}));

// モック関数の参照を取得
const mockUpdateFlowData = vi.mocked(
  (await import('@/core/facades/flowFacade')).updateFlowData
);

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

    expect(mockUpdateFlowData).toHaveBeenCalledWith({ title: newTitle });
    expect(mockRecordChange).toHaveBeenCalledWith({
      ...mockFlowData,
      title: newTitle,
    });
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

    expect(mockUpdateFlowData).toHaveBeenCalledWith({ always: newAlways });
    expect(mockRecordChange).toHaveBeenCalledWith({
      ...mockFlowData,
      always: newAlways,
    });
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

    expect(mockUpdateFlowData).not.toHaveBeenCalled();
    expect(mockRecordChange).not.toHaveBeenCalled();
  });

  it('保存処理が実行できること', async () => {
    const { result } = renderHook(() =>
      useFlowDataModification({
        flowData: mockFlowData,
        recordChange: mockRecordChange,
      })
    );

    const saveResult = await result.current.handleSave();

    const { handleFlowSave } = await import('@/core/facades/flowEventService');
    expect(handleFlowSave).toHaveBeenCalledWith(mockFlowData, null, expect.any(Function));
    expect(saveResult).toBe(true);
  });

  it('新規作成処理が実行できること', async () => {
    // window.confirmのモック
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);

    const { result } = renderHook(() =>
      useFlowDataModification({
        flowData: mockFlowData,
        recordChange: mockRecordChange,
      })
    );

    const newResult = await result.current.handleNew();

    const { handleNewFlow } = await import('@/core/facades/flowEventService');
    expect(handleNewFlow).toHaveBeenCalledWith(mockFlowData);
    expect(newResult).toBe(true);

    // モックを元に戻す
    window.confirm = originalConfirm;
  });

  it('キャンセル処理が実行できること', async () => {
    const { result } = renderHook(() =>
      useFlowDataModification({
        flowData: mockFlowData,
        recordChange: mockRecordChange,
        hasChanges: true,
      })
    );

    const cancelResult = await result.current.handleCancel();

    const { handleCancel } = await import('@/core/facades/flowEventService');
    expect(handleCancel).toHaveBeenCalledWith(true, expect.any(Function));
    expect(cancelResult).toBe(true);
  });
});