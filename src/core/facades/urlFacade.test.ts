import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  updateUrlForNewFlow,
  updateUrlForEditMode,
  updateUrlForViewMode,
  setupHistoryListener,
  parseCurrentUrl
} from './urlFacade';

// urlServiceのモック
vi.mock('../services/urlService', () => ({
  updateUrlForNewFlow: vi.fn(),
  updateUrlForEditMode: vi.fn(),
  updateUrlForViewMode: vi.fn(),
  updateUrlForSaving: vi.fn(),
  createPopStateHandler: vi.fn(),
  parseCurrentUrl: vi.fn()
}));

import * as urlService from '../services/urlService';
import type { Flow } from '@/types/types';

describe('urlFacade', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('updateUrlForNewFlow', () => {
    it('urlServiceの対応する関数を呼び出す', () => {
      const flowData: Partial<Flow> = { title: 'テスト' };

      updateUrlForNewFlow(flowData as Flow);

      expect(urlService.updateUrlForNewFlow).toHaveBeenCalledWith(flowData);
    });
  });

  describe('updateUrlForEditMode', () => {
    it('urlServiceの対応する関数を呼び出す', () => {
      const flowData: Partial<Flow> = { title: 'テスト' };
      const sourceId = 'test-id';

      updateUrlForEditMode(sourceId, flowData as Flow);

      expect(urlService.updateUrlForEditMode).toHaveBeenCalledWith(sourceId, flowData);
    });
  });

  describe('updateUrlForViewMode', () => {
    it('urlServiceの対応する関数を呼び出す', () => {
      const flowData: Partial<Flow> = { title: 'テスト' };
      const sourceId = 'test-id';

      updateUrlForViewMode(sourceId, flowData as Flow);

      expect(urlService.updateUrlForViewMode).toHaveBeenCalledWith(sourceId, flowData);
    });
  });

  describe('setupHistoryListener', () => {
    it('urlServiceのcreatePopStateHandlerを呼び出し、イベントリスナーを設定する', () => {
      // モックハンドラー
      const mockHandler = vi.fn();
      const handlers = {
        onModeChange: vi.fn(),
        onSourceChange: vi.fn(),
        onFlowDataChange: vi.fn()
      };

      // モックの戻り値を設定
      (urlService.createPopStateHandler as any).mockReturnValue(mockHandler);

      // addEventListener/removeEventListenerのモック
      const originalAddEventListener = window.addEventListener;
      const originalRemoveEventListener = window.removeEventListener;
      window.addEventListener = vi.fn();
      window.removeEventListener = vi.fn();

      try {
        // テスト対象の関数を呼び出す
        const cleanup = setupHistoryListener(handlers);

        // createPopStateHandlerが正しく呼び出されたことを確認
        expect(urlService.createPopStateHandler).toHaveBeenCalledWith(handlers);

        // addEventListenerが正しく呼び出されたことを確認
        expect(window.addEventListener).toHaveBeenCalledWith('popstate', mockHandler);

        // クリーンアップ関数を呼び出す
        cleanup();

        // removeEventListenerが正しく呼び出されたことを確認
        expect(window.removeEventListener).toHaveBeenCalledWith('popstate', mockHandler);
      } finally {
        // モックを元に戻す
        window.addEventListener = originalAddEventListener;
        window.removeEventListener = originalRemoveEventListener;
      }
    });
  });

  describe('parseCurrentUrl', () => {
    it('urlServiceの対応する関数を呼び出す', () => {
      const mockResult = { mode: 'view', sourceId: 'test-id' };
      (urlService.parseCurrentUrl as any).mockReturnValue(mockResult);

      const result = parseCurrentUrl();

      expect(urlService.parseCurrentUrl).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });
});