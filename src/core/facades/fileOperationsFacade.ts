import { create } from 'zustand';
import { loadFlowFromFile as loadFlowFromFile_Service, saveFlowToFile as saveFlowToFile_Service } from '@/core/services/fileService';

/**
 * ファイル操作のファサード
 *
 * このファサードは、ファイル操作サービスにアクセスするための統一されたインターフェースを提供します。
 * これにより、コンポーネントはサービスの実装の詳細から切り離され、データアクセスの方法が変更されても
 * コンポーネント側の変更を最小限に抑えることができます。
 */
const useFileOperationsFacade = create((set, get) => {
  return {
    // FileService関連のメソッド
    loadFlowFromFile: async (): Promise<void> => await loadFlowFromFile_Service(),
    saveFlowToFile: async (fileName?: string): Promise<void> => await saveFlowToFile_Service(fileName),
  };
});

export default useFileOperationsFacade;