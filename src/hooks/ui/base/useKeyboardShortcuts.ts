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
}: Props): void => {
  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent): Promise<void> => {
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
    return (): void => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditMode, flowData, onExitEditMode, clearHistory, sourceId]);
};