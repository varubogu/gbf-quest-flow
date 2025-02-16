import { screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BodyLayout from './BodyLayout';
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
    default: useStore,
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
  always: '',
  flow: [],
};

describe('BodyLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const store = useFlowStore.getState();
    store.flowData = null;
    store.isEditMode = false;
  });

  it('初期ロード時にEmptyLayoutが表示される', () => {
    renderWithI18n(<BodyLayout />);
    expect(screen.getByText('データが読み込まれていません')).toBeInTheDocument();
  });

  it('データがない場合、EmptyLayoutが表示される', () => {
    renderWithI18n(<BodyLayout />);
    expect(screen.getByText('データが読み込まれていません')).toBeInTheDocument();
    expect(screen.getByText('新しいデータを作る')).toBeInTheDocument();
    expect(screen.getByText('データ読み込み')).toBeInTheDocument();
  });

  it('初期データが渡された場合、ストアに設定される', () => {
    renderWithI18n(<BodyLayout initialData={mockInitialData} />);
    const store = useFlowStore.getState();
    expect(store.setFlowData).toHaveBeenCalledWith(mockInitialData);
  });

  it('新規作成モードで起動した場合、createNewFlowが呼ばれる', () => {
    renderWithI18n(<BodyLayout initialMode="new" />);
    const store = useFlowStore.getState();
    expect(store.createNewFlow).toHaveBeenCalled();
    expect(store.setIsEditMode).toHaveBeenCalledWith(true);
  });

  it('編集モードで起動した場合、isEditModeがtrueに設定される', () => {
    const store = useFlowStore.getState();
    store.flowData = mockInitialData;

    renderWithI18n(<BodyLayout initialMode="edit" />);
    expect(store.setIsEditMode).toHaveBeenCalledWith(true);
  });

  it('popstateイベントで新規作成ページに遷移した場合、createNewFlowが呼ばれる', () => {
    renderWithI18n(<BodyLayout />);

    // URLを/?mode=newに変更
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/',
        search: '?mode=new',
      },
      writable: true,
    });

    window.dispatchEvent(new PopStateEvent('popstate'));
    const store = useFlowStore.getState();
    expect(store.createNewFlow).toHaveBeenCalled();
    expect(store.setIsEditMode).toHaveBeenCalledWith(true);
  });
});
