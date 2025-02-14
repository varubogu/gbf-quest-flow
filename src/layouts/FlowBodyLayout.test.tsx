import { render, screen } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FlowBodyLayout from './FlowBodyLayout';
import type { ReactNode } from 'react';
import type { Flow, Action } from '@/types/models';
import type { StoreApi } from 'zustand';
import useFlowStore from '@/stores/flowStore';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';

// FlowStoreの型定義
interface FlowStore {
  flowData: Flow | null;
  setFlowData: (data: Flow | null) => void;
  isEditMode: boolean;
  setIsEditMode: (isEdit: boolean) => void;
  createNewFlow: () => void;
  updateFlowData: (update: Partial<Flow>) => void;
  currentRow: number;
  setCurrentRow: (row: number) => void;
  loadFlowFromFile: () => Promise<void>;
  cancelEdit: () => void;
  updateAction: (index: number, updates: Partial<Action>) => void;
}

vi.mock('@/stores/flowStore', () => {
  const store = {
    flowData: null as Flow | null,
    isEditMode: false,
    currentRow: 0,
    setFlowData: vi.fn(),
    setIsEditMode: vi.fn(),
    createNewFlow: vi.fn(),
    updateFlowData: vi.fn(),
    setCurrentRow: vi.fn(),
    loadFlowFromFile: vi.fn(),
    cancelEdit: vi.fn(),
    updateAction: vi.fn(),
  };

  type StoreType = typeof store;
  interface UseStoreType {
    (selector?: (state: StoreType) => any): any;
    getState: () => StoreType;
  }

  const mockFunction = vi.fn((selector = (state: StoreType) => state) => selector(store));
  const useStore = Object.assign(mockFunction, {
    getState: () => store
  }) as UseStoreType;

  return {
    default: useStore
  };
});

vi.mock('react-i18next');
vi.mock('i18next');
vi.mock('@/stores/errorStore');
vi.mock('@/stores/settingsStore');

// i18nのモック
vi.mock('react-i18next', () => ({
  // Trans and Translation components
  Trans: ({ children }: { children: any }) => children,
  Translation: ({ children }: { children: any }) => children,
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
  // HOCs
  withTranslation: () => (Component: any) => Component,
  // Provider
  I18nextProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

// i18nextのモック
vi.mock('i18next', () => ({
  default: {
    use: () => ({
      use: () => ({
        init: vi.fn(),
      }),
    }),
    language: 'ja',
    changeLanguage: vi.fn(),
    t: (key: string) => key,
    exists: vi.fn(() => true),
    options: {
      fallbackLng: ['en'],
      debug: false,
    },
  },
}));

// ErrorStoreのモック
const mockErrorStore = {
  error: null,
  isErrorDialogOpen: false,
  clearError: vi.fn(),
  showError: vi.fn(),
};

vi.mock('@/stores/errorStore', () => ({
  default: vi.fn(() => mockErrorStore)
}));

// モックデータ
const mockInitialData = {
  title: 'テストフロー',
  quest: 'テストクエスト',
  author: 'テスト作者',
  description: 'テスト説明',
  updateDate: '2024-01-01',
  note: 'テストノート',
  organization: {
    job: {
      name: 'テストジョブ',
      note: '',
      equipment: {
        name: '',
        note: ''
      },
      abilities: []
    },
    member: {
      front: [],
      back: []
    },
    weapon: {
      main: {
        name: '',
        note: '',
        additionalSkill: ''
      },
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
  always: '',
  flow: []
};

// URLSearchParamsのモック
class MockURLSearchParams {
  private params: Map<string, string>;

  constructor() {
    this.params = new Map();
  }

  has(key: string): boolean {
    return false;
  }

  get(key: string): string | null {
    return null;
  }
}

// @ts-ignore URLSearchParamsの型を上書き
global.URLSearchParams = MockURLSearchParams as any;

// URL.createObjectURLのモック
global.URL.createObjectURL = vi.fn();
global.URL.revokeObjectURL = vi.fn();

// settingsStoreのモック
const mockSettingsStore = {
  settings: {
    language: '日本語',
  },
  updateSettings: vi.fn(),
};

vi.mock('@/stores/settingsStore', () => ({
  default: vi.fn(() => mockSettingsStore)
}));

// テストヘルパー関数
const renderWithI18n = (ui: React.ReactElement): RenderResult => {
  return render(
    <I18nextProvider i18n={i18next}>
      {ui}
    </I18nextProvider>
  );
};

describe('FlowBodyLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
    // ストアの状態をリセット
    const store = useFlowStore.getState();
    store.flowData = null;
    store.isEditMode = false;
    store.currentRow = 0;
  });

  it('初期データがない場合、新規作成/読み込みボタンが表示される', () => {
    renderWithI18n(<FlowBodyLayout />);

    expect(screen.getByText('noDataLoaded')).toBeInTheDocument();
    expect(screen.getByText('newData')).toBeInTheDocument();
    expect(screen.getByText('loadData')).toBeInTheDocument();
  });

  it('初期データが渡された場合、ストアに設定される', () => {
    renderWithI18n(<FlowBodyLayout initialData={mockInitialData} />);
    const store = useFlowStore.getState();
    expect(store.setFlowData).toHaveBeenCalledWith(mockInitialData);
  });

  it('初期データが渡され、ストアに設定された場合、タイトルが表示される', () => {
    const store = useFlowStore.getState();
    store.flowData = mockInitialData;
    renderWithI18n(<FlowBodyLayout initialData={mockInitialData} />);
    expect(screen.getByText('テストフロー')).toBeInTheDocument();
  });

  it('初期データの設定は一度だけ行われる', () => {
    const store = useFlowStore.getState();
    const { rerender } = renderWithI18n(<FlowBodyLayout initialData={mockInitialData} />);
    expect(store.setFlowData).toHaveBeenCalledWith(mockInitialData);

    // モックをクリア
    vi.clearAllMocks();

    // 同じデータで再レンダリング
    rerender(<FlowBodyLayout initialData={mockInitialData} />);
    expect(store.setFlowData).toHaveBeenCalledWith(mockInitialData);

    // 異なるデータで再レンダリング
    const newData = { ...mockInitialData, title: 'New Title' };
    rerender(<FlowBodyLayout initialData={newData} />);
    expect(store.setFlowData).toHaveBeenCalledWith(newData);
  });
});