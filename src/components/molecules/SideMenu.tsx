import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/molecules/Sheet';
import { useTranslation } from 'react-i18next';
import useFlowStore from '@/stores/flowStore';
import { HamburgerMenu } from './HamburgerMenu';
import { MenuItems } from './MenuItems';
import { SettingsPanel } from './SettingsPanel';
import {
  downloadFlow,
  getDownloadFilename,
  shouldConfirmDiscard,
  showNoDataAlert,
} from '@/utils/FileOperations';

interface Props {
  onSave: () => void;
  onNew: () => void;
  onExitEditMode: () => void;
}

export function SideMenu({ onSave, onNew, onExitEditMode }: Props) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [menuView, setMenuView] = useState<'menu' | 'options'>('menu');

  const flowData = useFlowStore((state) => state.flowData);
  const originalData = useFlowStore((state) => state.originalData);
  const loadFlowFromFile = useFlowStore((state) => state.loadFlowFromFile);
  const isEditMode = useFlowStore((state) => state.isEditMode);
  const setIsEditMode = useFlowStore((state) => state.setIsEditMode);
  const cancelEdit = useFlowStore((state) => state.cancelEdit);

  const handleMenuClick = async (id: string) => {
    switch (id) {
      case 'new':
        if (isEditMode) {
          if (!shouldConfirmDiscard(isEditMode, t)) {
            break;
          }
          cancelEdit();
        }
        onNew();
        setIsOpen(false);
        break;

      case 'load':
        try {
          if (isEditMode) {
            if (!shouldConfirmDiscard(isEditMode, t)) {
              break;
            }
            cancelEdit();
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
        if (!flowData) {
          showNoDataAlert(t);
          break;
        }

        const dataToDownload = isEditMode ? originalData : flowData;
        if (!dataToDownload) {
          showNoDataAlert(t);
          break;
        }

        await downloadFlow(dataToDownload, getDownloadFilename(dataToDownload));
        break;

      case 'edit':
        if (isEditMode) {
          if (onSave) {
            onSave();
          }
        } else {
          setIsEditMode(true);
        }
        setIsOpen(false);
        break;

      case 'cancel':
        onExitEditMode();
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