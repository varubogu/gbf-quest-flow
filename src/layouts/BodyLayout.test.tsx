import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BodyLayout from './BodyLayout';
import { renderWithI18n } from '@/test/i18n-test-utils';
import type { Flow } from '@/types/models';
import * as flowFacade from '@/core/facades/flowFacade';

// モック関数の宣言
const mockSetFlowData = vi.fn();
const mockSetIsEditMode = vi.fn();

// flowFacadeのモック
vi.mock('@/core/facades/flowFacade', () => ({
  setFlowData: vi.fn(),
  updateFlowData: vi.fn(),
  updateAction: vi.fn(),
  setIsEditMode: vi.fn(),
  createNewFlow: vi.fn()
}));

// 他のモックの設定
vi.mock('@/core/hooks/domain/flow/useUrlManagement', () => ({
  useUrlManagement: () => ({
    handleUrlChange: vi.fn()
  })
}));

vi.mock('@/core/hooks/domain/flow/useEditHistory', () => ({
  useEditHistory: () => ({
    recordChange: vi.fn(),
    clearHistory: vi.fn(),
    hasChanges: false,
    editHistory: []
  })
}));

vi.mock('@/core/hooks/domain/flow/useHistoryManagement', () => ({
  useHistoryManagement: vi.fn()
}));

vi.mock('@/core/hooks/domain/flow/useFlowDataModification', () => ({
  useFlowDataModification: () => ({
    handleTitleChange: vi.fn(),
    handleAlwaysChange: vi.fn()
  })
}));

vi.mock('@/core/hooks/ui/base/useKeyboardShortcuts', () => ({
  useKeyboardShortcuts: vi.fn()
}));

vi.mock('@/core/facades/flowEventService', () => ({
  handleFlowSave: vi.fn(),
  handleNewFlow: vi.fn(),
  handleExitEditMode: vi.fn()
}));

vi.mock('@/core/stores/flowStore', () => ({
  default: vi.fn((selector) => {
    return selector({
      flowData: null,
      setFlowData: mockSetFlowData
    });
  })
}));

vi.mock('@/core/stores/editModeStore', () => ({
  default: vi.fn((selector) => {
    return selector({
      isEditMode: false
    });
  })
}));

vi.mock('@/core/facades/editModeStoreFacade', () => ({
  default: vi.fn((selector) => {
    return selector({
      isEditMode: false,
      setIsEditMode: mockSetIsEditMode,
      createNewFlow: vi.fn()
    });
  })
}));

describe('BodyLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('初期データがない場合、EmptyLayoutを表示する', () => {
    renderWithI18n(<BodyLayout />);

    // ローディング状態が終わるとEmptyLayoutが表示される
    expect(screen.getByText('データが読み込まれていません')).toBeInTheDocument();
  });

  it('初期データがある場合、flowFacadeのsetFlowDataが呼ばれる', () => {
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
          abilities: []
        },
        member: {
          front: [],
          back: []
        },
        weapon: {
          main: { name: '', note: '', additionalSkill: '' },
          other: [],
          additional: []
        },
        weaponEffects: {
          taRate: '',
          hp: '',
          defense: ''
        },
        summon: {
          main: { name: '', note: '' },
          friend: { name: '', note: '' },
          other: [],
          sub: []
        },
        totalEffects: {
          taRate: '',
          hp: '',
          defense: ''
        }
      },
      always: 'テスト常時メモ',
      flow: []
    };

    renderWithI18n(<BodyLayout initialData={mockFlowData} />);

    // flowFacadeのsetFlowDataが呼ばれることを確認
    expect(flowFacade.setFlowData).toHaveBeenCalledWith(mockFlowData);
  });

  it('編集モードで初期化された場合、setIsEditModeが呼ばれる', async () => {
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
          abilities: []
        },
        member: {
          front: [],
          back: []
        },
        weapon: {
          main: { name: '', note: '', additionalSkill: '' },
          other: [],
          additional: []
        },
        weaponEffects: {
          taRate: '',
          hp: '',
          defense: ''
        },
        summon: {
          main: { name: '', note: '' },
          friend: { name: '', note: '' },
          other: [],
          sub: []
        },
        totalEffects: {
          taRate: '',
          hp: '',
          defense: ''
        }
      },
      always: 'テスト常時メモ',
      flow: []
    };

    renderWithI18n(<BodyLayout initialData={mockFlowData} initialMode="edit" />);

    // flowFacadeのsetIsEditModeが呼ばれることを確認
    expect(flowFacade.setIsEditMode).toHaveBeenCalledWith(true);
  });
});
