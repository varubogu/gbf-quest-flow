import { useCallback, useEffect } from 'react';
import type { Flow } from '@/types/models';

interface HistoryState {
  isSaving: boolean;
  flowData: Flow;
}

/**
 * ブラウザの履歴を管理するカスタムフック
 */
export function useHistoryManagement(
  createNewFlow: () => void,
  setIsEditMode: (_isEdit: boolean) => void,
  setFlowData: (_data: Flow) => void,
  initialData: Flow | null
): void {
  const handlePopState = useCallback(
    (event: PopStateEvent) => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const mode = searchParams.get('mode');
        const state = event.state as HistoryState | null;

        if (mode === 'new') {
          createNewFlow();
          setIsEditMode(true);
        } else if (mode === 'edit') {
          setIsEditMode(true);
        } else {
          if (!state?.isSaving) {
            setIsEditMode(false);
            if (state?.flowData) {
              setFlowData(state.flowData);
            } else if (initialData) {
              setFlowData(initialData);
            }
          }
        }
      } catch (error) {
        console.error('履歴の処理中にエラーが発生しました:', error);
      }
    },
    [createNewFlow, setIsEditMode, setFlowData, initialData]
  );

  useEffect(() => {
    window.addEventListener('popstate', handlePopState);
    return (): void => window.removeEventListener('popstate', handlePopState);
  }, [handlePopState]);
}