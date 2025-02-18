import React, { useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import type { ImperativePanelHandle } from 'react-resizable-panels';
import { Sword, Info, Minimize2, Maximize2, Save, X } from 'lucide-react';
import { HamburgerMenuItems } from '@/components/molecules/HamburgerMenuItems';
import { IconButton } from '@/components/atoms/IconButton';
import { IconTextButton } from '@/components/atoms/IconTextButton';
import { ActionTableContainer } from '@/components/organisms/ActionTableContainer';
import { OrganizationModal } from '@/components/organisms/OrganizationModal';
import { InfoModal } from '@/components/organisms/InfoModal';
import { Button } from '@/components/atoms/Button';
import type { Flow } from '@/types/models';

interface Props {
  flowData: Flow;
  isEditMode: boolean;
  onSave: () => void;
  onNew: () => void;
  onTitleChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  onAlwaysChange: (_e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onExitEditMode: () => void;
}

export function FlowLayout({
  flowData,
  isEditMode,
  onSave,
  onNew,
  onTitleChange,
  onAlwaysChange,
  onExitEditMode,
}: Props) {
  const { t } = useTranslation();
  const [isOrganizationModalOpen, setIsOrganizationModalOpen] = React.useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = React.useState(false);
  const [isMemoCollapsed, setIsMemoCollapsed] = React.useState(false);
  const [lastMemoSize, setLastMemoSize] = React.useState(50);
  const memoPanelRef = useRef<ImperativePanelHandle>(null);

  const handleMemoResize = useCallback((size: number) => {
    if (size > 0) {
      setLastMemoSize(size);
    }
    setIsMemoCollapsed(size === 0);
  }, []);

  const handleMemoToggle = useCallback(() => {
    if (!memoPanelRef.current) return;
    const targetSize = isMemoCollapsed ? lastMemoSize : 0;
    memoPanelRef.current.resize(targetSize);
  }, [isMemoCollapsed, lastMemoSize]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="h-14 border-b flex items-center px-4 fixed w-full bg-background z-50">
        <HamburgerMenuItems onSave={onSave} onNew={onNew} />
        {isEditMode ? (
          <input
            type="text"
            value={flowData.title}
            onChange={onTitleChange}
            className="ml-4 flex-1 text-lg font-medium bg-white border rounded px-2"
          />
        ) : (
          <h1 className="ml-4 flex-1 text-lg font-medium">{flowData.title}</h1>
        )}
        <div className="flex gap-2">
          {isEditMode ? (
            <>
              <Button onClick={onSave} aria-label="保存して編集を終了">
                <Save className="h-5 w-5" />
                <span>保存</span>
              </Button>
              <Button onClick={onExitEditMode} aria-label="編集をキャンセル" variant="secondary">
                <X className="h-5 w-5" />
                <span>キャンセル</span>
              </Button>
            </>
          ) : null}
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
          <IconButton icon={Info} label={t('otherInfo')} onClick={() => setIsInfoModalOpen(true)} />
        </div>
      </header>
      <main className="flex-1 pt-14">
        <div className="h-[calc(100vh-3.5rem)]">
          <PanelGroup direction="vertical">
            <Panel ref={memoPanelRef} defaultSize={50} minSize={0} onResize={handleMemoResize}>
              <div className="h-full overflow-auto">
                <div className="p-4 h-full">
                  {isEditMode ? (
                    <textarea
                      value={flowData.always}
                      onChange={onAlwaysChange}
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
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </div>
  );
}
