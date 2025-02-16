import React, { useEffect } from 'react';
import { setTitle } from '@/lib/functions';
import useFlowStore from '@/stores/flowStore';
import { LoadingLayout } from './LoadingLayout';
import { EmptyLayout } from './EmptyLayout';
import { FlowLayout } from './FlowLayout';
import type { Flow, ViewMode } from '@/types/models';

// URLの管理を担当するカスタムフック
function useUrlManagement(
  isEditMode: boolean,
  sourceId: string | null | undefined,
  initialMode: ViewMode,
  flowData: Flow | null,
) {
  useEffect(() => {
    // 保存直後は履歴の更新をスキップ
    if (history.state?.isSaving) {
      return;
    }

    const isNewMode = initialMode === 'new' || (isEditMode && flowData?.title === '新しいフロー');
    const state = flowData ? { flowData } : null;

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
}

// ブラウザ履歴の管理を担当するカスタムフック
function useHistoryManagement(
  createNewFlow: () => void,
  setIsEditMode: (isEdit: boolean) => void,
  setFlowData: (data: Flow) => void,
  initialData: Flow | null,
) {
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
        // 保存時のpopstateイベントは無視
        if (!state?.isSaving) {
          setIsEditMode(false);
          if (state?.flowData) {
            setFlowData(state.flowData);
          } else if (initialData) {
            setFlowData(initialData);
          }
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [createNewFlow, setIsEditMode, setFlowData, initialData]);
}

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

  // カスタムフックの使用
  useUrlManagement(isEditMode, sourceId, initialMode, flowData);
  useHistoryManagement(createNewFlow, setIsEditMode, setFlowData, initialData);

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

    // 編集モードを終了
    setIsEditMode(false);

    // 現在のパスを取得
    const currentPath = sourceId ? `/${sourceId}` : '/';

    // 保存フラグ付きで履歴を更新
    history.replaceState({ flowData, isSaving: true }, '', currentPath);
  };

  const handleNew = () => {
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
