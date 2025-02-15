import React, { useEffect } from 'react';
import { setTitle } from '@/lib/functions';
import useFlowStore from '@/stores/flowStore';
import { LoadingLayout } from './LoadingLayout';
import { EmptyLayout } from './EmptyLayout';
import { FlowLayout } from './FlowLayout';
import type { Flow } from '@/types/models';

interface Props {
  initialData?: Flow;
  initialMode?: 'view' | 'edit' | 'new';
  sourceId?: string;
}

function FlowContent({ initialData, initialMode = 'view', sourceId }: Props) {
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
      const path = window.location.pathname;
      if (path === '/new') {
        createNewFlow();
        setIsEditMode(true);
      } else if (path.startsWith('/edit/')) {
        setIsEditMode(true);
      } else {
        setIsEditMode(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [createNewFlow]);

  // 初期ロード完了時にローディングを解除
  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
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

    // 編集モードを終了して適切なページに遷移
    setIsEditMode(false);
    const newPath = sourceId ? `/view/${sourceId}` : '/view';
    history.pushState(null, '', newPath);
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
      onTitleChange={handleTitleChange}
      onAlwaysChange={handleAlwaysChange}
    />
  );
}

function FlowBodyLayoutReact({ initialData, initialMode = 'view', sourceId }: Props) {
  useEffect(() => {
    if (initialData) {
      useFlowStore.getState().setFlowData(initialData);
    }
  }, [initialData]);

  return <FlowContent initialData={initialData} initialMode={initialMode} sourceId={sourceId} />;
}

export default FlowBodyLayoutReact;