import React, { useEffect, useCallback, useMemo } from 'react';
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
    try {
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
    } catch (error) {
      console.error('URL更新中にエラーが発生しました:', error);
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
  const handlePopState = useCallback((event: PopStateEvent) => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const mode = searchParams.get('mode');
      const state = event.state;

      if (mode === 'new') {
        createNewFlow();
        setIsEditMode(true);
      } else if (mode === 'edit') {
        setIsEditMode(true);
      } else {
        if (!state?.isSaving) {
          setIsEditMode(false);
          if (state?.flowData) {
            setFlowData(state.flowData);
          } else if (initialData) {
            setFlowData(initialData);
          }
        }
      }
    } catch (error) {
      console.error('履歴の処理中にエラーが発生しました:', error);
    }
  }, [createNewFlow, setIsEditMode, setFlowData, initialData]);

  useEffect(() => {
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handlePopState]);
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

  // タイトルの設定
  useEffect(() => {
    if (flowData) {
      setTitle(flowData.title);
      // スクリーンリーダー用の通知
      const announcement = isEditMode ? 'フローの編集モードです' : 'フローの表示モードです';
      const ariaLive = document.createElement('div');
      ariaLive.setAttribute('role', 'status');
      ariaLive.setAttribute('aria-live', 'polite');
      ariaLive.className = 'sr-only';
      ariaLive.textContent = announcement;
      document.body.appendChild(ariaLive);
      setTimeout(() => document.body.removeChild(ariaLive), 1000);
    }
  }, [flowData, isEditMode]);

  const handleSave = useCallback(async () => {
    if (!flowData) return;

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
      const currentPath = sourceId ? `/${sourceId}` : '/';
      history.replaceState({ flowData, isSaving: true }, '', currentPath);
    } catch (error) {
      console.error('保存中にエラーが発生しました:', error);
      // エラー通知
      const errorAnnouncement = document.createElement('div');
      errorAnnouncement.setAttribute('role', 'alert');
      errorAnnouncement.className = 'sr-only';
      errorAnnouncement.textContent = '保存中にエラーが発生しました';
      document.body.appendChild(errorAnnouncement);
      setTimeout(() => document.body.removeChild(errorAnnouncement), 1000);
    }
  }, [flowData, sourceId, setIsEditMode]);

  const handleNew = useCallback(() => {
    try {
      history.pushState({ flowData }, '', '/?mode=new');
      createNewFlow();
      setIsEditMode(true);
    } catch (error) {
      console.error('新規作成中にエラーが発生しました:', error);
      const errorAnnouncement = document.createElement('div');
      errorAnnouncement.setAttribute('role', 'alert');
      errorAnnouncement.className = 'sr-only';
      errorAnnouncement.textContent = '新規作成中にエラーが発生しました';
      document.body.appendChild(errorAnnouncement);
      setTimeout(() => document.body.removeChild(errorAnnouncement), 1000);
    }
  }, [flowData, createNewFlow, setIsEditMode]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!flowData) return;
    try {
      setFlowData({
        ...flowData,
        title: e.target.value,
      });
    } catch (error) {
      console.error('タイトル更新中にエラーが発生しました:', error);
      const errorAnnouncement = document.createElement('div');
      errorAnnouncement.setAttribute('role', 'alert');
      errorAnnouncement.className = 'sr-only';
      errorAnnouncement.textContent = 'タイトル更新中にエラーが発生しました';
      document.body.appendChild(errorAnnouncement);
      setTimeout(() => document.body.removeChild(errorAnnouncement), 1000);
    }
  }, [flowData, setFlowData]);

  const handleAlwaysChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!flowData) return;
    try {
      setFlowData({
        ...flowData,
        always: e.target.value,
      });
    } catch (error) {
      console.error('常時実行項目更新中にエラーが発生しました:', error);
      const errorAnnouncement = document.createElement('div');
      errorAnnouncement.setAttribute('role', 'alert');
      errorAnnouncement.className = 'sr-only';
      errorAnnouncement.textContent = '常時実行項目更新中にエラーが発生しました';
      document.body.appendChild(errorAnnouncement);
      setTimeout(() => document.body.removeChild(errorAnnouncement), 1000);
    }
  }, [flowData, setFlowData]);

  // キーボードショートカットの処理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + S で保存
      if (e.ctrlKey && e.key === 's' && isEditMode) {
        e.preventDefault();
        handleSave();
      }
      // Ctrl + N で新規作成
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        handleNew();
      }
      // Escで編集モード終了
      if (e.key === 'Escape' && isEditMode) {
        e.preventDefault();
        setIsEditMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, handleNew, isEditMode, setIsEditMode]);

  const flowLayoutProps = useMemo(() => {
    if (!flowData) return null;
    return {
      flowData,
      isEditMode,
      onSave: handleSave,
      onNew: handleNew,
      onTitleChange: handleTitleChange,
      onAlwaysChange: handleAlwaysChange,
    };
  }, [flowData, isEditMode, handleSave, handleNew, handleTitleChange, handleAlwaysChange]);

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

  return <BodyContent initialData={initialData} initialMode={initialMode} sourceId={sourceId ?? null} />;
}

export default BodyLayout;
