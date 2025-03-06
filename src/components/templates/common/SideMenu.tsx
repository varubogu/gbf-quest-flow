import { useState, type JSX } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/organisms/common/Sheet';
import { useTranslation } from 'react-i18next';
import useFlowStore from '@/core/stores/flowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import { setIsEditMode } from '@/core/facades/editModeStoreFacade';
import { loadFlowFromFile } from '@/core/facades/fileOperationFacade';
import { HamburgerMenu } from '../../molecules/common/HamburgerMenu';
import { MenuItems } from '../../molecules/common/MenuItems';
import { SettingsPanel } from '../../organisms/specific/settings/SettingsPanel';
import {
  downloadFlow,
  getDownloadFilename,
  showNoDataAlert,
} from '@/core/facades/fileOperationFacade';
import { useFlowDataModification } from '@/core/hooks/domain/flow/useFlowDataModification';
import { useEditHistory } from '@/core/hooks/domain/flow/useEditHistory';
import type { Flow, MenuView } from '@/types/types';
import type { FlowStore, EditModeStore } from '@/types/flowStore.types';

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

  // 型アサーションを使用して型エラーを回避
  const flowData = useFlowStore((state: FlowStore) => state.flowData);
  const originalData = useFlowStore((state: FlowStore) => state.originalData);
  const isEditMode = useEditModeStore((state: EditModeStore) => state.isEditMode);

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
          setIsLoading(false);
        } catch (error) {
          console.error(t('failedToLoadFile'), error);
          setIsLoading(false);
        } finally {
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
      <SheetContent side="left" className="w-[150px] sm:w-[250px]">
        <SheetHeader>
          <SheetTitle>{menuView === 'menu' ? t('menu') : t('options')}</SheetTitle>
        </SheetHeader>
        {menuView === 'menu' ? (
          <MenuItems
            isLoading={isLoading}
            onItemClick={handleMenuClick}
          />
        ) : (
          <SettingsPanel onBack={() => setMenuView('menu')} />
        )}
      </SheetContent>
    </Sheet>
  );
}