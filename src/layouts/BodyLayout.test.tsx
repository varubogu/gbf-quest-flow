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
    // 1. 初期セットアップ - モックの設定を先に行う
    let errorThrown = false;
    const mockSetFlowData = vi.fn().mockImplementation(() => {
      errorThrown = true;
      throw new Error('テストエラー');
    });

    const store = useFlowStore.getState();
    store.setFlowData = mockSetFlowData;  // モックを先に設定
    store.flowData = { ...mockInitialData };  // 新しいオブジェクトとしてコピー
    store.isEditMode = true;  // 最初から編集モードに設定

    // コンソールエラーをスパイ
    const consoleErrorSpy = vi.spyOn(console, 'error');

    // 2. コンポーネントのレンダリング
    const { container, rerender } = renderWithI18n(
      <BodyLayout initialData={mockInitialData} initialMode="edit" />
    );

    // 初期レンダリングの完了を待つ
    await act(async () => {
      await Promise.resolve();
      await vi.advanceTimersByTime(100);
    });

    // 3. エラーを発生させる
    await act(async () => {
      // タイトル入力フィールドを探す
      const titleInput = screen.getByDisplayValue('テストフロー') as HTMLInputElement;
      expect(titleInput).toBeInTheDocument();  // 要素が存在することを確認

      // イベントを発火して状態を変更
      fireEvent.change(titleInput, { target: { value: 'テスト' } });

      // 状態の変更とエラー発生を待つ
      await Promise.resolve();
      await vi.advanceTimersByTime(10);

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

    // エラー通知を確認
    const alerts = Array.from(document.querySelectorAll('[role="alert"]'));

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
  let originalCreateObjectURL: typeof URL.createObjectURL;
  let originalRevokeObjectURL: typeof URL.revokeObjectURL;

  beforeEach(() => {
    // オリジナルの関数を保存
    originalCreateObjectURL = URL.createObjectURL;
    originalRevokeObjectURL = URL.revokeObjectURL;

    const store = useFlowStore.getState();
    store.flowData = mockInitialData;
    store.isEditMode = true;

    // clickイベントのデフォルト動作を防ぐ
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  });

  afterEach(() => {
    // オリジナルの関数を復元
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });

  it('Ctrl+Sで保存が実行される', async () => {
    // 1. 初期セットアップ
    const store = useFlowStore.getState();
    store.flowData = { ...mockInitialData };
    store.isEditMode = true;

    // Blobのモック
    const mockBlob = new Blob(['{}'], { type: 'application/json' });
    vi.spyOn(window, 'Blob').mockImplementation(() => mockBlob);

    // URL.createObjectURLの呼び出しを監視
    const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
    const mockRevokeObjectURL = vi.fn();
    URL.createObjectURL = mockCreateObjectURL;
    URL.revokeObjectURL = mockRevokeObjectURL;

    // クリックイベントの自動実行を防ぐ
    let savedLink: HTMLAnchorElement | null = null;
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function(this: HTMLAnchorElement) {
      savedLink = this;
    });

    // DOMの変更を監視するMutationObserverの設定
    let linkAdded = false;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          const addedLinks = Array.from(mutation.addedNodes)
            .filter((node): node is HTMLAnchorElement =>
              node instanceof HTMLAnchorElement && node.hasAttribute('download'));
          if (addedLinks.length > 0) {
            linkAdded = true;
            savedLink = addedLinks[0];
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    renderWithI18n(<BodyLayout initialData={mockInitialData} initialMode="edit" />);

    // 初期レンダリングの完了を待つ
    await act(async () => {
      await Promise.resolve();
      await vi.advanceTimersByTime(100);
    });

    // 2. 保存ショートカットを発火
    await act(async () => {
      const event = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true,
        bubbles: true,
        cancelable: true
      });
      window.dispatchEvent(event);
      await Promise.resolve();
    });

    // URL.createObjectURLが呼ばれるのを待つ
    await act(async () => {
      await Promise.resolve();
      await vi.advanceTimersByTime(10);
    });
    expect(mockCreateObjectURL).toHaveBeenCalled();

    // リンクが追加されるのを待つ
    await act(async () => {
      await Promise.resolve();
      await vi.advanceTimersByTime(10);
    });

    // 保存されたリンクの確認
    expect(savedLink).not.toBeNull();
    expect(linkAdded).toBe(true);
    expect(clickSpy).toHaveBeenCalled();

    if (!savedLink) {
      throw new Error('ダウンロードリンクが生成されませんでした');
    }

    // リンクの属性を確認
    expect(savedLink.getAttribute('aria-label')).toBe(`${mockInitialData.title}をダウンロード`);
    expect(savedLink.getAttribute('download')).toBe(`${mockInitialData.title}.json`);
    expect(savedLink.href).toContain('blob:mock-url');

    // リンクが削除されるのを待つ
    await act(async () => {
      await Promise.resolve();
      await vi.advanceTimersByTime(100);
    });

    // 後処理
    observer.disconnect();
    clickSpy.mockRestore();
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
      await Promise.resolve();
      await vi.advanceTimersByTime(100);
    });

    // createNewFlowの呼び出しを確認
    expect(store.createNewFlow).toHaveBeenCalled();
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
      await Promise.resolve();
      await vi.advanceTimersByTime(100);
    });

    // 編集モードの変更を確認
    expect(store.setIsEditMode).toHaveBeenCalledWith(false);
  });
});
