import { render, screen, fireEvent, act } from '@testing-library/react';
import { SideMenu } from './SideMenu';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Flow } from '@/types/models';
import { handleNewFlow } from '@/services/flowEventService';
import type { FlowStore } from '@/stores/flowStore';
// モックの作成
vi.mock('@/services/flowEventService', () => ({
  handleNewFlow: vi.fn().mockResolvedValue(true),
}));

vi.mock('react-i18next', () => ({
  // Trans and Translation components
  Trans: ({ children }: { children: unknown }): unknown => children,
  Translation: ({ children }: { children: unknown }): unknown => children,
  // hooks
  useTranslation: (): {
    t: (_key: string) => string;
    i18n: {
      changeLanguage: () => void;
      language: string;
    };
  } => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
      language: 'ja',
    },
  }),
  // init
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

// FileOperationsのモック
vi.mock('@/utils/FileOperations', () => ({
  shouldConfirmDiscard: (): boolean => true,
  showNoDataAlert: vi.fn(),
  downloadFlow: vi.fn(),
  getDownloadFilename: vi.fn(),
}));

interface UseFlowStoreResult {
  store: FlowStore;
  mockSetIsEditMode: () => void;
  mockLoadFlowFromFile: () => void;
  mockCancelEdit: () => void;
}

// Zustandストアのモック
const createMockStore = (): UseFlowStoreResult => {
  const mockSetIsEditMode = vi.fn();
  const mockLoadFlowFromFile = vi.fn();
  const mockCancelEdit = vi.fn();

  const store: FlowStore = {
    flowData: null as Flow | null,
    originalData: null as Flow | null,
    isEditMode: false,
    setIsEditMode: mockSetIsEditMode,
    loadFlowFromFile: mockLoadFlowFromFile,
    cancelEdit: mockCancelEdit,
    currentRow: 0,
    history: { past: [], future: [] },
    setCurrentRow: vi.fn(),
    updateFlowData: vi.fn(),
    pushToHistory: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    clearHistory: vi.fn(),
    createNewFlow: vi.fn(),
    updateAction: vi.fn(),
    setFlowData: vi.fn(),
  };

  return {
    store,
    mockSetIsEditMode,
    mockLoadFlowFromFile,
    mockCancelEdit,
  };
};

const mockStore = createMockStore();

vi.mock('@/stores/flowStore', () => ({
  default: vi.fn((selector: (_store: typeof mockStore.store) => unknown) => selector(mockStore.store)),
}));

describe('SideMenu', () => {
  const mockOnSave = vi.fn();
  const mockOnNew = vi.fn();
  const mockOnExitEditMode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // ストアの状態をリセット
    mockStore.store.flowData = null;
    mockStore.store.originalData = null;
    mockStore.store.isEditMode = false;
  });

  it('renders hamburger menu button', () => {
    render(
      <SideMenu onSave={mockOnSave} onNew={mockOnNew} onExitEditMode={mockOnExitEditMode} />
    );
    expect(screen.getByLabelText('メニューを開く')).toBeInTheDocument();
  });

  it('opens menu when hamburger button is clicked', () => {
    render(
      <SideMenu onSave={mockOnSave} onNew={mockOnNew} onExitEditMode={mockOnExitEditMode} />
    );
    fireEvent.click(screen.getByLabelText('メニューを開く'));
    expect(screen.getByText('menu')).toBeInTheDocument();
  });

  it('shows options panel when options button is clicked', async () => {
    render(
      <SideMenu onSave={mockOnSave} onNew={mockOnNew} onExitEditMode={mockOnExitEditMode} />
    );
    fireEvent.click(screen.getByLabelText('メニューを開く'));
    fireEvent.click(screen.getByText('options'));
    expect(screen.getByText(/back/i)).toBeInTheDocument();
  });

  it('calls onNew when new button is clicked', async () => {
    // 明示的にモックの状態を設定
    mockStore.store.flowData = null;
    mockStore.store.originalData = null;
    mockStore.store.isEditMode = false;

    mockOnNew.mockImplementation(() => {
      mockStore.store.isEditMode = true;
    });

    render(
      <SideMenu onSave={mockOnSave} onNew={mockOnNew} onExitEditMode={mockOnExitEditMode} />
    );

    // メニューを開く
    await act(async () => {
      const menuButton = screen.getByLabelText('メニューを開く');
      fireEvent.click(menuButton);
    });

    // メニューが表示されるのを待つ
    await vi.waitFor(() => {
      expect(screen.getByText('menu')).toBeInTheDocument();
    });

    // 新規作成ボタンをクリック
    await act(async () => {
      const newButton = screen.getByRole('button', { name: /newData/i });
      fireEvent.click(newButton);
    });

    // サービスの呼び出しを確認
    expect(handleNewFlow).toHaveBeenCalledWith(null);
    // コールバックの呼び出しを確認
    expect(mockOnNew).toHaveBeenCalledTimes(1);
  });

  // 編集モード時のテスト
  it('shows save button when in edit mode', () => {
    mockStore.store.flowData = {
      title: 'Test Flow',
      quest: '',
      author: '',
      description: '',
      updateDate: '',
      note: '',
      organization: {
        job: {
          name: '',
          note: '',
          equipment: {
            name: '',
            note: '',
          },
          abilities: [],
        },
        member: {
          front: [],
          back: [],
        },
        weapon: {
          main: {
            name: '',
            note: '',
            additionalSkill: '',
          },
          other: [],
          additional: [],
        },
        weaponEffects: {
          taRate: '',
          hp: '',
          defense: '',
        },
        summon: {
          main: { name: '', note: '' },
          friend: { name: '', note: '' },
          other: [],
          sub: [],
        },
        totalEffects: {
          taRate: '',
          hp: '',
          defense: '',
        },
      },
      always: '',
      flow: [],
    } as Flow;
    mockStore.store.originalData = null;
    mockStore.store.isEditMode = true;

    render(
      <SideMenu onSave={mockOnSave} onNew={mockOnNew} onExitEditMode={mockOnExitEditMode} />
    );
    fireEvent.click(screen.getByLabelText('メニューを開く'));
    expect(screen.getByText('save')).toBeInTheDocument();
  });
});