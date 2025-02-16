import React, { useEffect } from 'react';
import { setTitle } from '@/lib/functions';
import useFlowStore from '@/stores/flowStore';
import { LoadingLayout } from './LoadingLayout';
import { EmptyLayout } from './EmptyLayout';
import { FlowLayout } from './FlowLayout';
import type { Flow, ViewMode } from '@/types/models';

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

  useEffect(() => {
    if (initialData) {
      setFlowData(initialData);
    }
    if (initialMode === 'new') {
      createNewFlow();
      setIsEditMode(true);
    } else if (initialMode === 'edit') {
      setIsEditMode(true);
    }
  }, [initialData, initialMode, setFlowData, createNewFlow, setIsEditMode]);

  // popstateイベントのハンドリング
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const searchParams = new URLSearchParams(window.location.search);
      const mode = searchParams.get('mode');
      const state = event.state;

      if (mode === 'new') {
        createNewFlow();
        setIsEditMode(true);
      } else if (mode === 'edit') {
        setIsEditMode(true);
      } else {
        setIsEditMode(false);
        // stateにデータが保存されている場合はそれを復元
        if (state?.flowData) {
          setFlowData(state.flowData);
        } else if (initialData) {
          setFlowData(initialData);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [createNewFlow, setIsEditMode, setFlowData, initialData]);

  // URLの更新を一元管理
  useEffect(() => {
    // 新規作成モードの判定
    const isNewMode = initialMode === 'new' || (isEditMode && flowData?.title === '新しいフロー');

    // 現在のデータをstateとして保存
    const state = flowData ? { flowData } : null;

    // URLの更新
    if (isNewMode) {
      history.pushState(state, '', '/?mode=new');
    } else if (isEditMode && sourceId) {
      history.pushState(state, '', `/${sourceId}?mode=edit`);
    } else if (isEditMode) {
      history.pushState(state, '', '/?mode=edit');
    } else if (sourceId) {
      history.pushState(state, '', `/${sourceId}`);
    } else {
      history.pushState(state, '', '/');
    }
  }, [isEditMode, sourceId, initialMode, flowData]);

  // 初期ロード完了時にローディングを解除
  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingLayout />;
  }

  if (initialMode === 'new' && !flowData) {
    createNewFlow();
    return <LoadingLayout />;
  }

  if (!flowData) {
    return <EmptyLayout />;
  }

  setTitle(flowData.title);

  const handleSave = () => {
    if (!flowData) return;

    // JSONファイルをダウンロード
    const dataStr = JSON.stringify(flowData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${flowData.title || 'flow'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // 編集モードを終了して履歴を戻る
    setIsEditMode(false);
    history.back();
  };

  const handleNew = () => {
    // 現在のデータを履歴のstateとして保存
    history.pushState({ flowData }, '', '/?mode=new');
    createNewFlow();
    setIsEditMode(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlowData({ ...flowData, title: e.target.value });
  };

  const handleAlwaysChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFlowData({ ...flowData, always: e.target.value });
  };

  return (
    <FlowLayout
      flowData={flowData}
      isEditMode={isEditMode}
      onSave={handleSave}
      onNew={handleNew}
      onTitleChange={handleTitleChange}
      onAlwaysChange={handleAlwaysChange}
    />
  );
}

function BodyLayout({ initialData = null, initialMode = 'view', sourceId }: Props) {
  useEffect(() => {
    if (initialData) {
      useFlowStore.getState().setFlowData(initialData);
    }
  }, [initialData]);

  return <BodyContent initialData={initialData} initialMode={initialMode} sourceId={sourceId ?? null} />;
}

export default BodyLayout;
