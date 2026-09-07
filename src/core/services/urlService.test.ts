import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseCurrentUrl, updateUrl, createPopStateHandler } from './urlService';
import type { Flow } from '@/types/models';

describe('urlService', () => {
  // モックの設定
  const originalHistory = window.history;
  const originalLocation = window.location;

  beforeEach(() => {
    // history.pushStateのモック
    window.history.pushState = vi.fn();

    // window.locationのモック
    Reflect.deleteProperty(window, 'location');
    window.location = {
      ...originalLocation,
      pathname: '/',
      search: '',
    } as Location;
  });

  afterEach(() => {
    // モックをリセット
    vi.resetAllMocks();
    window.history = originalHistory;
    window.location = originalLocation;
  });

  describe('parseCurrentUrl', () => {
    it('パスが空の場合、正しいモードとソースIDを返す', () => {
      window.location.pathname = '/';
      window.location.search = '';

      const result = parseCurrentUrl();

      expect(result).toEqual({
        mode: 'view',
        sourceId: null,
        dataId: null,
        remoteUrl: null,
      });
    });

    it('パスにソースIDがある場合、正しいモードとソースIDを返す', () => {
      window.location.pathname = '/test-id';
      window.location.search = '';

      const result = parseCurrentUrl();

      expect(result).toEqual({
        mode: 'view',
        sourceId: 'test-id',
        dataId: null,
        remoteUrl: null,
      });
    });

    it('クエリパラメータにモードがある場合、正しいモードとソースIDを返す', () => {
      window.location.pathname = '/';
      window.location.search = '?mode=edit';

      const result = parseCurrentUrl();

      expect(result).toEqual({
        mode: 'edit',
        sourceId: null,
        dataId: null,
        remoteUrl: null,
      });
    });

    it('d と url クエリを返す', () => {
      window.location.pathname = '/';
      window.location.search = '?d=sample&url=https%3A%2F%2Fexample.com%2Fa.json';

      const result = parseCurrentUrl();

      expect(result.dataId).toBe('sample');
      expect(result.remoteUrl).toBe('https://example.com/a.json');
    });

    it('パスとクエリパラメータの両方がある場合、正しいモードとソースIDを返す', () => {
      window.location.pathname = '/test-id';
      window.location.search = '?mode=edit';

      const result = parseCurrentUrl();

      expect(result).toEqual({
        mode: 'edit',
        sourceId: 'test-id',
        dataId: null,
        remoteUrl: null,
      });
    });
  });

  describe('updateUrl', () => {
    it('新規モードの場合、正しいURLを設定する', () => {
      const flowData: Partial<Flow> = { title: 'テスト' };

      updateUrl('new', null, flowData as Flow);

      expect(window.history.pushState).toHaveBeenCalledWith(
        { flowData },
        '',
        new URL('http://localhost:3000/?mode=new')
      );
    });

    it('編集モードでソースIDがある場合、正しいURLを設定する', () => {
      const flowData: Partial<Flow> = { title: 'テスト' };

      updateUrl('edit', 'test-id', flowData as Flow);

      expect(window.history.pushState).toHaveBeenCalledWith(
        { flowData },
        '',
        new URL('http://localhost:3000/test-id?mode=edit')
      );
    });

    it('表示モードでソースIDがある場合、正しいURLを設定する', () => {
      const flowData: Partial<Flow> = { title: 'テスト' };

      updateUrl('view', 'test-id', flowData as Flow);

      expect(window.history.pushState).toHaveBeenCalledWith(
        { flowData },
        '',
        new URL('http://localhost:3000/test-id')
      );
    });

    it('保存中の場合、isSavingフラグを設定する', () => {
      const flowData: Partial<Flow> = { title: 'テスト' };

      updateUrl('view', null, flowData as Flow, true);

      expect(window.history.pushState).toHaveBeenCalledWith(
        { flowData, isSaving: true },
        '',
        new URL('http://localhost:3000/')
      );
    });
  });

  describe('createPopStateHandler', () => {
    it('popstateイベントを処理して正しいハンドラーを呼び出す', () => {
      // モックハンドラー
      const handlers = {
        onModeChange: vi.fn(),
        onSourceChange: vi.fn(),
        onFlowDataChange: vi.fn(),
      };

      // ハンドラーを作成
      const handler = createPopStateHandler(handlers);

      // モックイベント
      const mockEvent = {
        state: {
          flowData: { title: 'テスト' },
        },
      } as PopStateEvent;

      // URLを設定
      window.location.pathname = '/test-id';
      window.location.search = '?mode=edit';

      // ハンドラーを呼び出す
      handler(mockEvent);

      // 各ハンドラーが正しく呼び出されたことを確認
      expect(handlers.onModeChange).toHaveBeenCalledWith('edit');
      expect(handlers.onSourceChange).toHaveBeenCalledWith('test-id');
      expect(handlers.onFlowDataChange).toHaveBeenCalledWith({ title: 'テスト' });
    });
  });
});
