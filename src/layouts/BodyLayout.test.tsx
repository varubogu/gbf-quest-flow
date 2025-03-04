import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BodyLayout from './BodyLayout';
import { renderWithI18n } from '@/test/i18n-test-utils';
import type { Flow } from '@/types/models';
import * as flowFacade from '@/core/facades/flowFacade';
import * as editModeStoreFacade from '@/core/facades/editModeStoreFacade';
import type { EditModeStore, FlowStore } from '@/types/flowStore.types';

// vi.mockの呼び出しはファイルの先頭に巻き上げられるため、
// 変数宣言の前に配置する必要があります
// flowFacadeのモック
vi.mock('@/core/facades/flowFacade', () => ({
  setFlowData: vi.fn(),
  updateFlowData: vi.fn(),
  updateAction: vi.fn(),
  setIsEditMode: vi.fn(),
  createNewFlow: vi.fn()
}));

// editModeStoreFacadeのモックを正しく実装
vi.mock('@/core/facades/editModeStoreFacade', () => ({
  setIsEditMode: vi.fn(),
  startEdit: vi.fn(),
  createNewFlow: vi.fn(),
  getIsEditMode: vi.fn(),
  finishEdit: vi.fn(),
  cancelEdit: vi.fn()
}));

// 他のモックの設定
vi.mock('@/core/hooks/domain/flow/useUrlManagement', () => ({
  useUrlManagement: (): {
    handleUrlChange: () => void;
  } => ({
    handleUrlChange: vi.fn()
  })
}));

vi.mock('@/core/hooks/domain/flow/useEditHistory', () => ({
  useEditHistory: (): {
    recordChange: () => void;
    clearHistory: () => void;
    hasChanges: boolean;
    editHistory: unknown[];
  } => ({
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
  useFlowDataModification: (): {
    handleTitleChange: () => void;
    handleAlwaysChange: () => void;
  } => ({
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
  default: vi.fn((selector: (_state: FlowStore) => Partial<FlowStore>) => {
    return selector({
      flowData: null,
      setFlowData: vi.fn(),
      originalData: null,
      getFlowData: vi.fn(),
      getActionById: vi.fn(),
    });
  })
}));

vi.mock('@/core/stores/editModeStore', () => ({
  default: vi.fn((selector: (_state: EditModeStore) => Partial<EditModeStore>) => {
    return selector({
      isEditMode: false,
      getIsEditMode: vi.fn(),
      setIsEditMode: vi.fn(),
      startEdit: vi.fn(),
      endEdit: vi.fn(),
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

  it('編集モードで初期化された場合、startEditが呼ばれる', async () => {
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

    // editModeStoreFacadeのstartEditが呼ばれることを確認
    expect(editModeStoreFacade.startEdit).toHaveBeenCalled();
  });
});
