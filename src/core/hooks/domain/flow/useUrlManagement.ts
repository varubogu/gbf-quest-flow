import { useCallback } from 'react';
import type { Flow, ViewMode } from '@/types/models';
import { handleError } from '@/lib/utils/accessibility';
import * as urlFacade from '@/core/facades/urlFacade';


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
 * URLとブラウザ履歴を管理するカスタムフック（新しいurlFacadeを使用）
 */
export function useUrlManagement({
  flowData,
  isEditMode,
  sourceId = null,
  initialMode = 'view'
}: UseUrlManagementProps): UseUrlManagementResult {
  const handleUrlChange = useCallback(() => {
    try {
      const isNewMode = initialMode === 'new' || (isEditMode && flowData?.title === '新しいフロー');

      if (isNewMode) {
        urlFacade.updateUrlForNewFlow(flowData);
      } else if (isEditMode) {
        urlFacade.updateUrlForEditMode(sourceId, flowData);
      } else if (sourceId) {
        urlFacade.updateUrlForViewMode(sourceId, flowData);
      } else {
        urlFacade.updateUrlForViewMode(null, flowData);
      }
    } catch (error) {
      handleError(error, 'URL更新中');
    }
  }, [isEditMode, sourceId, initialMode, flowData]);

  return { handleUrlChange };
}