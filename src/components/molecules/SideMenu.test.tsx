import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { SideMenu } from './SideMenu';
import { vi } from 'vitest';
import type { Flow } from '@/types/models';

// モックの作成
vi.mock('react-i18next', () => ({
  // Trans and Translation components
  Trans: ({ children }: { children: unknown }) => children,
  Translation: ({ children }: { children: unknown }) => children,
  // hooks
  useTranslation: () => ({
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

const mockSetIsEditMode = vi.fn();
const mockLoadFlowFromFile = vi.fn();
const mockCancelEdit = vi.fn();
const mockUseFlowStore = vi.fn(() => ({
  flowData: null as Flow | null,
  originalData: null as Flow | null,
  isEditMode: false,
  setIsEditMode: mockSetIsEditMode,
  loadFlowFromFile: mockLoadFlowFromFile,
  cancelEdit: mockCancelEdit,
}));

vi.mock('@/stores/flowStore', () => ({
  default: () => mockUseFlowStore(),
}));

describe('SideMenu', () => {
  const mockOnSave = vi.fn();
  const mockOnNew = vi.fn();
  const mockOnExitEditMode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFlowStore.mockImplementation(() => ({
      flowData: null,
      originalData: null,
      isEditMode: false,
      setIsEditMode: mockSetIsEditMode,
      loadFlowFromFile: mockLoadFlowFromFile,
      cancelEdit: mockCancelEdit,
    }));
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
    mockUseFlowStore.mockImplementation(() => ({
      flowData: null,
      originalData: null,
      isEditMode: false,
      setIsEditMode: mockSetIsEditMode,
      loadFlowFromFile: mockLoadFlowFromFile,
      cancelEdit: mockCancelEdit,
    }));

    render(
      <SideMenu onSave={mockOnSave} onNew={mockOnNew} onExitEditMode={mockOnExitEditMode} />
    );
    fireEvent.click(screen.getByLabelText('メニューを開く'));
    const newButton = screen.getByText('newData', { exact: false });
    newButton.click();
    await vi.waitFor(() => {
      mockUseFlowStore().isEditMode = true;
    });
    expect(mockOnNew).toHaveBeenCalledTimes(1);
  });

  // 編集モード時のテスト
  it('shows save button when in edit mode', () => {
    mockUseFlowStore.mockImplementation(() => ({
      flowData: {
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
      } as Flow,
      originalData: null,
      isEditMode: true,
      setIsEditMode: mockSetIsEditMode,
      loadFlowFromFile: mockLoadFlowFromFile,
      cancelEdit: mockCancelEdit,
    }));

    render(
      <SideMenu onSave={mockOnSave} onNew={mockOnNew} onExitEditMode={mockOnExitEditMode} />
    );
    fireEvent.click(screen.getByLabelText('メニューを開く'));
    expect(screen.getByText('save')).toBeInTheDocument();
  });
});