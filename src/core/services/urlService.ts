import type { Flow, ViewMode } from '@/types/models';
import { handleError } from '@/lib/utils/accessibility';

/**
 * URL操作と履歴管理を一元化するサービス
 *
 * このサービスは以下の責務を持ちます：
 * 1. アプリケーションの状態に応じたURLの更新
 * 2. ブラウザの履歴管理（history API）
 * 3. URL変更時の状態更新
 */

export interface HistoryState {
  isSaving?: boolean;
  flowData?: Flow;
}

/**
 * 現在のURLからモードとソースIDを解析する
 */
export function parseCurrentUrl(): { mode: ViewMode; sourceId: string | null } {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const mode = searchParams.get('mode') as ViewMode | null;
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const sourceId = pathParts.length > 0 ? pathParts[0] : null;

    return {
      mode: mode || 'view',
      sourceId: sourceId || null
    };
  } catch (error) {
    handleError(error, 'URL解析中');
    return { mode: 'view', sourceId: null };
  }
}

/**
 * URLを更新する
 * @param mode 表示モード
 * @param sourceId ソースID（省略可）
 * @param flowData フローデータ（省略可）
 * @param isSaving 保存中かどうか（省略可）
 */
export function updateUrl(
  mode: ViewMode,
  sourceId: string | null = null,
  flowData: Flow | null = null,
  isSaving: boolean = false
): void {
  try {
    // 現在のhistory.stateがisSaving=trueの場合は更新しない
    if ((history.state as HistoryState | null)?.isSaving && !isSaving) {
      return;
    }

    const state: HistoryState = {};
    if (flowData) {
      state.flowData = flowData;
    }
    if (isSaving) {
      state.isSaving = true;
    }

    let url = '';

    // モードに応じてURLを生成
    if (mode === 'new') {
      url = '/?mode=new';
    } else if (mode === 'edit') {
      url = sourceId ? `/${sourceId}?mode=edit` : '/?mode=edit';
    } else if (mode === 'view') {
      url = sourceId ? `/${sourceId}` : '/';
      // 明示的にviewモードを指定する場合
      if (window.location.search.includes('mode=')) {
        url = sourceId ? `/${sourceId}?mode=view` : '/?mode=view';
      }
    }

    history.pushState(state, '', url);
  } catch (error) {
    handleError(error, 'URL更新中');
  }
}

/**
 * 新規フロー作成時のURLを更新する
 * @param flowData 現在のフローデータ（新規作成をキャンセルした時の履歴用）
 */
export function updateUrlForNewFlow(flowData: Flow | null = null): void {
  updateUrl('new', null, flowData);
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
  updateUrl('edit', sourceId, flowData);
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
  updateUrl('view', sourceId, flowData);
}

/**
 * 保存中状態のURLを更新する
 * @param flowData フローデータ
 */
export function updateUrlForSaving(flowData: Flow): void {
  updateUrl('view', null, flowData, true);
}

/**
 * popstateイベントのハンドラーを作成する
 * @param handlers イベントハンドラー
 */
export function createPopStateHandler(handlers: {
  onModeChange: (_mode: ViewMode) => void;
  onSourceChange?: (_sourceId: string | null) => void;
  onFlowDataChange?: (_flowData: Flow) => void;
  onInitialData?: (_initialData: Flow | null) => void;
}) {
  return (event: PopStateEvent): void => {
    try {
      const { mode, sourceId } = parseCurrentUrl();
      const state = event.state as HistoryState | null;

      // モード変更を通知
      handlers.onModeChange(mode);

      // ソースID変更を通知
      if (handlers.onSourceChange) {
        handlers.onSourceChange(sourceId);
      }

      // フローデータ変更を通知
      if (state?.flowData && handlers.onFlowDataChange) {
        handlers.onFlowDataChange(state.flowData);
      } else if (handlers.onInitialData) {
        handlers.onInitialData(null);
      }
    } catch (error) {
      handleError(error, '履歴の処理中');
    }
  };
}