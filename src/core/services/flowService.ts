import type { Flow, Action } from '@/types/models';
import useFlowStore from '@/core/stores/flowStore';
import useErrorStore from '@/core/stores/errorStore';
import { pushToHistory, clearHistory } from '@/core/services/historyService';

/**
 * フローデータ操作関連のサービス
 *
 * このサービスは、フローデータの更新や操作に関する機能を提供します。
 * flowStoreの状態更新ロジックもこのサービスに集約されています。
 */

// ロジック関数 - データ更新時の共通処理
export function handleDataUpdate(
  currentData: Flow,
  updates: Partial<Flow>
): { newData: Flow; shouldUpdate: boolean } {
  // 新しいデータを作成
  const newData = {
    ...currentData,
    ...updates,
  };

  // 現在のデータと新しいデータが異なる場合のみ処理を続行
  const shouldUpdate = JSON.stringify(currentData) !== JSON.stringify(newData);

  return { newData, shouldUpdate };
}

// ロジック関数 - アクションを更新
export function mergeActionWithUpdates(existingAction: Partial<Action> | undefined, updates: Partial<Action>): Action {
  return {
    hp: existingAction?.hp || '',
    prediction: existingAction?.prediction || '',
    charge: existingAction?.charge || '',
    guard: existingAction?.guard || '',
    action: existingAction?.action || '',
    note: existingAction?.note || '',
    ...updates,
  };
}

// ロジック関数 - アクションの更新処理
export function updateFlowWithAction(currentData: Flow, index: number, updates: Partial<Action>): Flow {
  const newFlow = [...currentData.flow];
  newFlow[index] = mergeActionWithUpdates(newFlow[index], updates);

  return {
    ...currentData,
    flow: newFlow,
  };
}

// ロジック関数 - エラーハンドリング
export function handleError(error: unknown, defaultMessage: string): void {
  useErrorStore
    .getState()
    .showError(
      error instanceof Error ? error : new Error(defaultMessage)
    );
}

/**
 * フローデータの設定
 *
 * データ読み込みなど別なデータに切り替える際に使用します。
 * 編集履歴はリセットされます。
 * @param data フローデータ
 */
export function setFlowData(data: Flow | null): void {
  clearHistory();
  useFlowStore.getState().setFlowData(data);
}

/**
 * フローデータの更新処理
 *
 * 編集内容は編集履歴に追加されます。
 * @param updates 更新内容（部分更新）
 */
export function updateFlowData(updates: Partial<Flow>): void {
  try {
    const currentData = useFlowStore.getState().getFlowData();
    if (!currentData) return;

    // データ更新処理
    const { newData, shouldUpdate } = handleDataUpdate(currentData, updates);

    // 更新が必要ない場合は処理を終了
    if (!shouldUpdate) return;

    // 変更後のデータを設定（内部メソッドを使用）
    useFlowStore.getState().setFlowData(newData);

    // 編集モード中のみ履歴に追加（変更後のデータを保存）
    pushToHistory(newData);
  } catch (error) {
    handleError(error, 'データの更新中にエラーが発生しました');
  }
}

/**
 * アクションの更新処理
 *
 * 編集内容は編集履歴に追加されます。
 * @param index アクションのインデックス
 * @param updates 更新内容（部分更新）
 */
export function updateAction(index: number, updates: Partial<Action>): void {
  try {
    const currentData = useFlowStore.getState().getFlowData();
    if (!currentData) return;

    // アクション更新処理
    const newData = updateFlowWithAction(currentData, index, updates);

    // 変更後のデータを設定（内部メソッドを使用）
    useFlowStore.getState().setFlowData(newData);

    pushToHistory(newData);
  } catch (error) {
    handleError(error, 'アクションの更新中にエラーが発生しました');
  }
}