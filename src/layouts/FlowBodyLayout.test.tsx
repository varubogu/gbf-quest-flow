import { render, screen } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FlowBodyLayout from './FlowBodyLayout';
import type { Flow } from '@/types/models';
import useFlowStore from '@/stores/flowStore';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';

// FlowStoreのモック
vi.mock('@/stores/flowStore', () => {
  const store = {
    flowData: null as Flow | null,
    isEditMode: false,
    setFlowData: vi.fn(),
    setIsEditMode: vi.fn(),
    createNewFlow: vi.fn(),
  };

  type StoreType = typeof store;
  const mockFunction = vi.fn((selector = (state: StoreType) => state) => selector(store));
  const useStore = Object.assign(mockFunction, { getState: () => store });

  return {
    default: useStore
  };
});

// i18nのモック
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
      language: 'ja',
    },
  }),
}));

const mockInitialData = {
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
      additional: []
    },
    weaponEffects: { taRate: '', hp: '', defense: '' },
    summon: {
      main: { name: '', note: '' },
      friend: { name: '', note: '' },
      other: [],
      sub: []
    },
    totalEffects: { taRate: '', hp: '', defense: '' }
  },
  always: '',
  flow: []
};

describe('FlowBodyLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const store = useFlowStore.getState();
    store.flowData = null;
    store.isEditMode = false;
  });

  it('初期ロード時にLoadingLayoutが表示される', () => {
    render(
      <I18nextProvider i18n={i18next}>
        <FlowBodyLayout />
      </I18nextProvider>
    );
    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  it('データがない場合、EmptyLayoutが表示される', async () => {
    render(
      <I18nextProvider i18n={i18next}>
        <FlowBodyLayout />
      </I18nextProvider>
    );
    // ローディング完了を待つ
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(screen.getByText('noDataLoaded')).toBeInTheDocument();
  });

  it('初期データが渡された場合、ストアに設定される', () => {
    render(
      <I18nextProvider i18n={i18next}>
        <FlowBodyLayout initialData={mockInitialData} />
      </I18nextProvider>
    );
    const store = useFlowStore.getState();
    expect(store.setFlowData).toHaveBeenCalledWith(mockInitialData);
  });

  it('新規作成モードで起動した場合、createNewFlowが呼ばれる', () => {
    render(
      <I18nextProvider i18n={i18next}>
        <FlowBodyLayout initialMode="new" />
      </I18nextProvider>
    );
    const store = useFlowStore.getState();
    expect(store.createNewFlow).toHaveBeenCalled();
    expect(store.setIsEditMode).toHaveBeenCalledWith(true);
  });

  it('編集モードで起動した場合、isEditModeがtrueに設定される', () => {
    const store = useFlowStore.getState();
    store.flowData = mockInitialData;
    render(
      <I18nextProvider i18n={i18next}>
        <FlowBodyLayout initialMode="edit" />
      </I18nextProvider>
    );
    expect(store.setIsEditMode).toHaveBeenCalledWith(true);
  });

  it('popstateイベントで新規作成ページに遷移した場合、createNewFlowが呼ばれる', () => {
    render(
      <I18nextProvider i18n={i18next}>
        <FlowBodyLayout />
      </I18nextProvider>
    );

    // URLを/newに変更
    Object.defineProperty(window, 'location', {
      value: { pathname: '/new' },
      writable: true
    });

    // popstateイベントを発火
    window.dispatchEvent(new PopStateEvent('popstate'));

    const store = useFlowStore.getState();
    expect(store.createNewFlow).toHaveBeenCalled();
    expect(store.setIsEditMode).toHaveBeenCalledWith(true);
  });
});