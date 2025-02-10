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

export const HamburgerMenuItems: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const flowData = useFlowStore((state) => state.flowData);
  const loadFlowFromFile = useFlowStore((state) => state.loadFlowFromFile);

  const [menuView, setMenuView] = useState<"menu" | "options">("menu");
  const [language, setLanguage] = useState("日本語");
  const [buttonAlignment, setButtonAlignment] = useState("右");

  const menuItems = [
    { id: "load", label: "データ読み込み" },
    { id: "download", label: "データダウンロード" },
    { id: "edit", label: "編集" },
    { id: "party", label: "編成確認" },
    { id: "info", label: "その他の情報" },
    { id: "options", label: "オプション" },
    { id: "help", label: "説明書" },
  ];

  const handleMenuClick = async (id: string) => {
    switch (id) {
      case "load":
        try {
          setIsLoading(true);
          await loadFlowFromFile();
          setIsOpen(false); // メニューを閉じる
        } catch (error) {
          console.error('ファイルの読み込みに失敗しました:', error);
        } finally {
          setIsLoading(false);
        }
        break;
      case "download":
        if (!flowData) {
          alert("ダウンロードするデータがありません。");
          break;
        }

        const json = JSON.stringify(flowData, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const filename = `${flowData.title}.json`;

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        break;
      case "edit":
        alert("編集モードに切り替えます。");
        break;
      case "party":
        alert("編成確認を開きます。");
        break;
      case "info":
        alert("その他の情報を表示します。");
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