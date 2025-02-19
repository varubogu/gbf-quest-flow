import React, { createContext, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSheetAnimation } from '@/hooks/useSheetAnimation';

// Sheet の状態管理用のコンテキストを作成
interface SheetContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SheetContext = createContext<SheetContextValue | undefined>(undefined);

// Sheet コンポーネントは、Sheet 内の状態を管理するためにコンテキストを提供します
interface SheetProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (_open: boolean) => void;
}

export const Sheet: React.FC<SheetProps> = ({ children, open: controlledOpen, onOpenChange }) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  // React.Dispatch<React.SetStateAction<boolean>> に準拠するように、関数型更新もサポート
  const setOpen: React.Dispatch<React.SetStateAction<boolean>> = (value) => {
    const newValue =
      typeof value === 'function' ? (value as (_prev: boolean) => boolean)(open) : value;
    if (!isControlled) {
      setUncontrolledOpen(newValue);
    }
    onOpenChange?.(newValue);
  };

  return <SheetContext.Provider value={{ open, setOpen }}>{children}</SheetContext.Provider>;
};

// SheetTrigger は、子要素のクリックで Sheet の表示をトグルします
export const SheetTrigger = ({
  asChild,
  children,
}: {
  asChild?: boolean;
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
}) => {
  const context = useContext(SheetContext);
  if (!context) throw new Error('SheetTrigger must be used within a Sheet');

  const handleClick = () => {
    context.setOpen(true);
  };

  if (asChild) {
    return React.cloneElement(children, {
      onClick: handleClick,
      'aria-expanded': context.open,
    });
  }

  return <button onClick={handleClick}>{children}</button>;
};

// SheetContent は、Sheetが開いているときに表示されるコンテンツです
export const SheetContent = ({
  side = 'left',
  children,
}: {
  side?: 'left' | 'right';
  children: React.ReactNode;
}) => {
  const { t } = useTranslation();
  const context = useContext(SheetContext);
  if (!context) throw new Error('SheetContent must be used within a Sheet');

  const { isVisible, overlayClasses, sheetClasses } = useSheetAnimation({
    open: context.open,
    side,
  });

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className={overlayClasses} onClick={() => context.setOpen(false)} />
      <div className={sheetClasses}>
        <div className="p-4">
          <button onClick={() => context.setOpen(false)} className="mb-4">
            {t('close')}
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

// SheetHeader はコンテンツ上部のヘッダー部分
export const SheetHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="border-b pb-2 mb-2">{children}</div>;
};

// SheetTitle はタイトル部分
export const SheetTitle = ({ children }: { children: React.ReactNode }) => {
  return <h3 className="text-lg font-bold">{children}</h3>;
};
