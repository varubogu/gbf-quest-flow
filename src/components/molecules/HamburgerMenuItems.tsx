import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/molecules/Sheet";
import { Menu } from "lucide-react";
import useFlowStore from "@/stores/flowStore";

interface HamburgerMenuItemsProps {
  onSave?: () => void;
}

export const HamburgerMenuItems: React.FC<HamburgerMenuItemsProps> = ({ onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const flowData = useFlowStore((state) => state.flowData);
  const originalData = useFlowStore((state) => state.originalData);
  const loadFlowFromFile = useFlowStore((state) => state.loadFlowFromFile);
  const isEditMode = useFlowStore((state) => state.isEditMode);
  const setIsEditMode = useFlowStore((state) => state.setIsEditMode);
  const cancelEdit = useFlowStore((state) => state.cancelEdit);
  const createNewFlow = useFlowStore((state) => state.createNewFlow);

  const [menuView, setMenuView] = useState<"menu" | "options">("menu");
  const [language, setLanguage] = useState("日本語");
  const [buttonAlignment, setButtonAlignment] = useState("右");

  const menuItems = [
    { id: "new", label: "新しいデータを作る" },
    { id: "load", label: "データ読み込み" },
    ...(flowData ? [
      { id: "download", label: isEditMode ? "編集前のデータをダウンロード" : "データダウンロード" },
      { id: "edit", label: isEditMode ? "保存してダウンロード" : "編集" },
      ...(isEditMode ? [{ id: "cancel", label: "編集をキャンセル" }] : []),
    ] : []),
    { id: "options", label: "オプション" },
    { id: "help", label: "説明書" },
  ];

  const handleMenuClick = async (id: string) => {
    switch (id) {
      case "new":
        if (isEditMode) {
          if (!confirm("編集内容を破棄してよろしいですか？")) {
            break;
          }
          cancelEdit();
        }
        createNewFlow();
        setIsOpen(false);
        break;
      case "load":
        try {
          if (isEditMode) {
            if (!confirm("編集内容を破棄してよろしいですか？")) {
              break;
            }
            cancelEdit();
          }

          setIsLoading(true);
          await loadFlowFromFile();
        } catch (error) {
          console.error('ファイルの読み込みに失敗しました:', error);
        } finally {
          setIsLoading(false);
          setIsOpen(false); // メニューを閉じる
        }
        break;
      case "download":
        if (!flowData) {
          alert("ダウンロードするデータがありません。");
          break;
        }

        const dataToDownload = isEditMode ? originalData : flowData;
        if (!dataToDownload) {
          alert("ダウンロードするデータがありません。");
          break;
        }

        const json = JSON.stringify(dataToDownload, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const filename = `${dataToDownload.title}.json`;

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        break;
      case "edit":
        if (isEditMode) {
          if (onSave) {
            onSave();
          }
        } else {
          setIsEditMode(true);
        }
        setIsOpen(false);
        break;
      case "cancel":
        if (confirm("編集内容を破棄してよろしいですか？")) {
          cancelEdit();
          setIsOpen(false);
        }
        break;
      case "options":
        setMenuView("options");
        break;
      case "help":
        alert("説明書を表示します。");
        break;
      default:
        console.log(`未実装のID: ${id}`);
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
          <SheetTitle>
            {menuView === "menu" ? "メニュー" : "オプション"}
          </SheetTitle>
        </SheetHeader>
        {menuView === "menu" ? (
          <div className="mt-4 flex flex-col gap-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleMenuClick(item.id)}
                disabled={isLoading && item.id === "load"}
              >
                {item.id === "load" && isLoading ? "読み込み中..." : item.label}
              </Button>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => setMenuView("menu")}
            >
              ← 戻る
            </Button>
            <div className="mb-4">
              <h3 className="font-semibold">言語</h3>
              <div className="mt-2">
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name="language"
                    value="日本語"
                    checked={language === "日本語"}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="form-radio"
                  />
                  <span className="ml-2">日本語</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="language"
                    value="English"
                    checked={language === "English"}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="form-radio"
                  />
                  <span className="ml-2">English</span>
                </label>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">上下ボタンの配置</h3>
              <div className="mt-2">
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name="buttonAlignment"
                    value="右"
                    checked={buttonAlignment === "右"}
                    onChange={(e) => setButtonAlignment(e.target.value)}
                    className="form-radio"
                  />
                  <span className="ml-2">右</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="buttonAlignment"
                    value="左"
                    checked={buttonAlignment === "左"}
                    onChange={(e) => setButtonAlignment(e.target.value)}
                    className="form-radio"
                  />
                  <span className="ml-2">左</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};