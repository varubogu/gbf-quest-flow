import React, { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/molecules/Sheet';
import {
  Menu,
  FileText,
  FolderOpen,
  Download,
  Edit2,
  Save,
  XCircle,
  Settings,
  HelpCircle,
} from 'lucide-react';
import useFlowStore from '@/stores/flowStore';
import useSettingsStore from '@/stores/settingsStore';
import { useTranslation } from 'react-i18next';

interface Props {
  onSave: () => void;
  onNew: () => void;
}

export function HamburgerMenuItems({ onSave, onNew }: Props) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const flowData = useFlowStore((state) => state.flowData);
  const originalData = useFlowStore((state) => state.originalData);
  const loadFlowFromFile = useFlowStore((state) => state.loadFlowFromFile);
  const isEditMode = useFlowStore((state) => state.isEditMode);
  const setIsEditMode = useFlowStore((state) => state.setIsEditMode);
  const cancelEdit = useFlowStore((state) => state.cancelEdit);
  const createNewFlow = useFlowStore((state) => state.createNewFlow);
  const { history } = useFlowStore();

  const [menuView, setMenuView] = useState<'menu' | 'options'>('menu');
  const { settings, updateSettings } = useSettingsStore();

  const menuItems = [
    { id: 'new', label: t('newData'), icon: FileText },
    { id: 'load', label: t('loadData'), icon: FolderOpen },
    ...(flowData
      ? [
          {
            id: 'download',
            label: isEditMode ? t('downloadOriginalData') : t('downloadData'),
            icon: Download,
          },
          {
            id: 'edit',
            label: isEditMode ? t('save') : t('edit'),
            icon: isEditMode ? Save : Edit2,
          },
          ...(isEditMode ? [{ id: 'cancel', label: t('cancelEdit'), icon: XCircle }] : []),
        ]
      : []),
    { id: 'options', label: t('options'), icon: Settings },
    { id: 'help', label: t('help'), icon: HelpCircle },
  ];

  const handleMenuClick = async (id: string) => {
    switch (id) {
      case 'new':
        if (isEditMode) {
          if (!confirm(t('confirmDiscardChanges'))) {
            break;
          }
          cancelEdit();
        }
        createNewFlow();
        setIsOpen(false);
        break;
      case 'load':
        try {
          if (isEditMode) {
            if (!confirm(t('confirmDiscardChanges'))) {
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
          alert(t('noDataToDownload'));
          break;
        }

        const dataToDownload = isEditMode ? originalData : flowData;
        if (!dataToDownload) {
          alert(t('noDataToDownload'));
          break;
        }

        const json = JSON.stringify(dataToDownload, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const filename = `${dataToDownload.title}.json`;

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
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
        if (history.past.length > 0) {
          if (!confirm(t('confirmDiscardChanges'))) {
            break;
          }
        }
        cancelEdit();
        setIsOpen(false);
        break;
      case 'options':
        setMenuView('options');
        break;
      case 'help':
        alert(t('showHelp'));
        break;
      default:
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>{menuView === 'menu' ? t('menu') : t('options')}</SheetTitle>
        </SheetHeader>
        {menuView === 'menu' ? (
          <div className="mt-4 flex flex-col gap-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => handleMenuClick(item.id)}
                disabled={isLoading && item.id === 'load'}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.id === 'load' && isLoading ? t('loadingFile') : item.label}
              </Button>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <Button variant="ghost" className="mb-4 gap-2" onClick={() => setMenuView('menu')}>
              <Menu className="h-4 w-4" />← {t('back')}
            </Button>
            <div className="mb-4">
              <h3 className="font-semibold">{t('language')}</h3>
              <div className="mt-2">
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name="language"
                    value="日本語"
                    checked={settings.language === '日本語'}
                    onChange={(e) =>
                      updateSettings({ language: e.target.value as '日本語' | 'English' })
                    }
                    className="form-radio"
                  />
                  <span className="ml-2">{t('japanese')}</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="language"
                    value="English"
                    checked={settings.language === 'English'}
                    onChange={(e) =>
                      updateSettings({ language: e.target.value as '日本語' | 'English' })
                    }
                    className="form-radio"
                  />
                  <span className="ml-2">{t('english')}</span>
                </label>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">{t('buttonAlignment')}</h3>
              <div className="mt-2">
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name="buttonAlignment"
                    value="左"
                    checked={settings.buttonAlignment === '左'}
                    onChange={(e) =>
                      updateSettings({ buttonAlignment: e.target.value as '右' | '左' })
                    }
                    className="form-radio"
                  />
                  <span className="ml-2">{t('left')}</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="buttonAlignment"
                    value="右"
                    checked={settings.buttonAlignment === '右'}
                    onChange={(e) =>
                      updateSettings({ buttonAlignment: e.target.value as '右' | '左' })
                    }
                    className="form-radio"
                  />
                  <span className="ml-2">{t('right')}</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
