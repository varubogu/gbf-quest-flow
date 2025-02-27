import { create } from 'zustand';
import type { Flow } from '@/types/models';
import type { FileOperationStore } from '@/types/flowStore.types';
import useBaseFlowStore from './baseFlowStore';
import useErrorStore from './errorStore';

/**
 * ファイル操作関連の機能を管理するストア
 *
 * このストアは、フローデータのファイルからの読み込みと
 * ファイルへの保存を担当します。
 */
const useFileOperationStore = create<FileOperationStore>(() => {
  return {
    /**
     * JSONファイルからフローデータを読み込む
     */
    loadFlowFromFile: async (): Promise<void> => {
      try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        const filePromise = new Promise<File | null>((resolve) => {
          window.addEventListener(
            'focus',
            () => {
              setTimeout(() => {
                if (!input.files?.length) {
                  resolve(null);
                }
              }, 300);
            },
            { once: true }
          );

          input.onchange = (e: Event): void => {
            const file = (e.target as HTMLInputElement).files?.[0];
            resolve(file || null);
          };
        });

        input.click();
        const file = await filePromise;

        if (!file) {
          return;
        }

        const text = await file.text();
        const data = JSON.parse(text) as Flow;
        useBaseFlowStore.getState().setFlowData(data);
      } catch (error) {
        useErrorStore
          .getState()
          .showError(
            error instanceof Error ? error : new Error('ファイルの読み込み中にエラーが発生しました')
          );
        throw error;
      }
    },

    /**
     * 現在のフローデータをJSONファイルとして保存
     * @param fileName - 保存するファイル名（省略時はフロータイトルを使用）
     */
    saveFlowToFile: async (fileName?: string): Promise<void> => {
      try {
        const currentData = useBaseFlowStore.getState().getFlowData();
        if (!currentData) {
          throw new Error('保存するデータがありません');
        }

        // JSONデータを生成
        const jsonData = JSON.stringify(currentData, null, 2);

        // Blobを作成
        const blob = new Blob([jsonData], { type: 'application/json' });

        // ダウンロードリンクを作成
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // ファイル名を設定（指定がない場合はフローのタイトルを使用）
        const defaultFileName = `${currentData.title || 'flow'}.json`;
        link.download = fileName || defaultFileName;

        // リンクをクリックしてダウンロードを開始
        document.body.appendChild(link);
        link.click();

        // クリーンアップ
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        useErrorStore
          .getState()
          .showError(
            error instanceof Error ? error : new Error('ファイルの保存中にエラーが発生しました')
          );
        throw error;
      }
    },
  };
});

export default useFileOperationStore;