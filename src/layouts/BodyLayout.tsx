import React, { useEffect, useCallback, useMemo } from 'react';
import useFlowStore from '@/stores/flowStore';
import { LoadingLayout } from './LoadingLayout';
import { EmptyLayout } from './EmptyLayout';
import { FlowLayout } from './FlowLayout';
import type { Flow, ViewMode } from '@/types/models';
import { announceToScreenReader, handleError } from '@/utils/accessibility';
import { useUrlManagement } from '@/hooks/useUrlManagement';
import { useHistoryManagement } from '@/hooks/useHistoryManagement';
import { useEditHistory } from '@/hooks/useEditHistory';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface Props {
  initialData?: Flow | null;
  initialMode?: ViewMode;
  sourceId?: string | null;
}

function BodyContent({ initialData = null, initialMode = 'view', sourceId }: Props) {
  const [isLoading, setIsLoading] = React.useState(true);
  const flowData = useFlowStore((state) => state.flowData);
  const isEditMode = useFlowStore((state) => state.isEditMode);
  const setIsEditMode = useFlowStore((state) => state.setIsEditMode);
  const setFlowData = useFlowStore((state) => state.setFlowData);
  const createNewFlow = useFlowStore((state) => state.createNewFlow);
  const { recordChange, clearHistory, hasChanges } = useEditHistory(flowData);

  // 編集モードの終了処理
  const handleExitEditMode = useCallback(async () => {
    try {
      if (hasChanges) {
        const shouldDiscard = window.confirm(
          '変更内容が保存されていません。変更を破棄してもよろしいですか？'
        );
        if (!shouldDiscard) {
          return;
        }
      }
      const store = useFlowStore.getState();
      const originalData = store.originalData;
      if (originalData) {
        setFlowData(structuredClone(originalData));
      }
      setIsEditMode(false);
      clearHistory();
      announceToScreenReader('編集モードを終了しました');
    } catch (error) {
      handleError(error, '編集モード終了中');
    }
  }, [hasChanges, setIsEditMode, clearHistory, setFlowData]);

  // タイトルの変更処理
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!flowData) return;
      try {
        const newData = {
          ...flowData,
          title: e.target.value,
        };
        setFlowData(newData);
        recordChange(newData);
      } catch (error) {
        handleError(error, 'タイトル更新中');
      }
    },
    [flowData, setFlowData, recordChange]
  );

  // 常時実行項目の変更処理
  const handleAlwaysChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!flowData) return;
      try {
        const newData = {
          ...flowData,
          always: e.target.value,
        };
        setFlowData(newData);
        recordChange(newData);
      } catch (error) {
        handleError(error, '常時実行項目更新中');
      }
    },
    [flowData, setFlowData, recordChange]
  );

  // キーボードショートカットの設定
  useKeyboardShortcuts({
    isEditMode,
    flowData,
    sourceId,
    onExitEditMode: handleExitEditMode,
    clearHistory,
  });

  const flowLayoutProps = useMemo(() => {
    if (!flowData) return null;
    return {
      flowData,
      isEditMode,
      onTitleChange: handleTitleChange,
      onAlwaysChange: handleAlwaysChange,
      onExitEditMode: handleExitEditMode,
    };
  }, [
    flowData,
    isEditMode,
    handleTitleChange,
    handleAlwaysChange,
    handleExitEditMode,
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

function BodyLayout({ initialData = null, initialMode = 'view', sourceId }: Props) {
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
