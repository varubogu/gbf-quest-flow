import type { Flow, ViewMode } from '@/types/models';
import {
  updateUrlForNewFlow as updateUrlForNewFlow_Service,
  updateUrlForEditMode as updateUrlForEditMode_Service,
  updateUrlForViewMode as updateUrlForViewMode_Service,
  updateUrlForSaving as updateUrlForSaving_Service,
  createPopStateHandler as createPopStateHandler_Service,
  parseCurrentUrl as parseCurrentUrl_Service
} from '@/core/services/urlService';

/**
 * URL操作と履歴管理のファサード
 *
 * このファサードは、コンポーネントからURLサービスへのアクセスを提供します。
 * コンポーネントはこのファサードを通じてURL操作を行うことで、
 * URLサービスの実装詳細から切り離されます。
 */

/**
 * 現在のURLからモードとソースIDを解析する
 */
export function parseCurrentUrl(): { mode: ViewMode; sourceId: string | null } {
  return parseCurrentUrl_Service();
}

/**
 * 新規フロー作成時のURLを更新する
 * @param flowData 現在のフローデータ（新規作成をキャンセルした時の履歴用）
 */
export function updateUrlForNewFlow(flowData: Flow | null = null): void {
  updateUrlForNewFlow_Service(flowData);
}

/**
 * 編集モード時のURLを更新する
 * @param sourceId ソースID（省略可）
 * @param flowData フローデータ（省略可）
 */
export function updateUrlForEditMode(
  sourceId: string | null = null,
  flowData: Flow | null = null
): void {
  updateUrlForEditMode_Service(sourceId, flowData);
}

/**
 * 表示モード時のURLを更新する
 * @param sourceId ソースID（省略可）
 * @param flowData フローデータ（省略可）
 */
export function updateUrlForViewMode(
  sourceId: string | null = null,
  flowData: Flow | null = null
): void {
  updateUrlForViewMode_Service(sourceId, flowData);
}

/**
 * 保存中状態のURLを更新する
 * @param flowData フローデータ
 */
export function updateUrlForSaving(flowData: Flow): void {
  updateUrlForSaving_Service(flowData);
}

/**
 * 履歴管理のリスナーをセットアップする
 * @param handlers イベントハンドラー
 * @returns クリーンアップ関数
 */
export function setupHistoryListener(handlers: {
  onModeChange: (_mode: ViewMode) => void;
  onSourceChange?: (_sourceId: string | null) => void;
  onFlowDataChange?: (_flowData: Flow) => void;
  onInitialData?: (_initialData: Flow | null) => void;
}): () => void {
  const handlePopState = createPopStateHandler_Service(handlers);
  window.addEventListener('popstate', handlePopState);
  return (): void => window.removeEventListener('popstate', handlePopState);
}

/**
 * 現在のURLに基づいてアプリケーションの初期状態を設定する
 * @param handlers 初期状態設定ハンドラー
 */
export function initializeFromUrl(handlers: {
  onModeChange: (_mode: ViewMode) => void;
  onSourceChange?: (_sourceId: string | null) => void;
}): void {
  const { mode, sourceId } = parseCurrentUrl();
  handlers.onModeChange(mode);
  if (handlers.onSourceChange) {
    handlers.onSourceChange(sourceId);
  }
}