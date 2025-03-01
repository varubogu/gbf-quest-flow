import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { saveFlow, updateNewFlowState } from './flowOperations';
import { announceToScreenReader, handleError } from './accessibility';
import type { Flow } from '@/types/types';

// モックの設定
vi.mock('./accessibility', () => ({
  announceToScreenReader: vi.fn(),
  handleError: vi.fn(),
}));

describe('flowOperations', () => {
  // テスト用のフローデータ
  const mockFlowData: Flow = {
    title: 'テストフロー',
    quest: 'テストクエスト',
    author: 'テスト作者',
    description: 'テスト説明',
    updateDate: '2023-01-01',
    note: 'テストノート',
    organization: {
      job: {
        name: 'テストジョブ',
        note: '',
        equipment: { name: '', note: '' },
        abilities: [],
      },
      member: {
        front: [],
        back: [],
      },
      weapon: {
        main: { name: '', note: '', additionalSkill: '' },
        other: [],
        additional: [],
      },
      weaponEffects: {
        taRate: '',
        hp: '',
        defense: '',
      },
      totalEffects: {
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
    },
    always: '',
    flow: [],
  };

  // DOM要素のモック
  let mockAnchor: HTMLAnchorElement;
  let mockCreateElement: ReturnType<typeof vi.spyOn>;
  let mockAppendChild: ReturnType<typeof vi.spyOn>;
  let mockRemoveChild: ReturnType<typeof vi.spyOn>;
  let mockClick: ReturnType<typeof vi.spyOn>;
  let originalCreateObjectURL: typeof URL.createObjectURL;
  let originalRevokeObjectURL: typeof URL.revokeObjectURL;
  let originalHistory: typeof history;

  beforeEach(() => {
    // DOMのモック
    mockAnchor = {
      href: '',
      download: '',
      setAttribute: vi.fn(),
      click: vi.fn(),
    } as unknown as HTMLAnchorElement;

    mockCreateElement = vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor);
    mockAppendChild = vi.spyOn(document.body, 'appendChild').mockImplementation(vi.fn());
    mockRemoveChild = vi.spyOn(document.body, 'removeChild').mockImplementation(vi.fn());
    mockClick = vi.spyOn(mockAnchor, 'click');

    // URL関連のモック
    originalCreateObjectURL = URL.createObjectURL;
    originalRevokeObjectURL = URL.revokeObjectURL;
    URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
    URL.revokeObjectURL = vi.fn();

    // History APIのモック
    originalHistory = window.history;
    Object.defineProperty(window, 'history', {
      value: {
        replaceState: vi.fn(),
        pushState: vi.fn(),
      },
      writable: true,
    });

    // モックをリセット
    vi.clearAllMocks();
  });

  afterEach(() => {
    // モックを元に戻す
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    Object.defineProperty(window, 'history', {
      value: originalHistory,
      writable: true,
    });
    vi.restoreAllMocks();
  });

  describe('saveFlow', () => {
    it('フローデータを正常に保存できる', async () => {
      // 実行
      const result = await saveFlow(mockFlowData);

      // 検証
      expect(result).toBe(true);
      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockAnchor.download).toBe('テストフロー.json');
      expect(mockAnchor.setAttribute).toHaveBeenCalledWith('aria-label', 'テストフローをダウンロード');
      expect(mockAppendChild).toHaveBeenCalledWith(mockAnchor);
      expect(mockClick).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalledWith(mockAnchor);
      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
      expect(window.history.replaceState).toHaveBeenCalledWith(
        { flowData: mockFlowData, isSaving: true },
        '',
        '/'
      );
      expect(announceToScreenReader).toHaveBeenCalledWith('フローを保存しました');
    });

    it('sourceIdが指定されている場合、正しいパスでreplaceStateを呼び出す', async () => {
      // 実行
      const result = await saveFlow(mockFlowData, 'test-id');

      // 検証
      expect(result).toBe(true);
      expect(window.history.replaceState).toHaveBeenCalledWith(
        { flowData: mockFlowData, isSaving: true },
        '',
        '/test-id'
      );
    });

    it('タイトルが空の場合、デフォルトのファイル名を使用する', async () => {
      // タイトルなしのフローデータ
      const noTitleFlow = { ...mockFlowData, title: '' };

      // 実行
      const result = await saveFlow(noTitleFlow);

      // 検証
      expect(result).toBe(true);
      expect(mockAnchor.download).toBe('flow.json');
    });

    it('エラーが発生した場合、エラーハンドリングを行い、falseを返す', async () => {
      // エラーを発生させる
      mockCreateElement.mockImplementation(() => {
        throw new Error('テストエラー');
      });

      // 実行
      const result = await saveFlow(mockFlowData);

      // 検証
      expect(result).toBe(false);
      expect(handleError).toHaveBeenCalledWith(expect.any(Error), '保存中');
    });
  });

  describe('updateNewFlowState', () => {
    it('フローデータがある場合、正しくpushStateを呼び出す', () => {
      // 実行
      updateNewFlowState(mockFlowData);

      // 検証
      expect(window.history.pushState).toHaveBeenCalledWith(
        { flowData: mockFlowData },
        '',
        '/?mode=new'
      );
      expect(announceToScreenReader).toHaveBeenCalledWith('新しいフローを作成しました');
    });

    it('フローデータがnullの場合、pushStateを呼び出さない', () => {
      // 実行
      updateNewFlowState(null);

      // 検証
      expect(window.history.pushState).not.toHaveBeenCalled();
      expect(announceToScreenReader).toHaveBeenCalledWith('新しいフローを作成しました');
    });

    it('エラーが発生した場合、エラーハンドリングを行う', () => {
      // エラーを発生させる
      vi.mocked(window.history.pushState).mockImplementation(() => {
        throw new Error('テストエラー');
      });

      // 実行
      updateNewFlowState(mockFlowData);

      // 検証
      expect(handleError).toHaveBeenCalledWith(expect.any(Error), '新規作成中');
    });
  });
});