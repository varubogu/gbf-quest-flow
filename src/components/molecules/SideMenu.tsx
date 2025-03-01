import { useState, type JSX } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/molecules/Sheet';
import { useTranslation } from 'react-i18next';
import useBaseFlowStore from '@/core/stores/baseFlowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import useFileOperationsFacade from '@/core/facades/fileOperationsFacade';
import { HamburgerMenu } from './HamburgerMenu';
import { MenuItems } from './MenuItems';
import { SettingsPanel } from './SettingsPanel';
import {
  downloadFlow,
  getDownloadFilename,
  showNoDataAlert,
} from '@/core/facades/FileOperations';
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

  // 型アサーションを使用して型エラーを回避
  const flowData = useBaseFlowStore((state: any) => state.flowData);
  const originalData = useBaseFlowStore((state: any) => state.originalData);
  const loadFlowFromFile = useFileOperationsFacade((state: any) => state.loadFlowFromFile);
  const isEditMode = useEditModeStore((state: any) => state.isEditMode);
  const setIsEditMode = useEditModeStore((state: any) => state.setIsEditMode);

  const { hasChanges } = useEditHistory(flowData);

  const { handleSave, handleCancel, handleNew } = useFlowDataModification({
    flowData,
    recordChange: () => {}, // サイドメニューでは変更記録は不要
    hasChanges,
  });

  const handleMenuClick = async (id: string): Promise<void> => {
    switch (id) {
      case 'new':
        console.log('SideMenu: 新規フロー作成を開始します');
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

          console.log('SideMenu: ファイル読み込みを開始します');
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
          console.log('SideMenu: フローの保存を開始します');
          const success = await handleSave();
          if (success) {
            onSave();
          }
        } else {
          console.log('SideMenu: 編集モードを開始します');
          setIsEditMode(true);
        }
        setIsOpen(false);
        break;

      case 'cancel':
        console.log('SideMenu: 編集をキャンセルします');
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

  console.log('SideMenu: レンダリングします', 'isEditMode:', isEditMode);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <HamburgerMenu onClick={() => setIsOpen(true)} />
      </SheetTrigger>
      <SheetContent side="left" width="w-[300px] sm:w-[400px]">
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