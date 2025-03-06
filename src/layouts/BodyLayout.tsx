import React, { useEffect, useCallback, useState, useRef } from 'react';
import useFlowStore from '@/core/stores/flowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import { setIsEditMode, startEdit, createNewFlow } from '@/core/facades/editModeStoreFacade';
import { LoadingLayout } from './LoadingLayout';
import { EmptyLayout } from './EmptyLayout';
import { FlowLayout } from './FlowLayout';
import type { Flow, ViewMode } from '@/types/models';
import { announceToScreenReader, handleError } from '@/lib/utils/accessibility';
import { useUrlManagement } from '@/core/hooks/domain/flow/useUrlManagement';
import { useEditHistory } from '@/core/hooks/domain/flow/useEditHistory';
import { useKeyboardShortcuts } from '@/core/hooks/ui/base/useKeyboardShortcuts';
import { useFlowDataModification } from '@/core/hooks/domain/flow/useFlowDataModification';
import { handleFlowSave, handleNewFlow, handleExitEditMode } from '@/core/facades/flowEventService';
import * as flowFacade from '@/core/facades/flowFacade';
import { setupHistoryListener } from '@/core/facades/urlFacade';

interface Props {
  initialData?: Flow | null;
  initialMode?: ViewMode;
  sourceId?: string | null;
}

function BodyContent({ initialData = null, initialMode = 'view', sourceId = null }: Props): React.ReactElement {
  const [isLoading, setIsLoading] = useState(true);
  const initializedRef = useRef(false);

  // 各ストアから状態を取得
  const flowData = useFlowStore((state) => state.flowData as Flow | null);
  const isEditMode = useEditModeStore((state) => state.isEditMode as boolean);

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
    setFlowData: flowFacade.setFlowData,
    setIsEditMode,
    sourceId,
    initialMode,
  });

  // 履歴管理（新しいurlFacadeを使用）
  useEffect(() => {
    const cleanup = setupHistoryListener({
      onModeChange: (mode) => {
        if (mode === 'new') {
          createNewFlow();
          setIsEditMode(true);
        } else if (mode === 'edit') {
          setIsEditMode(true);
        } else {
          setIsEditMode(false);
        }
      },
      onFlowDataChange: (flowData) => {
        flowFacade.setFlowData(flowData);
      },
      onInitialData: () => {
        if (initialData) {
          flowFacade.setFlowData(initialData);
        }
      }
    });

    return cleanup;
  }, [initialData]);

  // キーボードショートカット - 新しいインターフェースを使用
  useKeyboardShortcuts({
    onSave: handleSave,
    onNew: handleNewCallback,
    onExitEditMode: handleExitEditModeCallback,
  });

  // 初期データの設定
  useEffect(() => {
    if (initializedRef.current) return;

    const setupInitialData = async (): Promise<void> => {
      try {
        if (initialData) {
          flowFacade.setFlowData(initialData);
          if (initialMode === 'edit') {
            startEdit();
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
  }, [initialData, initialMode]);

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
