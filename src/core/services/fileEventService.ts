import type { Flow } from '@/types/models';
import { announceToScreenReader, handleError } from '@/lib/utils/accessibility';
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

    // URLを更新（fileOperationServiceに委譲）
    updateViewModeState(data);
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

/**
 * 新規作成時のURL状態とアクセシビリティを更新する
 * @param flowData 現在のフローデータ（新規作成をキャンセルした時の履歴用）
 */
export const updateNewFlowState = (flowData: Flow | null = null): void => {
  try {
    if (flowData) {
      history.pushState({ flowData }, '', '/?mode=new');
    }
    announceToScreenReader('新しいフローを作成しました');
  } catch (error) {
    handleError(error, '新規作成中');
  }
};

/**
 * 表示モード時のURL状態を更新する
 * @param flowData フローデータ
 */
export function updateViewModeState(flowData: Flow): void {
  try {
    history.pushState(
      { isSaving: false, flowData },
      '',
      `${window.location.pathname}?mode=view`
    );
  } catch (error) {
    handleError(error, 'URL更新中');
  }
};