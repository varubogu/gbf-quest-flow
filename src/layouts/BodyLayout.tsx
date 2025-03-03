import React, { useEffect, useCallback, useState, useRef } from 'react';
import useFlowStore from '@/core/stores/flowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import { LoadingLayout } from './LoadingLayout';
import { EmptyLayout } from './EmptyLayout';
import { FlowLayout } from './FlowLayout';
import type { Flow, ViewMode } from '@/types/models';
import { announceToScreenReader, handleError } from '@/lib/utils/accessibility';
import { useUrlManagement } from '@/core/hooks/domain/flow/useUrlManagement';
import { useHistoryManagement } from '@/core/hooks/domain/flow/useHistoryManagement';
import { useEditHistory } from '@/core/hooks/domain/flow/useEditHistory';
import { useKeyboardShortcuts } from '@/core/hooks/ui/base/useKeyboardShortcuts';
import { useFlowDataModification } from '@/core/hooks/domain/flow/useFlowDataModification';
import { handleFlowSave, handleNewFlow, handleExitEditMode } from '@/core/facades/flowEventService';
import { useTranslation } from 'react-i18next';

interface Props {
  initialData?: Flow | null;
  initialMode?: ViewMode;
  sourceId?: string | null;
}

function BodyContent({ initialData = null, initialMode = 'view', sourceId = null }: Props): React.ReactElement {
  const [isLoading, setIsLoading] = useState(true);
  const initializedRef = useRef(false);
  const { t } = useTranslation();

  // 各ストアから状態を取得 - 型アサーションを使用
  const flowData = useFlowStore((state) => (state as any).flowData);
  const isEditMode = useEditModeStore((state) => (state as any).isEditMode);
  const setIsEditMode = useEditModeStore((state) => (state as any).setIsEditMode);
  const setFlowData = useFlowStore((state) => (state as any).setFlowData);
  const createNewFlow = useEditModeStore((state) => (state as any).createNewFlow);

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
  const handleSave = useCallback(async (): Promise<boolean> => {
    try {
      if (!flowData) return false;
      const success = await handleFlowSave(flowData, sourceId, clearHistory);
      if (success) {
        announceToScreenReader('保存しました');
      }
      return success || false;
    } catch (error) {
      handleError(error, '保存中');
      return false;
    }
  }, [flowData, sourceId, clearHistory]);

  // 新規作成処理
  const handleNewCallback = useCallback(() => {
    try {
      handleNewFlow(flowData);
    } catch (error) {
      handleError(error, '新規作成中');
    }
  }, [flowData]);

  // URL管理
  const { handleUrlChange } = useUrlManagement({
    flowData,
    isEditMode,
    setFlowData,
    setIsEditMode,
    sourceId,
    initialMode,
  });

  // 履歴管理
  useHistoryManagement(createNewFlow, setIsEditMode, setFlowData, initialData);

  // キーボードショートカット - 新しいインターフェースを使用
  useKeyboardShortcuts({
    onSave: handleSave,
    onNew: handleNewCallback,
    onExitEditMode: handleExitEditModeCallback,
  });

  // 初期データの設定
  useEffect(() => {
    if (initializedRef.current) return;

    const setupInitialData = async () => {
      try {
        if (initialData) {
          setFlowData(initialData);
          if (initialMode === 'edit') {
            setIsEditMode(true);
          }
        }
        setIsLoading(false);
        initializedRef.current = true;
      } catch (error) {
        handleError(error, '初期データ設定中');
        setIsLoading(false);
      }
    };

    setupInitialData();
  }, [initialData, initialMode, setFlowData, createNewFlow, setIsEditMode]);

  // URLの変更を監視
  useEffect(() => {
    if (!initializedRef.current) return;
    handleUrlChange();
  }, [flowData, isEditMode, handleUrlChange]);

  // ローディング中
  if (isLoading) {
    return <LoadingLayout />;
  }

  // データがない場合
  if (!flowData) {
    return <EmptyLayout onNew={handleNewCallback} />;
  }

  // データがある場合
  return (
    <FlowLayout
      flowData={flowData}
      isEditMode={isEditMode}
      onSave={handleSave}
      onNew={handleNewCallback}
      onExitEditMode={handleExitEditModeCallback}
      onTitleChange={handleTitleChange}
      onAlwaysChange={handleAlwaysChange}
    />
  );
}

export default function BodyLayout(props: Props): React.ReactElement {
  return <BodyContent {...props} />;
}
