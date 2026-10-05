import { clearHistory } from '@/core/services/historyService';
import {
  readJsonFile,
  selectFile,
  saveJsonToFile,
  handleFileOperationError,
} from '@/core/services/fileOperationService';
import useFlowStore from '@/core/stores/flowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import useCursorStore from '@/core/stores/cursorStore';
import { updateUrlForViewMode } from '@/core/services/urlService';
import { fetchFlowFromQuery, type RemoteFlowQuery } from '@/core/services/remoteFlowService';
import type { Flow } from '@/types/models';

/**
 * ファイル操作関連のサービス
 *
 * このサービスは、ファイルの読み込みや保存に関する高レベルな機能を提供します。
 * 実際のファイル操作はfileOperationServiceに委譲し、
 * データ初期化はflowDataInitServiceに委譲します。
 */

// ファイル操作関数の再エクスポート
export { readJsonFile, createFileInput, selectFile, saveJsonToFile } from './fileOperationService';

/**
 * 読み込んだフローをストアに反映する
 */
export function applyLoadedFlow(data: Flow, sourceId: string | null = null): void {
  clearHistory();
  useCursorStore.getState().setCurrentRow(0);
  useEditModeStore.setState({ isEditMode: false });
  useFlowStore.setState({
    flowData: data,
    originalData: null,
  });
  updateUrlForViewMode(sourceId, data);
}

/**
 * JSONファイルからフローデータを読み込む
 */
export async function loadFlowFromFile(): Promise<void> {
  try {
    // ファイル選択ダイアログを表示
    const file = await selectFile();
    if (!file) {
      return;
    }

    // ファイルからJSONを読み込む
    const data = await readJsonFile(file);
    if (!data) {
      throw new Error('ファイルからデータを読み込めませんでした');
    }

    applyLoadedFlow(data);
  } catch (error) {
    console.error('ファイル読み込みエラー:', error);
    handleFileOperationError(error, 'ファイルの読み込み中にエラーが発生しました');
    throw error;
  }
}

/**
 * URL またはコンテンツIDからフローデータを読み込む
 */
export async function loadFlowFromQuery(query: RemoteFlowQuery): Promise<void> {
  try {
    const data = await fetchFlowFromQuery(query);
    applyLoadedFlow(data, query.dataId);
  } catch (error) {
    handleFileOperationError(error, 'URLからの読み込み中にエラーが発生しました');
    throw error;
  }
}

/**
 * 現在のフローデータをJSONファイルとして保存
 * @param fileName - 保存するファイル名（省略時はフロータイトルを使用）
 */
export async function saveFlowToFile(fileName?: string): Promise<void> {
  try {
    // まずflowStoreからデータを取得
    let currentData = useFlowStore.getState().getFlowData();

    if (!currentData) {
      throw new Error('保存するデータがありません');
    }

    // ファイル保存処理
    await saveJsonToFile(currentData, fileName);
  } catch (error) {
    handleFileOperationError(error, 'ファイルの保存中にエラーが発生しました');
    throw error;
  }
}
