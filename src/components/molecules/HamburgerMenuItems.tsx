import React, { useRef } from "react";
import { Button } from "@/components/atoms/Button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/molecules/Sheet";
import { Menu } from "lucide-react";
import type { Action, Flow } from "@/types/models";


interface HamburgerMenuItemsProps {
  data?: Flow;
}

export const HamburgerMenuItems: React.FC<HamburgerMenuItemsProps> = ({ data }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuItems = [
    { id: "load", label: "データ読み込み" },
    { id: "download", label: "データダウンロード" },
    { id: "edit", label: "編集" },
    { id: "party", label: "編成確認" },
    { id: "info", label: "その他の情報" },
    { id: "options", label: "オプション" },
    { id: "help", label: "説明書" },
  ];

  const handleMenuClick = (id: string) => {
    switch (id) {
      case "load":
        fileInputRef.current?.click();
        break;
      case "download":
        if (!data) {
          alert("ダウンロードするデータがありません。");
          break;
        }

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const filename = `${data.title}.json`;

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
        alert("オプションを開きます。");
        break;
      case "help":
        alert("説明書を表示します。");
        break;
      default:
        console.log(`未実装のID: ${id}`);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      alert(`ファイル "${file.name}" が選択されました。`);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>メニュー</SheetTitle>
        </SheetHeader>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="mt-4 flex flex-col gap-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleMenuClick(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};