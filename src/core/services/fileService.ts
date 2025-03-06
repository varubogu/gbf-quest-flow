import type { Flow } from '@/types/models';
import useFlowStore from '@/core/stores/flowStore';
import useEditModeStore from '../stores/editModeStore';
import useCursorStore from '../stores/cursorStore';
import { clearHistory } from './historyService';
import {
  readJsonFile,
  selectFile,
  saveJsonToFile,
  handleFileOperationError
} from './fileOperationService';
import { newFlowData } from './flowDataInitService';

/**
 * ファイル操作関連のサービス
 *
 * このサービスは、ファイルの読み込みや保存に関する高レベルな機能を提供します。
 * 実際のファイル操作はfileOperationServiceに委譲し、
 * データ初期化はflowDataInitServiceに委譲します。
 */

// 新規フローデータ作成の再エクスポート
export { newFlowData } from './flowDataInitService';

// ファイル操作関数の再エクスポート
export {
  readJsonFile,
  createFileInput,
  selectFile,
  saveJsonToFile
} from './fileOperationService';

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

    // 履歴をクリア
    clearHistory();

    // カーソル位置をリセット
    useCursorStore.getState().setCurrentRow(0);

    // 編集モードをリセット
    useEditModeStore.setState({ isEditMode: false });

    // flowStoreを更新
    useFlowStore.setState({
      flowData: data,
      originalData: null,
    });

    // 更新後の状態を確認
    const updatedState = useFlowStore.getState();
    if (!updatedState.flowData) {
      console.error('loadFlowFromFile: 状態の更新に失敗しました', updatedState);
    }

    // URLを更新
    history.pushState(
      { isSaving: false, flowData: data },
      '',
      `${window.location.pathname}?mode=view`
    );
  } catch (error) {
    console.error('ファイル読み込みエラー:', error);
    handleFileOperationError(error, 'ファイルの読み込み中にエラーが発生しました');
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
};