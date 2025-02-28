import { useEffect, useCallback } from 'react';
import type { Flow, ViewMode } from '@/types/models';
import { handleError } from '@/lib/utils/accessibility';

interface HistoryState {
  isSaving: boolean;
  flowData: Flow;
}

interface UseUrlManagementProps {
  flowData: Flow | null;
  isEditMode: boolean;
  setFlowData: (_data: Flow | null) => void;
  setIsEditMode: (_isEdit: boolean) => void;
  sourceId?: string | null;
  initialMode?: ViewMode;
}

interface UseUrlManagementResult {
  handleUrlChange: () => void;
}

/**
 * URLとブラウザ履歴を管理するカスタムフック
 */
export function useUrlManagement({
  flowData,
  isEditMode,
  setFlowData: _setFlowData,
  setIsEditMode: _setIsEditMode,
  sourceId = null,
  initialMode = 'view'
}: UseUrlManagementProps): UseUrlManagementResult {
  const handleUrlChange = useCallback(() => {
    try {
      if ((history.state as HistoryState | null)?.isSaving) {
        return;
      }

      const isNewMode = initialMode === 'new' || (isEditMode && flowData?.title === '新しいフロー');
      const state = flowData ? { flowData } : null;

      if (isNewMode) {
        history.pushState(state, '', '/?mode=new');
      } else if (isEditMode && sourceId) {
        history.pushState(state, '', `/${sourceId}?mode=edit`);
      } else if (isEditMode) {
        history.pushState(state, '', '/?mode=edit');
      } else if (sourceId) {
        history.pushState(state, '', `/${sourceId}`);
      } else {
        history.pushState(state, '', '/');
      }
    } catch (error) {
      handleError(error, 'URL更新中');
    }
  }, [isEditMode, sourceId, initialMode, flowData]);

  return { handleUrlChange };
}

// 後方互換性のために古いインターフェースも維持
export function useUrlManagementLegacy(
  isEditMode: boolean,
  sourceId: string | null | undefined,
  initialMode: ViewMode,
  flowData: Flow | null
): void {
  useEffect(() => {
    try {
      if ((history.state as HistoryState | null)?.isSaving) {
        return;
      }

      const isNewMode = initialMode === 'new' || (isEditMode && flowData?.title === '新しいフロー');
      const state = flowData ? { flowData } : null;

      if (isNewMode) {
        history.pushState(state, '', '/?mode=new');
      } else if (isEditMode && sourceId) {
        history.pushState(state, '', `/${sourceId}?mode=edit`);
      } else if (isEditMode) {
        history.pushState(state, '', '/?mode=edit');
      } else if (sourceId) {
        history.pushState(state, '', `/${sourceId}`);
      } else {
        history.pushState(state, '', '/');
      }
    } catch (error) {
      handleError(error, 'URL更新中');
    }
  }, [isEditMode, sourceId, initialMode, flowData]);
}