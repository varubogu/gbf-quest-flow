import useFlowStore from '@/core/stores/flowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import { clearHistory } from './historyService';
import { errorFactory } from '@/core/services/errorService';
import useErrorStore from '@/core/stores/errorStore';
import { setFlowData } from '@/core/services/flowService';

/**
 * 編集モード関連のサービス
 *
 * このサービスは、編集モードの開始・終了・キャンセルなどの機能を提供します。
 */

/**
 * 編集モードの状態を取得する
 * @returns 編集モードの状態
 */
export function getIsEditMode(): boolean {
  return useEditModeStore.getState().getIsEditMode();
}

/**
 * 編集モードの状態を設定する
 * @param isEdit 編集モードの状態
 */
export function setIsEditMode(isEdit: boolean): void {
  useEditModeStore.getState().setIsEditMode(isEdit);
}

/**
 * 編集モードを開始する
 *
 * 現在のデータを保存し、編集モードをオンにします。
 */
export function startEdit(): void {
  try {
    const flowData = useFlowStore.getState().getFlowData();

    if (flowData) {
      // 編集モード開始時の処理
      const originalData = structuredClone(flowData);
      useFlowStore.setState({ originalData });
    }

    useEditModeStore.getState().startEdit();
  } catch (error) {
    useErrorStore
      .getState()
      .showError(
        errorFactory.createUnknownError(
          error instanceof Error ? error : new Error('編集モードの設定中にエラーが発生しました')
        )
      );
  }
}

/**
 * 編集モードを終了する（保存）
 *
 * 編集内容を保存し、編集モードをオフにします。
 */
export function finishEdit(): void {
  try {
    // 編集モード終了時の処理
    clearHistory();
    useFlowStore.setState({ originalData: null });
    useEditModeStore.getState().endEdit();
  } catch (error) {
    useErrorStore
      .getState()
      .showError(
        errorFactory.createUnknownError(
          error instanceof Error ? error : new Error('編集モードの終了中にエラーが発生しました')
        )
      );
  }
}

/**
 * 編集モードを終了する（キャンセル）
 *
 * 編集内容を破棄し、元のデータに戻します。
 */
export function cancelEdit(): void {
  try {
    const originalData = useFlowStore.getState().originalData;
    if (originalData) {
      // 編集キャンセル時の処理
      const clonedData = structuredClone(originalData);

      // flowStoreを更新（flowService経由）
      setFlowData(clonedData);

      // 編集前データを破棄
      useFlowStore.setState({ originalData: null });

      // 履歴をクリア
      clearHistory();
    }
    useEditModeStore.getState().endEdit();
    // 履歴を戻る（popstateイベントが発火してデータが復元される）
    history.back();
  } catch (error) {
    useErrorStore
      .getState()
      .showError(
        errorFactory.createUnknownError(
          error instanceof Error ? error : new Error('編集のキャンセル中にエラーが発生しました')
        )
      );
  }
}

// 新規フロー作成機能はflowInitService.tsに移動しました