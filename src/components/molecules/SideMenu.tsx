import { useState, type JSX } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/molecules/Sheet';
import { useTranslation } from 'react-i18next';
import useFlowStore from '@/core/stores/flowStore';
import { HamburgerMenu } from './HamburgerMenu';
import { MenuItems } from './MenuItems';
import { SettingsPanel } from './SettingsPanel';
import {
  downloadFlow,
  getDownloadFilename,
  showNoDataAlert,
} from '@/lib/utils/FileOperations';
import { useFlowDataModification } from '@/core/hooks/domain/flow/useFlowDataModification';
import { useEditHistory } from '@/core/hooks/domain/flow/useEditHistory';
import type { Flow, MenuView } from '@/types/types';

interface Props {
  onSave: () => void;
  onNew: () => void;
  onExitEditMode: () => void;
}

export function SideMenu({ onSave, onNew, onExitEditMode }: Props): JSX.Element {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [menuView, setMenuView] = useState<MenuView>('menu');

  const flowData = useFlowStore((state) => state.flowData);
  const originalData = useFlowStore((state) => state.originalData);
  const loadFlowFromFile = useFlowStore((state) => state.loadFlowFromFile);
  const isEditMode = useFlowStore((state) => state.isEditMode);
  const setIsEditMode = useFlowStore((state) => state.setIsEditMode);

  const { hasChanges } = useEditHistory(flowData);

  const { handleSave, handleCancel, handleNew } = useFlowDataModification({
    flowData,
    recordChange: () => {}, // サイドメニューでは変更記録は不要
    hasChanges,
  });

  const handleMenuClick = async (id: string): Promise<void> => {
    switch (id) {
      case 'new':
        if (await handleNew()) {
          onNew();
        }
        setIsOpen(false);
        break;

      case 'load':
        try {
          if (isEditMode) {
            const cancelled = !await handleCancel();
            if (cancelled) break;
          }

          setIsLoading(true);
          await loadFlowFromFile();
        } catch (error) {
          console.error(t('failedToLoadFile'), error);
        } finally {
          setIsLoading(false);
          setIsOpen(false);
        }
        break;

      case 'download':
        { if (!flowData) {
          showNoDataAlert(t);
          break;
        }

        const dataToDownload: Flow | null = isEditMode ? originalData : flowData;
        if (!dataToDownload) {
          showNoDataAlert(t);
          break;
        }

        await downloadFlow(dataToDownload, getDownloadFilename(dataToDownload));
        break; }

      case 'edit':
        if (isEditMode) {
          const success = await handleSave();
          if (success) {
            onSave();
          }
        } else {
          setIsEditMode(true);
        }
        setIsOpen(false);
        break;

      case 'cancel':
        if (await handleCancel()) {
          onExitEditMode();
        }
        setIsOpen(false);
        break;

      case 'options':
        setMenuView('options');
        break;

      case 'help':
        alert(t('showHelp'));
        break;

      default:
        break;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <HamburgerMenu onClick={() => setIsOpen(true)} />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>{menuView === 'menu' ? t('menu') : t('options')}</SheetTitle>
        </SheetHeader>
        {menuView === 'menu' ? (
          <MenuItems onItemClick={handleMenuClick} isLoading={isLoading} />
        ) : (
          <SettingsPanel onBack={() => setMenuView('menu')} />
        )}
      </SheetContent>
    </Sheet>
  );
}