import React, { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import useFlowStoreFacade from '@/core/facades/flowStoreFacade';
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

interface Props {
  initialData?: Flow | null;
  initialMode?: ViewMode;
  sourceId?: string | null;
}

function BodyContent({ initialData = null, initialMode = 'view', sourceId = null }: Props): React.ReactElement {
  const [isLoading, setIsLoading] = useState(true);
  const initializedRef = useRef(false);

  // 各ストアから状態を取得
  const flowData = useFlowStoreFacade((state) => state.flowData);
  const isEditMode = useFlowStoreFacade((state) => state.isEditMode);
  const setIsEditMode = useFlowStoreFacade((state) => state.setIsEditMode);
  const setFlowData = useFlowStoreFacade((state) => state.setFlowData);
  const createNewFlow = useFlowStoreFacade((state) => state.createNewFlow);

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
    if (!flowData) return false;
    return await handleFlowSave(flowData, sourceId, clearHistory);
  }, [flowData, sourceId, clearHistory]);

  // 新規作成処理
  const handleNew = useCallback(() => {
    console.log('新規フロー作成を開始します');
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

  // 初期化処理
  useEffect(() => {
    if (initializedRef.current) return;

    try {
      if (initialData) {
        console.log('初期データを設定します:', initialData.title);
        setFlowData(initialData);
      }

      if (initialMode === 'new') {
        console.log('新規モードで初期化します');
        createNewFlow();
        setIsEditMode(true);
      } else if (initialMode === 'edit') {
        console.log('編集モードで初期化します');
        setIsEditMode(true);
      }

      // 初期化完了後、ローディング状態を解除
      setTimeout(() => {
        setIsLoading(false);
        initializedRef.current = true;
        console.log('BodyContent: 初期化完了');
      }, 300);
    } catch (error) {
      console.error('初期化中にエラーが発生しました:', error);
      setIsLoading(false);
      initializedRef.current = true;
    }
  }, [initialData, initialMode, setFlowData, createNewFlow, setIsEditMode]);

  // モード切り替え時の通知
  useEffect(() => {
    if (flowData) {
      announceToScreenReader(`フローの${isEditMode ? '編集' : '表示'}モードです`);
    }
  }, [isEditMode, flowData]);

  if (isLoading) {
    return <LoadingLayout />;
  }

  if (initialMode === 'new' && !flowData) {
    console.log('新規モードだがflowDataがないため、createNewFlowを呼び出します');
    createNewFlow();
    return <LoadingLayout />;
  }

  if (!flowData || !flowLayoutProps) {
    console.log('flowDataまたはflowLayoutPropsがないため、EmptyLayoutを表示します');
    return <EmptyLayout />;
  }

  console.log('FlowLayoutをレンダリングします:', flowData.title);
  return <FlowLayout {...flowLayoutProps} />;
}

function BodyLayout({ initialData = null, initialMode = 'view', sourceId }: Props): React.ReactElement {
  const [initialized, setInitialized] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    try {
      if (!initializedRef.current && initialData) {
        console.log('BodyLayout: 初期データを設定します');
        useFlowStoreFacade.getState().setFlowData(initialData);
      }
      setInitialized(true);
      initializedRef.current = true;
    } catch (error) {
      console.error('初期データの設定中にエラーが発生しました:', error);
      setInitialized(true);
      initializedRef.current = true;
    }
  }, [initialData]);

  if (!initialized) {
    return <LoadingLayout />;
  }

  console.log('BodyLayout: レンダリングします');
  return (
    <BodyContent initialData={initialData} initialMode={initialMode} sourceId={sourceId ?? null} />
  );
}

export default BodyLayout;
