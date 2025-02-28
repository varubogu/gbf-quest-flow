import { useEffect } from 'react';
import type { Flow } from '@/types/models';
import { handleFlowSave, handleNewFlow } from '@/core/facades/flowEventService';
import useBaseFlowStoreFacade from '@/core/facades/baseFlowStoreFacade';

// 従来のインターフェース
interface Props {
  isEditMode: boolean;
  flowData: Flow | null;
  onExitEditMode: () => Promise<void>;
  clearHistory: () => void;
  sourceId?: string | null;
}

// 新しいインターフェース
interface NewProps {
  onSave: () => Promise<boolean>;
  onNew: () => void;
  onExitEditMode: () => Promise<void>;
}

// BaseFlowStoreFacadeの状態の型定義
interface BaseFlowState {
  flowData: Flow | null;
  isEditMode: boolean;
}

// 新しいインターフェースを使用する実装
export const useKeyboardShortcuts = (props: NewProps): void => {
  // BaseFlowStoreFacadeから状態を取得
  const flowData = useBaseFlowStoreFacade((state: BaseFlowState) => state.flowData);
  const isEditMode = useBaseFlowStoreFacade((state: BaseFlowState) => state.isEditMode);

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent): Promise<void> => {
      if (event.key === 'Escape') {
        await props.onExitEditMode();
        return;
      }

      if (!event.ctrlKey) return;

      if (event.key === 's' && isEditMode && flowData) {
        event.preventDefault();
        await props.onSave();
      } else if (event.key === 'n') {
        event.preventDefault();
        props.onNew();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return (): void => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditMode, flowData, props]);
};

// 後方互換性のために古いインターフェースも維持
export const useKeyboardShortcutsLegacy = ({
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