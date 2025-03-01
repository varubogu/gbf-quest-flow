import { describe, it, expect, vi, beforeEach } from 'vitest';
import useCursorStoreFacade from './cursorStoreFacade';
import useCursorStore from '@/core/stores/cursorStore';

// モックの設定
vi.mock('@/core/stores/cursorStore', () => {
  const getCurrentRowMock = vi.fn();
  const setCurrentRowMock = vi.fn();

  return {
    default: {
      getState: vi.fn(() => ({
        getCurrentRow: getCurrentRowMock,
        setCurrentRow: setCurrentRowMock,
        currentRow: 0
      })),
      setState: vi.fn(),
      subscribe: vi.fn(() => vi.fn()) // unsubscribe関数を返す
    }
  };
});

describe('cursorStoreFacade', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('単体テスト', () => {
    describe('getCurrentRow', () => {
      it('cursorStoreのgetCurrentRowを呼び出す', () => {
        // モックの設定
        const getCurrentRowMock = vi.fn().mockReturnValue(5);
        vi.mocked(useCursorStore.getState).mockReturnValue({
          getCurrentRow: getCurrentRowMock,
          setCurrentRow: vi.fn(),
          currentRow: 5
        });

        // テスト実行
        const result = useCursorStoreFacade.getState().getCurrentRow();

        // 検証
        expect(getCurrentRowMock).toHaveBeenCalled();
        expect(result).toBe(5);
      });
    });

    describe('setCurrentRow', () => {
      it('cursorStoreのsetCurrentRowを呼び出す', () => {
        // モックの設定
        const setCurrentRowMock = vi.fn();
        vi.mocked(useCursorStore.getState).mockReturnValue({
          getCurrentRow: vi.fn(),
          setCurrentRow: setCurrentRowMock,
          currentRow: 0
        });

        // テスト実行
        useCursorStoreFacade.getState().setCurrentRow(3);

        // 検証
        expect(setCurrentRowMock).toHaveBeenCalledWith(3);
      });
    });
  });

  describe('結合テスト', () => {
    it('ファサードが正しく初期化される', () => {
      // ファサードの初期化
      const facade = useCursorStoreFacade;

      // 初期状態の確認（モックの初期値）
      expect(facade.getState().currentRow).toBeDefined();
    });

    it('ファサードの状態が更新される', () => {
      // ファサードの状態を直接更新
      useCursorStoreFacade.setState({ currentRow: 7 });

      // 更新された状態を確認
      expect(useCursorStoreFacade.getState().currentRow).toBe(7);
    });
  });
});