import React, { useState, useRef, useCallback, useEffect } from 'react';
import { HamburgerMenuItems } from '@/components/molecules/HamburgerMenuItems';
import { ActionTableContainer } from '@/components/organisms/ActionTableContainer';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import type { ImperativePanelHandle } from 'react-resizable-panels';
import useFlowStore from '@/stores/flowStore';
import { LoadFlowButton } from '@/components/molecules/LoadFlowButton';
import { CreateFlowButton } from '@/components/molecules/CreateFlowButton';
import { loadSlugData, setTitle } from '@/lib/functions';
import { Sword, Info, Minimize2, Maximize2 } from 'lucide-react';
import { IconButton } from '@/components/atoms/IconButton';
import { IconTextButton } from '@/components/atoms/IconTextButton';
import { OrganizationModal } from '@/components/organisms/OrganizationModal';
import { InfoModal } from '@/components/organisms/InfoModal';
import I18nProvider from '@/components/I18nProvider';
import { useTranslation } from 'react-i18next';
import { ErrorDialog } from "@/components/organisms/ErrorDialog";
import type { Flow } from '@/types/models';

interface Props {
  initialData?: Flow;
}

function FlowContent({ initialData }: Props) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isOrganizationModalOpen, setIsOrganizationModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isMemoCollapsed, setIsMemoCollapsed] = useState(false);
  const [lastMemoSize, setLastMemoSize] = useState(50);
  const memoPanelRef = useRef<ImperativePanelHandle>(null);
  const flowData = useFlowStore((state) => state.flowData);
  const isEditMode = useFlowStore((state) => state.isEditMode);
  const setIsEditMode = useFlowStore((state) => state.setIsEditMode);
  const setFlowData = useFlowStore((state) => state.setFlowData);
  const createNewFlow = useFlowStore((state) => state.createNewFlow);

  useEffect(() => {
    if (initialData) {
      setFlowData(initialData);
    }
  }, [initialData, setFlowData]);

  // 初期ロード完了時にローディングを解除
  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  // パネルのリサイズ時のコールバック
  const handleMemoResize = useCallback((size: number) => {
    if (size > 0) {
      setLastMemoSize(size);
    }
    setIsMemoCollapsed(size === 0);
  }, []);

  // メモ開閉ボタンのクリックハンドラ
  const handleMemoToggle = useCallback(() => {
    if (!memoPanelRef.current) return;

    const targetSize = isMemoCollapsed ? lastMemoSize : 0;
    memoPanelRef.current.resize(targetSize);
  }, [isMemoCollapsed, lastMemoSize]);

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

    // 編集モードを終了
    setIsEditMode(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{t('loading')}</div>
      </div>
    );
  }

  if (!flowData) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('d')) {
      const slug = urlParams.get('d');
      if (slug) {
        loadSlugData(slug);
      }
    }
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <div className="text-lg mb-4">{t('noDataLoaded')}</div>
        <div className="flex gap-4">
          <CreateFlowButton />
          <LoadFlowButton />
        </div>
      </div>
    );
  }

  setTitle(flowData.title);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlowData({ ...flowData, title: e.target.value });
  };

  const handleAlwaysChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFlowData({ ...flowData, always: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="h-14 border-b flex items-center px-4 fixed w-full bg-background z-50">
        <HamburgerMenuItems onSave={handleSave} />
        {isEditMode ? (
          <input
            type="text"
            value={flowData.title}
            onChange={handleTitleChange}
            className="ml-4 flex-1 text-lg font-medium bg-white border rounded px-2"
          />
        ) : (
          <h1 className="ml-4 flex-1 text-lg font-medium">{flowData.title}</h1>
        )}
        <div className="flex gap-2">
          <IconTextButton
            icon={isMemoCollapsed ? Maximize2 : Minimize2}
            label={t('toggleMemo')}
            text={t('memo')}
            onClick={handleMemoToggle}
          />
          <IconTextButton
            icon={Sword}
            label={t('organization')}
            text={t('organization')}
            onClick={() => setIsOrganizationModalOpen(true)}
          />
          <IconButton
            icon={Info}
            label={t('otherInfo')}
            onClick={() => setIsInfoModalOpen(true)}
          />
        </div>
      </header>
      <main className="flex-1 pt-14">
        <div className="h-[calc(100vh-3.5rem)]">
          <PanelGroup direction="vertical">
            <Panel
              ref={memoPanelRef}
              defaultSize={50}
              minSize={0}
              onResize={handleMemoResize}
            >
              <div className="h-full overflow-auto">
                <div className="p-4 h-full">
                  {isEditMode ? (
                    <textarea
                      value={flowData.always}
                      onChange={handleAlwaysChange}
                      className="w-full h-full p-2 bg-white border rounded resize-none"
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap h-full">{flowData.always}</pre>
                  )}
                </div>
              </div>
            </Panel>
            <PanelResizeHandle className="h-2 bg-gray-300 hover:bg-gray-400 transition-colors cursor-row-resize" />
            <Panel defaultSize={50} minSize={10}>
              <div className="h-full overflow-auto">
                <ActionTableContainer data={flowData.flow} isEditMode={isEditMode} />
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </main>
      <OrganizationModal
        isOpen={isOrganizationModalOpen}
        onClose={() => setIsOrganizationModalOpen(false)}
      />
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
      <ErrorDialog />
    </div>
  );
}

function FlowBodyLayoutReact({ initialData }: Props) {
  useEffect(() => {
    if (initialData) {
      useFlowStore.getState().setFlowData(initialData);
    }
  }, [initialData]);

  return (
    <I18nProvider>
      <FlowContent initialData={initialData} />
    </I18nProvider>
  );
}

export default FlowBodyLayoutReact;