import { useEffect } from 'react';
import { announceToScreenReader, handleError } from '@/utils/accessibility';
import useFlowStore from '@/stores/flowStore';
import type { Flow } from '@/types/models';

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
        try {
          const dataStr = JSON.stringify(flowData, null, 2);
          const dataBlob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(dataBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${flowData.title || 'flow'}.json`;
          a.setAttribute('aria-label', `${flowData.title}をダウンロード`);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          setIsEditMode(false);
          clearHistory();
          const currentPath = sourceId ? `/${sourceId}` : '/';
          history.replaceState({ flowData, isSaving: true }, '', currentPath);
          announceToScreenReader('フローを保存しました');
        } catch (error) {
          handleError(error, '保存中');
        }
      }

      // Ctrl + N で新規作成
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        try {
          history.pushState({ flowData }, '', '/?mode=new');
          createNewFlow();
          setIsEditMode(true);
          announceToScreenReader('新しいフローを作成しました');
        } catch (error) {
          handleError(error, '新規作成中');
        }
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