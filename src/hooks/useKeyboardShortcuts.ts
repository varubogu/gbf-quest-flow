import { useEffect } from 'react';
import { announceToScreenReader, handleError } from '@/utils/accessibility';
import useFlowStore from '@/stores/flowStore';
import type { Flow } from '@/types/models';
import { saveFlow, updateNewFlowState as updateNewState } from '@/utils/flowOperations';

interface UseKeyboardShortcutsProps {
  isEditMode: boolean;
  flowData: Flow | null;
  sourceId: string | null;
  onExitEditMode: () => Promise<void>;
  clearHistory: () => void;
}

export const useKeyboardShortcuts = ({
  isEditMode,
  flowData,
  sourceId,
  onExitEditMode,
  clearHistory,
}: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const { setIsEditMode, createNewFlow } = useFlowStore.getState();

      // Ctrl + S で保存
      if (e.ctrlKey && e.key === 's' && isEditMode && flowData) {
        e.preventDefault();
        const success = await saveFlow(flowData, sourceId);
        if (success) {
          setIsEditMode(false);
          clearHistory();
          const currentPath = sourceId ? `/${sourceId}` : '/';
          history.replaceState({ flowData, isSaving: true }, '', currentPath);
        }
      }

      // Ctrl + N で新規作成
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        createNewFlow();
        updateNewState(flowData);
      }

      // Escで編集モード終了
      if (e.key === 'Escape' && isEditMode) {
        e.preventDefault();
        await onExitEditMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditMode, flowData, sourceId, onExitEditMode, clearHistory]);
};