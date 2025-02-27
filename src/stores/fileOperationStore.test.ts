import { describe, it, expect, vi, beforeEach } from 'vitest';
import useFileOperationStore from '@/stores/fileOperationStore';
import useBaseFlowStore from '@/stores/baseFlowStore';
import useErrorStore from '@/stores/errorStore';
import type { BaseFlowStore } from '@/types/flowStore.types';

// vi.mockを使用してモジュールをモックする
vi.mock('@/stores/baseFlowStore', () => {
  const mockGetFlowData = vi.fn().mockReturnValue({
    title: 'テストフロー',
    flow: [],
  });
  return {
    default: {
      getState: vi.fn().mockReturnValue({
        getFlowData: mockGetFlowData,
        setFlowData: vi.fn(),
        originalData: null,
        flowData: null,
        updateFlowData: vi.fn(),
        updateAction: vi.fn(),
        getActionById: vi.fn(),
      }),
    },
  };
});

vi.mock('@/stores/errorStore', () => {
  return {
    default: {
      getState: vi.fn().mockReturnValue({
        showError: vi.fn(),
        error: null,
        errors: [],
        isErrorDialogOpen: false,
        setError: vi.fn(),
        setIsErrorDialogOpen: vi.fn(),
        clearError: vi.fn(),
        clearErrors: vi.fn(),
        severity: 'error',
      }),
    },
  };
});

describe('FileOperationStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // DOMモックのセットアップ
    vi.stubGlobal('document', {
      createElement: vi.fn().mockImplementation((tagName) => {
        if (tagName === 'input') {
          return {
            type: '',
            accept: '',
            click: vi.fn(),
            files: [],
            onchange: null,
          };
        }
        if (tagName === 'a') {
          return {
            href: '',
            download: '',
            click: vi.fn(),
          };
        }
        return {};
      }),
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      },
    });

    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValue('blob:mock-url'),
      revokeObjectURL: vi.fn(),
    });
  });

  describe('saveFlowToFile', () => {
    it('現在のフローデータをJSONとして保存する', async () => {
      // 関数を実行
      await useFileOperationStore.getState().saveFlowToFile();

      // 検証
      expect(useBaseFlowStore.getState().getFlowData).toHaveBeenCalled();
      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(document.body.appendChild).toHaveBeenCalled();
      expect(document.body.removeChild).toHaveBeenCalled();
    });

    it('データがない場合はエラーを表示する', async () => {
      // データがnullの場合をシミュレート
      const baseFlowStore = useBaseFlowStore.getState() as BaseFlowStore;
      // eslint-disable-next-line
      baseFlowStore.getFlowData.mockReturnValue(null);

      // 関数を実行して、例外が発生することを期待
      await expect(useFileOperationStore.getState().saveFlowToFile()).rejects.toThrow();

      // エラーストアのshowErrorが呼ばれたことを検証
      expect(useErrorStore.getState().showError).toHaveBeenCalled();
    });
  });

  // loadFlowFromFileのテストは、ファイル選択UIとの相互作用が必要なため、
  // 実装が複雑になります。実際のアプリケーションでは、E2Eテストやコンポーネント
  // テストでこの機能をテストする方が適切な場合が多いです。
});