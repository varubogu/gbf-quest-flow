import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setCurrentRow } from './cursorService';

// モックの設定
vi.mock('@/core/stores/cursorStore', () => ({
  default: {
    setState: vi.fn(),
    getState: vi.fn()
  }
}));

vi.mock('@/core/stores/flowStore', () => ({
  default: {
    getState: vi.fn().mockReturnValue({
      getFlowData: vi.fn().mockReturnValue({
        flow: new Array(10) // 10行のフローデータをモック
      })
    })
  }
}));

import useCursorStore from '@/core/stores/cursorStore';
// useFlowStoreはモックとして使用しているため、直接参照はしない
import '@/core/stores/flowStore';

describe('cursorService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('setCurrentRow', () => {
    it('5行目を選択する', () => {
      const row = 5;

      // テスト実行
      setCurrentRow(row);

      // 検証
      expect(useCursorStore.setState).toHaveBeenCalledWith({ currentRow: row });
    });

    it('先頭行を選択する', () => {
      // テスト実行
      setCurrentRow(0);

      // 検証
      expect(useCursorStore.setState).toHaveBeenCalledWith({ currentRow: 0 });
    });

    it('0未満の値を指定するとエラーになる', () => {
      // テスト実行
      expect(() => {
        setCurrentRow(-1);
      }).toThrow('currentRowは0以上の数値である必要があります');
    });

    it('フローの最大行数を超える値を指定するとエラーになる', () => {
      const maxRow = 10; // モックで設定した行数

      // テスト実行
      expect(() => {
        setCurrentRow(maxRow + 1);
      }).toThrow(`currentRowはフローの行数(${maxRow})以下の数値である必要があります`);
    });

    it('フローの最大行数と同じ値は許容される', () => {
      const maxRow = 10; // モックで設定した行数

      // テスト実行
      setCurrentRow(maxRow);

      // 検証
      expect(useCursorStore.setState).toHaveBeenCalledWith({ currentRow: maxRow });
    });

    it('小数を選択する', () => {
      // テスト実行
      setCurrentRow(3.14);

      // 検証 - 暗黙的に整数変換されるかどうかは実装による
      expect(useCursorStore.setState).toHaveBeenCalledWith({ currentRow: 3.14 });
    });

    it('複数回呼び出す', () => {
      // 複数回呼び出し
      setCurrentRow(1);
      setCurrentRow(2);
      setCurrentRow(3);

      // 検証 - 最後の呼び出しを確認
      expect(useCursorStore.setState).toHaveBeenCalledTimes(3);
      expect(useCursorStore.setState).toHaveBeenLastCalledWith({ currentRow: 3 });
    });
  });
});
