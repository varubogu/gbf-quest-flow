import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as historyFacade from './historyFacade';
import * as historyService from '@/core/services/historyService';
import type { Flow, HistoryState } from '@/types/models';

// モックの設定
vi.mock('@/core/services/historyService', () => {
  return {
    pushToHistory: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    clearHistory: vi.fn(),
    getHistoryState: vi.fn()
  };
});

describe('historyFacade', () => {
  // テスト用のモックデータ
  const mockFlow: Flow = {
    title: 'テストフロー',
    quest: 'テストクエスト',
    author: 'テスト作者',
    description: 'テスト説明',
    updateDate: '2023-01-01',
    note: 'テストノート',
    organization: {} as any, // テスト用に型だけ合わせる
    always: 'テスト常時効果',
    flow: [
      {
        hp: '100%',
        prediction: 'テスト予兆',
        charge: '◯',
        guard: '×',
        action: 'テストアクション',
        note: 'テストノート'
      }
    ]
  };

  const mockHistoryState: HistoryState = {
    past: [mockFlow],
    future: []
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('pushToHistory', () => {
    it('historyServiceのpushToHistoryを呼び出す', () => {
      // テスト実行
      historyFacade.pushToHistory(mockFlow);

      // 検証
      expect(historyService.pushToHistory).toHaveBeenCalledWith(mockFlow);
    });
  });

  describe('undo', () => {
    it('historyServiceのundoを呼び出す', () => {
      // テスト実行
      historyFacade.undo();

      // 検証
      expect(historyService.undo).toHaveBeenCalled();
    });
  });

  describe('redo', () => {
    it('historyServiceのredoを呼び出す', () => {
      // テスト実行
      historyFacade.redo();

      // 検証
      expect(historyService.redo).toHaveBeenCalled();
    });
  });

  describe('clearHistory', () => {
    it('historyServiceのclearHistoryを呼び出す', () => {
      // テスト実行
      historyFacade.clearHistory();

      // 検証
      expect(historyService.clearHistory).toHaveBeenCalled();
    });
  });

  describe('getHistoryState', () => {
    it('historyServiceのgetHistoryStateを呼び出し、結果を返す', () => {
      // モックの設定
      vi.mocked(historyService.getHistoryState).mockReturnValue(mockHistoryState);

      // テスト実行
      const result = historyFacade.getHistoryState();

      // 検証
      expect(historyService.getHistoryState).toHaveBeenCalled();
      expect(result).toEqual(mockHistoryState);
    });
  });
});