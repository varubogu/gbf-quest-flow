import React, { useEffect, useCallback, useMemo } from 'react';
import useFlowStore from '@/core/stores/flowStore';
import { LoadingLayout } from './LoadingLayout';
import { EmptyLayout } from './EmptyLayout';
import { FlowLayout } from './FlowLayout';
import type { Flow, ViewMode } from '@/types/models';
import { announceToScreenReader, handleError } from '@/lib/utils/accessibility';
import { useUrlManagement } from '@/hooks/domain/flow/useUrlManagement';
import { useHistoryManagement } from '@/hooks/domain/flow/useHistoryManagement';
import { useEditHistory } from '@/hooks/domain/flow/useEditHistory';
import { useKeyboardShortcuts } from '@/hooks/ui/base/useKeyboardShortcuts';
import { useFlowDataModification } from '@/hooks/domain/flow/useFlowDataModification';
import { handleFlowSave, handleNewFlow, handleExitEditMode } from '@/core/facades/flowEventService';

interface Props {
  initialData?: Flow | null;
  initialMode?: ViewMode;
  sourceId?: string | null;
}

function BodyContent({ initialData = null, initialMode = 'view', sourceId = null }: Props): React.ReactElement {
  const [isLoading, setIsLoading] = React.useState(true);
  const flowData = useFlowStore((state) => state.flowData);
  const isEditMode = useFlowStore((state) => state.isEditMode);
  const setIsEditMode = useFlowStore((state) => state.setIsEditMode);
  const setFlowData = useFlowStore((state) => state.setFlowData);
  const createNewFlow = useFlowStore((state) => state.createNewFlow);
  const { recordChange, clearHistory, hasChanges } = useEditHistory(flowData);

  // 編集モードの終了処理
  const handleExitEditModeCallback = useCallback(async () => {
    try {
      await handleExitEditMode(hasChanges, clearHistory);
    } catch (error) {
      handleError(error, '編集モード終了中');
    }
  }, [hasChanges, clearHistory]);

  // データ変更処理
  const { handleTitleChange, handleAlwaysChange } = useFlowDataModification({
    flowData,
    recordChange,
  });

  // 保存処理
  const handleSave = useCallback(async () => {
    if (!flowData) return;
    await handleFlowSave(flowData, sourceId, clearHistory);
  }, [flowData, sourceId, clearHistory]);

  // 新規作成処理
  const handleNew = useCallback(() => {
    handleNewFlow(flowData);
  }, [flowData]);

  // キーボードショートカットの設定
  useKeyboardShortcuts({
    isEditMode,
    flowData,
    sourceId,
    onExitEditMode: handleExitEditModeCallback,
    clearHistory,
  });

  const flowLayoutProps = useMemo(() => {
    if (!flowData) return null;
    return {
      flowData,
      isEditMode,
      onTitleChange: handleTitleChange,
      onAlwaysChange: handleAlwaysChange,
      onExitEditMode: handleExitEditModeCallback,
      onSave: handleSave,
      onNew: handleNew,
    };
  }, [
    flowData,
    isEditMode,
    handleTitleChange,
    handleAlwaysChange,
    handleExitEditModeCallback,
    handleSave,
    handleNew,
  ]);

  useUrlManagement(isEditMode, sourceId, initialMode, flowData);
  useHistoryManagement(createNewFlow, setIsEditMode, setFlowData, initialData);

  useEffect(() => {
    try {
      if (initialData) {
        setFlowData(initialData);
      }
      if (initialMode === 'new') {
        createNewFlow();
        setIsEditMode(true);
      } else if (initialMode === 'edit') {
        setIsEditMode(true);
      }
    } catch (error) {
      console.error('初期化中にエラーが発生しました:', error);
    }
  }, [initialData, initialMode, setFlowData, createNewFlow, setIsEditMode]);

  // モード切り替え時の通知
  useEffect(() => {
    if (flowData) {
      announceToScreenReader(`フローの${isEditMode ? '編集' : '表示'}モードです`);
    }
  }, [isEditMode, flowData]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingLayout />;
  }

  if (initialMode === 'new' && !flowData) {
    createNewFlow();
    return <LoadingLayout />;
  }

  if (!flowData || !flowLayoutProps) {
    return <EmptyLayout />;
  }

  return <FlowLayout {...flowLayoutProps} />;
}

function BodyLayout({ initialData = null, initialMode = 'view', sourceId }: Props): React.ReactElement {
  useEffect(() => {
    try {
      if (initialData) {
        useFlowStore.getState().setFlowData(initialData);
      }
    } catch (error) {
      console.error('初期データの設定中にエラーが発生しました:', error);
    }
  }, [initialData]);

  return (
    <BodyContent initialData={initialData} initialMode={initialMode} sourceId={sourceId ?? null} />
  );
}

export default BodyLayout;
