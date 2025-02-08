import React, { createContext, useContext, useState, useEffect } from "react";
import ReactDOM from "react-dom";

// Sheet の状態管理用のコンテキストを作成
interface SheetContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SheetContext = createContext<SheetContextValue | undefined>(undefined);

// Sheet コンポーネントは、Sheet 内の状態を管理するためにコンテキストを提供します
export const Sheet = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
};

// SheetTrigger は、子要素のクリックで Sheet の表示をトグルします
export const SheetTrigger = ({
  asChild,
  children,
}: {
  asChild?: boolean;
  children: React.ReactElement;
}) => {
  const context = useContext(SheetContext);
  if (!context) throw new Error("SheetTrigger must be used within a Sheet");

  const handleClick = () => {
    context.setOpen(true);
  };

  if (asChild) {
    return React.cloneElement(children, {
      onClick: handleClick,
    });
  }

  return <button onClick={handleClick}>{children}</button>;
};

// SheetContent は、Sheetが開いているときに表示されるコンテンツです（オーバーレイとアニメーション付き）
export const SheetContent = ({
  side = "left",
  children,
}: {
  side?: "left" | "right";
  children: React.ReactNode;
}) => {
  const context = useContext(SheetContext);
  if (!context) throw new Error("SheetContent must be used within a Sheet");

  const closeSheet = () => context.setOpen(false);

  // アニメーションのため、visibility と animateIn 状態を管理
  const [isVisible, setIsVisible] = useState(context.open);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (context.open) {
      setIsVisible(true);
      const timer = setTimeout(() => setAnimateIn(true), 20); // 20ms の遅延で開くアニメーションを発動
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => setIsVisible(false), 300); // 300ms は閉じるアニメーションの期間
      return () => clearTimeout(timer);
    }
  }, [context.open]);

  if (!isVisible) return null;

  // オーバーレイのクラス（背景を暗くするアニメーション付き）
  const overlayClasses = `fixed inset-0 bg-black z-40 transition-opacity duration-300 ease-out ${
    context.open ? "opacity-50" : "opacity-0"
  }`;

  // サイドからのスライドインアニメーション
  const sheetClasses = `fixed top-0 ${side}-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-out ${
    animateIn
      ? "translate-x-0"
      : side === "left"
      ? "-translate-x-full"
      : "translate-x-full"
  }`;

  return ReactDOM.createPortal(
    <>
      <div className={overlayClasses} onClick={closeSheet} />
      <div className={sheetClasses}>
        <div className="p-4">
          <button onClick={closeSheet} className="mb-4">
            閉じる
          </button>
          {children}
        </div>
      </div>
    </>,
    document.body
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