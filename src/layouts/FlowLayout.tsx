import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Group, Panel, Separator } from 'react-resizable-panels';
import type { PanelImperativeHandle, PanelSize } from 'react-resizable-panels';
import { Sword, Info, Minimize2, Maximize2, Save, X } from 'lucide-react';
import { SideMenu } from '@/components/templates/common/SideMenu';
import { IconButton } from '@/components/atoms/common/IconButton';
import { IconTextButton } from '@/components/atoms/common/IconTextButton';
import { TableContainer } from '@/components/organisms/common/table/TableContainer';
import { OrganizationModal } from '@/components/templates/specific/OrganizationModal';
import { InfoModal } from '@/components/templates/specific/InfoModal';
import { Button } from '@/components/ui/button';
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

function getIsNarrow(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 767px)').matches;
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
  const [isNarrow, setIsNarrow] = useState(getIsNarrow);
  const [isMemoCollapsed, setIsMemoCollapsed] = React.useState(getIsNarrow);
  const [lastMemoSize, setLastMemoSize] = React.useState(50);
  const memoPanelRef = useRef<PanelImperativeHandle>(null);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const onChange = (): void => setIsNarrow(media.matches);
    media.addEventListener('change', onChange);
    return (): void => media.removeEventListener('change', onChange);
  }, []);

  const handleMemoResize = useCallback((panelSize: PanelSize) => {
    const size = panelSize.asPercentage;
    if (size > 0) {
      setLastMemoSize(size);
    }
    setIsMemoCollapsed(size === 0);
  }, []);

  const handleMemoToggle = useCallback(() => {
    if (!memoPanelRef.current) return;
    const targetSize = isMemoCollapsed ? lastMemoSize : 0;
    memoPanelRef.current.resize(`${targetSize}%`);
  }, [isMemoCollapsed, lastMemoSize]);

  React.useEffect(() => {
    document.title = `${flowData.title || 'Untitled Flow'} - GBF Quest Flow`;
  }, [flowData.title]);

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <header className="h-14 border-b flex items-center gap-1 sm:gap-2 px-2 sm:px-4 fixed w-full bg-background/95 backdrop-blur z-50">
        <SideMenu onSave={onSave} onNew={onNew} onExitEditMode={onExitEditMode} />
        {isEditMode ? (
          <input
            type="text"
            value={flowData.title}
            onChange={onTitleChange}
            className="ml-1 sm:ml-2 min-w-0 flex-1 text-base sm:text-lg font-medium bg-background border rounded px-2 h-9"
            aria-label={t('flowTitle') as string}
            id="flow-title-input"
            data-testid="flow-title-input"
          />
        ) : (
          <h1
            id="flow-title"
            className="ml-1 sm:ml-2 min-w-0 flex-1 text-base sm:text-lg font-medium truncate"
            data-testid="flow-title"
          >
            {flowData.title}
          </h1>
        )}
        <div className="flex gap-1 sm:gap-2 shrink-0">
          {isEditMode ? (
            <>
              <Button
                onClick={onSave}
                aria-label="保存して編集を終了"
                size="sm"
                className="min-h-11 sm:min-h-9"
              >
                <Save className="h-5 w-5" />
                <span className="hidden sm:inline">{t('save')}</span>
              </Button>
              <Button
                onClick={onExitEditMode}
                aria-label="編集をキャンセル"
                variant="secondary"
                size="sm"
                className="min-h-11 sm:min-h-9"
              >
                <X className="h-5 w-5" />
                <span className="hidden sm:inline">{t('cancel')}</span>
              </Button>
            </>
          ) : null}
          <IconTextButton
            icon={isMemoCollapsed ? Maximize2 : Minimize2}
            label={t('toggleMemo') as string}
            text={t('memo') as string}
            onClick={handleMemoToggle}
            className="min-h-11 sm:min-h-9"
          />
          <IconTextButton
            icon={Sword}
            label={t('organization') as string}
            text={t('organization') as string}
            onClick={() => setIsOrganizationModalOpen(true)}
            className="min-h-11 sm:min-h-9"
          />
          <IconButton
            icon={Info}
            label={t('otherInfo') as string}
            aria-label={t('otherInfo') as string}
            onClick={() => setIsInfoModalOpen(true)}
            className="min-h-11 min-w-11 sm:min-h-9 sm:min-w-9"
          />
        </div>
      </header>
      <main className="flex-1 pt-14">
        <div className="h-[calc(100dvh-3.5rem)]">
          <Group orientation="vertical" className="h-full w-full">
            <Panel
              panelRef={memoPanelRef}
              defaultSize={isNarrow ? '0%' : '50%'}
              minSize="0%"
              onResize={handleMemoResize}
            >
              <div className="h-full overflow-auto">
                <div className="p-3 sm:p-4 h-full">
                  {isEditMode ? (
                    <textarea
                      id="flow-memo-input"
                      aria-label={t('memo') as string}
                      value={flowData.always}
                      onChange={onAlwaysChange}
                      className="w-full h-full p-2 bg-background border rounded resize-none"
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
            <Separator className="h-2 bg-border hover:bg-muted-foreground/40 transition-colors cursor-row-resize" />
            <Panel defaultSize={isNarrow ? '100%' : '50%'} minSize="20%">
              <div className="h-full overflow-hidden">
                <TableContainer data={flowData.flow} isEditMode={isEditMode} />
              </div>
            </Panel>
          </Group>
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
