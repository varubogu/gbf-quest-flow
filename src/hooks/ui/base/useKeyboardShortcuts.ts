import { useEffect } from 'react';
import type { Flow } from '@/types/models';
import { handleFlowSave, handleNewFlow } from '@/services/flowEventService';

interface Props {
  isEditMode: boolean;
  flowData: Flow | null;
  onExitEditMode: () => Promise<void>;
  clearHistory: () => void;
  sourceId?: string | null;
}

export const useKeyboardShortcuts = ({
  isEditMode,
  flowData,
  onExitEditMode,
  clearHistory,
  sourceId = null,
}: Props) => {
  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        await onExitEditMode();
        return;
      }

      if (!event.ctrlKey) return;

      if (event.key === 's' && isEditMode && flowData) {
        event.preventDefault();
        await handleFlowSave(flowData, sourceId, clearHistory);
      } else if (event.key === 'n') {
        event.preventDefault();
        handleNewFlow(flowData);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditMode, flowData, onExitEditMode, clearHistory, sourceId]);
};