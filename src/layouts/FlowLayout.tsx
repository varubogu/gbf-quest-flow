import React, { useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import type { ImperativePanelHandle } from 'react-resizable-panels';
import { Sword, Info, Minimize2, Maximize2, Save, X } from 'lucide-react';
import { SideMenu } from '@/components/molecules/SideMenu';
import { IconButton } from '@/components/atoms/common/IconButton';
import { IconTextButton } from '@/components/atoms/common/IconTextButton';
import { TableContainer } from '@/components/organisms/TableContainer';
import { OrganizationModal } from '@/components/organisms/OrganizationModal';
import { InfoModal } from '@/components/organisms/InfoModal';
import { Button } from '@/components/atoms/common/Button';
import type { Flow } from '@/types/models';

interface Props {
  flowData: Flow;
  isEditMode: boolean;
  onSave: () => Promise<boolean>;
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
}: Props): React.ReactElement {
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

  // タイトルの変更を監視
  React.useEffect(() => {
    document.title = `${flowData.title || 'Untitled Flow'} - GBF Quest Flow`;
  }, [flowData.title]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="h-14 border-b flex items-center px-4 fixed w-full bg-background z-50">
        <SideMenu onSave={onSave} onNew={onNew} onExitEditMode={onExitEditMode} />
        {isEditMode ? (
          <input
            type="text"
            value={flowData.title}
            onChange={onTitleChange}
            className="ml-4 flex-1 text-lg font-medium bg-white border rounded px-2"
            aria-label={t('flowTitle') as string}
            id="flow-title-input"
            data-testid="flow-title-input"
          />
        ) : (
          <h1 id="flow-title" className="ml-4 flex-1 text-lg font-medium" data-testid="flow-title">{flowData.title}</h1>
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
            label={t('toggleMemo') as string}
            text={t('memo') as string}
            onClick={handleMemoToggle}
          />
          <IconTextButton
            icon={Sword}
            label={t('organization') as string}
            text={t('organization') as string}
            onClick={() => setIsOrganizationModalOpen(true)}
          />
          <IconButton
           icon={Info}
           label={t('otherInfo') as string}
           aria-label={t('otherInfo') as string}
           onClick={() => setIsInfoModalOpen(true)}
          />
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
                      id="flow-memo-input"
                      aria-label={t('memo') as string}
                      value={flowData.always}
                      onChange={onAlwaysChange}
                      className="w-full h-full p-2 bg-white border rounded resize-none"
                      data-testid="flow-memo-input"
                    />
                  ) : (
                    <pre
                      id="flow-memo"
                      aria-label={t('memo') as string}
                      aria-readonly
                      className="whitespace-pre-wrap h-full"
                      data-testid="flow-memo"
                    >
                      {flowData.always}
                    </pre>
                  )}
                </div>
              </div>
            </Panel>
            <PanelResizeHandle className="h-2 bg-gray-300 hover:bg-gray-400 transition-colors cursor-row-resize" />
            <Panel defaultSize={50} minSize={10}>
              <div className="h-full overflow-auto">
                <TableContainer data={flowData.flow} isEditMode={isEditMode} />
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
