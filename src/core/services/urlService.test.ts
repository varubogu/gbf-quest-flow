import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseCurrentUrl, updateUrl, createPopStateHandler } from './urlService';
import type { Flow } from '@/types/models';

describe('urlService', () => {
  /**
   * jsdom 30 では window.location が置き換え不能なため、
   * history.pushState で現在の URL を切り替える。
   */
  const setUrl = (pathname: string, search: string): void => {
    window.history.pushState({}, '', `${pathname}${search}`);
  };

  beforeEach(() => {
    setUrl('/', '');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.history.pushState({}, '', '/');
  });

  describe('parseCurrentUrl', () => {
    it('パスが空の場合、正しいモードとソースIDを返す', () => {
      setUrl('/', '');

      const result = parseCurrentUrl();

      expect(result).toEqual({
        mode: 'view',
        sourceId: null,
        dataId: null,
        remoteUrl: null,
      });
    });

    it('パスにソースIDがある場合、正しいモードとソースIDを返す', () => {
      setUrl('/test-id', '');

      const result = parseCurrentUrl();

      expect(result).toEqual({
        mode: 'view',
        sourceId: 'test-id',
        dataId: null,
        remoteUrl: null,
      });
    });

    it('クエリパラメータにモードがある場合、正しいモードとソースIDを返す', () => {
      setUrl('/', '?mode=edit');

      const result = parseCurrentUrl();

      expect(result).toEqual({
        mode: 'edit',
        sourceId: null,
        dataId: null,
        remoteUrl: null,
      });
    });

    it('d と url クエリを返す', () => {
      setUrl('/', '?d=sample&url=https%3A%2F%2Fexample.com%2Fa.json');

      const result = parseCurrentUrl();

      expect(result.dataId).toBe('sample');
      expect(result.remoteUrl).toBe('https://example.com/a.json');
    });

    it('パスとクエリパラメータの両方がある場合、正しいモードとソースIDを返す', () => {
      setUrl('/test-id', '?mode=edit');

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
    beforeEach(() => {
      vi.spyOn(window.history, 'pushState');
    });

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

      setUrl('/test-id', '?mode=edit');

      // ハンドラーを呼び出す
      handler(mockEvent);

      // 各ハンドラーが正しく呼び出されたことを確認
      expect(handlers.onModeChange).toHaveBeenCalledWith('edit');
      expect(handlers.onSourceChange).toHaveBeenCalledWith('test-id');
      expect(handlers.onFlowDataChange).toHaveBeenCalledWith({ title: 'テスト' });
    });
  });
});
