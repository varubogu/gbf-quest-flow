import { screen, act, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import BodyLayout from './BodyLayout';
import type { Flow } from '@/types/models';
import useFlowStore from '@/stores/flowStore';
import { renderWithI18n } from '@/test/i18n-test-utils';

// グローバルなセットアップ
beforeAll(() => {
  // タイマーをグローバルに設定
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterAll(() => {
  // タイマーをリセット
  vi.useRealTimers();
});

beforeEach(() => {
  // 各テスト前の共通クリーンアップ
  vi.clearAllMocks();
  document.body.innerHTML = '';
});

afterEach(() => {
  // 各テスト後の共通クリーンアップ
  document.body.innerHTML = '';
  // タイマーをリセット（次のテストのために）
  vi.clearAllTimers();
});

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

describe('アクセシビリティ機能', () => {
  beforeEach(() => {
    const store = useFlowStore.getState();
    store.flowData = mockInitialData;
    store.isEditMode = false;
  });

  it('編集モードへの切り替え時にスクリーンリーダー通知が表示される', async () => {
    // 1. 初期セットアップ
    const store = useFlowStore.getState();
    store.flowData = mockInitialData;
    store.isEditMode = false;

    const { rerender } = renderWithI18n(<BodyLayout initialData={mockInitialData} />);

    // 2. 初期状態の確認（表示モードの通知）
    await act(async () => {
      await Promise.resolve();
      vi.advanceTimersByTime(10);
    });

    // 初期状態の確認
    const initialNotifications = Array.from(document.querySelectorAll('[role="status"]'));
    expect(initialNotifications.some(n => n.textContent?.includes('フローの表示モードです'))).toBe(true);

    // 通知が消えるのを待つ
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(document.querySelectorAll('[role="status"]')).toHaveLength(0);

    // 3. 編集モードに切り替え
    await act(async () => {
      // ストアの状態を更新
      store.setIsEditMode(true);
      store.isEditMode = true;

      // 再レンダリング
      rerender(<BodyLayout initialData={mockInitialData} />);

      // useEffectが実行される時間を確保
      await Promise.resolve();
      vi.advanceTimersByTime(10);
    });

    // 編集モード切り替え後の確認
    const editModeNotifications = Array.from(document.querySelectorAll('[role="status"]'));
    expect(editModeNotifications.some(n => n.textContent?.includes('フローの編集モードです'))).toBe(true);

    // 通知が消えるのを待つ
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(document.querySelectorAll('[role="status"]')).toHaveLength(0);
  });

  it('表示モードへの切り替え時にスクリーンリーダー通知が表示される', async () => {
    // 1. 初期セットアップ
    const store = useFlowStore.getState();
    store.flowData = mockInitialData;
    store.isEditMode = false;

    const { rerender } = renderWithI18n(<BodyLayout initialData={mockInitialData} />);

    // 2. 編集モードに切り替え
    await act(async () => {
      store.setIsEditMode(true);
      store.isEditMode = true;
      rerender(<BodyLayout initialData={mockInitialData} />);
      await Promise.resolve();
      vi.advanceTimersByTime(10);
    });

    // 編集モードの通知を確認
    const editModeNotifications = Array.from(document.querySelectorAll('[role="status"]'));
    expect(editModeNotifications.some(n => n.textContent?.includes('フローの編集モードです'))).toBe(true);

    // 通知が消えるのを待つ
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(document.querySelectorAll('[role="status"]')).toHaveLength(0);

    // 3. 表示モードに切り替え
    await act(async () => {
      store.setIsEditMode(false);
      store.isEditMode = false;
      rerender(<BodyLayout initialData={mockInitialData} />);
      await Promise.resolve();
      vi.advanceTimersByTime(10);
    });

    // 表示モードの通知を確認
    const viewModeNotifications = Array.from(document.querySelectorAll('[role="status"]'));
    expect(viewModeNotifications.some(n => n.textContent?.includes('フローの表示モードです'))).toBe(true);

    // 通知が消えるのを待つ
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(document.querySelectorAll('[role="status"]')).toHaveLength(0);
  });

  it('エラー発生時にアラート通知が表示される', async () => {
    // 1. 初期セットアップ
    const store = useFlowStore.getState();
    store.flowData = { ...mockInitialData };  // 新しいオブジェクトとしてコピー
    store.isEditMode = true;  // 最初から編集モードに設定

    // コンソールエラーをスパイ
    const consoleErrorSpy = vi.spyOn(console, 'error');

    const { container } = renderWithI18n(<BodyLayout initialData={mockInitialData} initialMode="edit" />);

    // 初期レンダリングの完了を待つ
    await act(async () => {
      await Promise.resolve();
      await vi.advanceTimersByTime(100);
    });

    // エラーを設定
    let errorThrown = false;
    const mockSetFlowData = vi.fn().mockImplementation(() => {
      console.log('setFlowData が呼び出されました');
      errorThrown = true;
      throw new Error('テストエラー');
    });
    store.setFlowData = mockSetFlowData;

    // FlowLayoutが正しくレンダリングされているか確認
    console.log('現在のDOM構造:', container.innerHTML);

    // 3. エラーを発生させる
    await act(async () => {
      // タイトル入力フィールドを探す（より具体的なセレクタを使用）
      const titleInput = screen.getByDisplayValue('テストフロー') as HTMLInputElement;
      if (!titleInput) {
        console.error('利用可能な要素:', Array.from(container.querySelectorAll('*')).map(el => ({
          tagName: el.tagName,
          type: el.getAttribute('type'),
          value: el.getAttribute('value'),
          className: el.className,
          id: el.id,
          textContent: el.textContent
        })));
        throw new Error('タイトル入力フィールドが見つかりません');
      }

      console.log('タイトル入力フィールドの現在の状態:', {
        value: titleInput.value,
        className: titleInput.className,
        handlers: titleInput.onchange,
        attributes: Array.from(titleInput.attributes).map(attr => `${attr.name}=${attr.value}`)
      });

      // React Testing LibraryのfireEventを使用
      fireEvent.change(titleInput, { target: { value: 'テスト' } });

      // handleTitleChangeが呼ばれるのを待つ
      await Promise.resolve();
      await vi.advanceTimersByTime(10);

      // setFlowDataの呼び出しを確認
      console.log('setFlowDataの呼び出し回数:', mockSetFlowData.mock.calls.length);
      console.log('現在のerrorThrownの値:', errorThrown);
      console.log('flowDataの現在の状態:', store.flowData);

      // エラーが発生したことを確認
      expect(mockSetFlowData).toHaveBeenCalled();
      expect(errorThrown).toBe(true);

      // エラーが処理される時間を確保
      await Promise.resolve();
      await vi.advanceTimersByTime(100);
    });

    // エラー通知の生成を待つ
    await act(async () => {
      await Promise.resolve();
      await vi.advanceTimersByTime(100);
    });

    // エラーハンドリングの確認
    expect(consoleErrorSpy).toHaveBeenCalled();
    console.log('console.error の呼び出し:', consoleErrorSpy.mock.calls);

    // エラー通知を確認
    const alerts = Array.from(document.querySelectorAll('[role="alert"]'));
    console.log('検出されたアラート:', alerts.map(a => ({
      role: a.getAttribute('role'),
      text: a.textContent,
      class: a.className,
      ariaLive: a.getAttribute('aria-live')
    })));

    // body内の全要素を確認
    console.log('body内の全要素:', Array.from(document.body.children).map(el => ({
      role: el.getAttribute('role'),
      text: el.textContent,
      class: el.className,
      ariaLive: el.getAttribute('aria-live')
    })));

    expect(alerts.some(a => a.textContent?.includes('タイトル更新中にエラーが発生しました'))).toBe(true);

    // 通知が消えるのを待つ
    await act(async () => {
      await vi.advanceTimersByTime(1000);
    });
    expect(document.querySelectorAll('[role="alert"]')).toHaveLength(0);

    // スパイをリストア
    consoleErrorSpy.mockRestore();
  });
});

describe('キーボードショートカット', () => {
  beforeEach(() => {
    const store = useFlowStore.getState();
    store.flowData = mockInitialData;
    store.isEditMode = true;
  });

  it('Ctrl+Sで保存が実行される', async () => {
    renderWithI18n(<BodyLayout initialData={mockInitialData} />);

    // 保存ショートカットを発火
    await act(async () => {
      const event = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true,
        bubbles: true
      });
      window.dispatchEvent(event);
      vi.advanceTimersByTime(100);
    });

    // ダウンロードリンクの生成を待つ
    await waitFor(() => {
      const downloadLink = document.querySelector(`a[aria-label="${mockInitialData.title}をダウンロード"]`);
      expect(downloadLink).toBeInTheDocument();
      return true;
    }, { timeout: 1000 });
  });

  it('Ctrl+Nで新規作成が実行される', async () => {
    renderWithI18n(<BodyLayout initialData={mockInitialData} />);
    const store = useFlowStore.getState();

    // 新規作成ショートカットを発火
    await act(async () => {
      const event = new KeyboardEvent('keydown', {
        key: 'n',
        ctrlKey: true,
        bubbles: true
      });
      window.dispatchEvent(event);
      vi.advanceTimersByTime(100);
    });

    // createNewFlowの呼び出しを待つ
    await waitFor(() => {
      expect(store.createNewFlow).toHaveBeenCalled();
      return true;
    }, { timeout: 1000 });
  });

  it('Escapeで編集モードが終了する', async () => {
    renderWithI18n(<BodyLayout initialData={mockInitialData} />);
    const store = useFlowStore.getState();

    // Escapeキーを発火
    await act(async () => {
      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true
      });
      window.dispatchEvent(event);
      vi.advanceTimersByTime(100);
    });

    // 編集モードの変更を待つ
    await waitFor(() => {
      expect(store.setIsEditMode).toHaveBeenCalledWith(false);
      return true;
    }, { timeout: 1000 });
  });
});
