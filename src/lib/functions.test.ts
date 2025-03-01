import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setTitle, loadSlugData } from './functions';
import useBaseFlowStore from '@/core/stores/baseFlowStore';
import type { Flow } from '@/types/types';

// モックの設定
vi.mock('@/core/stores/baseFlowStore', () => ({
  default: {
    getState: vi.fn(() => ({
      setFlowData: vi.fn(),
    })),
  },
}));

// MSWを無効化するためのモック
vi.mock('@/test/mocks/server', () => ({
  server: {
    listen: vi.fn(),
    resetHandlers: vi.fn(),
    close: vi.fn(),
  },
}));

describe('functions', () => {
  // 各テスト前にモックをリセット
  beforeEach(() => {
    vi.resetAllMocks();
    document.title = '';
  });

  // 各テスト後にモックをリストア
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('setTitle', () => {
    it('タイトルが指定されている場合、ベースタイトルとタイトルを結合して設定する', () => {
      // 実行
      setTitle('テストタイトル');

      // 検証
      expect(document.title).toBe('グラブル行動表 - テストタイトル');
    });

    it('タイトルが空文字の場合、ベースタイトルのみを設定する', () => {
      // 実行
      setTitle('');

      // 検証
      expect(document.title).toBe('グラブル行動表');
    });

    it('タイトルがnullまたはundefinedの場合、ベースタイトルのみを設定する', () => {
      // 実行
      // @ts-expect-error: テスト用に意図的にnullを渡す
      setTitle(null);

      // 検証
      expect(document.title).toBe('グラブル行動表');

      // 実行
      // @ts-expect-error: テスト用に意図的にundefinedを渡す
      setTitle(undefined);

      // 検証
      expect(document.title).toBe('グラブル行動表');
    });
  });

  describe('loadSlugData', () => {
    it('指定されたスラグのデータを取得し、ストアに設定する', async () => {
      // モックの準備
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

      // fetchのモック
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockResolvedValueOnce({
        json: async () => mockFlowData,
      });

      const setFlowDataMock = vi.fn();
      vi.mocked(useBaseFlowStore.getState).mockReturnValue({
        setFlowData: setFlowDataMock,
      });

      try {
        // 実行
        await loadSlugData('test-slug');

        // 検証
        expect(global.fetch).toHaveBeenCalledWith('/content/flows/test-slug.json');
        expect(setFlowDataMock).toHaveBeenCalledWith(mockFlowData);
      } finally {
        // fetchを元に戻す
        global.fetch = originalFetch;
      }
    });

    it('fetchが失敗した場合、エラーが発生する', async () => {
      // fetchのモック
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Fetch error'));

      try {
        // 実行と検証
        await expect(loadSlugData('error-slug')).rejects.toThrow('Fetch error');
      } finally {
        // fetchを元に戻す
        global.fetch = originalFetch;
      }
    });
  });
});