import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setCurrentRow } from './cursorStoreFacade';

// モックの設定
vi.mock('@/core/services/cursorService', () => ({
  setCurrentRow: vi.fn(),
}));

import { setCurrentRow as setCurrentRowService } from '@/core/services/cursorService';

describe('cursorStoreFacade', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('setCurrentRow', () => {
    it('cursorServiceのsetCurrentRowを呼び出す', () => {

      // テスト実行
      setCurrentRow(3); // cursorServiceのsetCurrentRowを呼び出す

      // 検証
      expect(setCurrentRowService).toHaveBeenCalledWith(3);
    });
  });
});