import { Button } from '@/components/atoms/Button';
import {
  FileText,
  FolderOpen,
  Download,
  Edit2,
  Save,
  XCircle,
  Settings,
  HelpCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useFlowStore from '@/core/stores/flowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import type { JSX } from 'react';

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
}

interface MenuItemsProps {
  onItemClick: (_id: string) => void;
  isLoading?: boolean;
}

export function MenuItems({ onItemClick, isLoading = false }: MenuItemsProps): JSX.Element {
  const { t } = useTranslation();
  const flowData = useFlowStore((state: any) => state.flowData);
  const isEditMode = useEditModeStore((state: any) => state.isEditMode);

  const menuItems: MenuItem[] = [
    { id: 'new', label: t('newData') as string, icon: FileText },
    { id: 'load', label: t('loadData') as string, icon: FolderOpen },
    ...(flowData
      ? [
          {
            id: 'download',
            label: isEditMode ? t('downloadOriginalData') as string : t('downloadData') as string,
            icon: Download,
          },
          {
            id: 'edit',
            label: isEditMode ? t('save') as string : t('edit') as string,
            icon: isEditMode ? Save : Edit2,
          },
          ...(isEditMode ? [{ id: 'cancel', label: t('cancelEdit') as string, icon: XCircle }] : []),
        ]
      : []),
    { id: 'options', label: t('options') as string, icon: Settings },
    { id: 'help', label: t('help') as string, icon: HelpCircle },
  ];

  return (
    <div className="mt-4 flex flex-col gap-2">
      {menuItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => onItemClick(item.id)}
          disabled={(isLoading && item.id === 'load') || item.disabled}
        >
          {item.icon && <item.icon className="h-4 w-4" />}
          {item.id === 'load' && isLoading ? t('loadingFile') : item.label}
        </Button>
      ))}
    </div>
  );
}