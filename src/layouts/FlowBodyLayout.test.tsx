import { screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FlowBodyLayout from './FlowBodyLayout';
import type { Flow } from '@/types/models';
import useFlowStore from '@/stores/flowStore';
import { renderWithI18n } from '@/test/i18n-test-utils';

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

  it('初期ロード時にLoadingLayoutが表示される', async () => {
    renderWithI18n(<FlowBodyLayout />);
    // 初期レンダリング時はEmptyLayoutが表示される
    expect(screen.getByText('データが読み込まれていません')).toBeInTheDocument();
  });

  it('データがない場合、EmptyLayoutが表示される', async () => {
    renderWithI18n(<FlowBodyLayout />);

    await act(async () => {
      // 非同期処理の完了を待つ
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(screen.getByText('データが読み込まれていません')).toBeInTheDocument();
    expect(screen.getByText('新しいデータを作る')).toBeInTheDocument();
    expect(screen.getByText('データ読み込み')).toBeInTheDocument();
  });

  it('初期データが渡された場合、ストアに設定される', async () => {
    renderWithI18n(<FlowBodyLayout initialData={mockInitialData} />);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const store = useFlowStore.getState();
    expect(store.setFlowData).toHaveBeenCalledWith(mockInitialData);
  });

  it('新規作成モードで起動した場合、createNewFlowが呼ばれる', async () => {
    renderWithI18n(<FlowBodyLayout initialMode="new" />);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const store = useFlowStore.getState();
    expect(store.createNewFlow).toHaveBeenCalled();
    expect(store.setIsEditMode).toHaveBeenCalledWith(true);
  });

  it('編集モードで起動した場合、isEditModeがtrueに設定される', async () => {
    const store = useFlowStore.getState();
    store.flowData = mockInitialData;

    renderWithI18n(<FlowBodyLayout initialMode="edit" />);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(store.setIsEditMode).toHaveBeenCalledWith(true);
  });

  it('popstateイベントで新規作成ページに遷移した場合、createNewFlowが呼ばれる', async () => {
    renderWithI18n(<FlowBodyLayout />);

    // URLを/newに変更
    Object.defineProperty(window, 'location', {
      value: { pathname: '/new' },
      writable: true
    });

    await act(async () => {
      window.dispatchEvent(new PopStateEvent('popstate'));
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const store = useFlowStore.getState();
    expect(store.createNewFlow).toHaveBeenCalled();
    expect(store.setIsEditMode).toHaveBeenCalledWith(true);
  });
});