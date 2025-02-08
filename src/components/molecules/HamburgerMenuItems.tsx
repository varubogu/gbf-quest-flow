import { Button } from "@/components/atoms/Button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/molecules/Sheet";
import { Menu } from "lucide-react";

export const HamburgerMenuItems = () => {
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
    // TODO: 各メニュー項目のアクション実装
    console.log(`Clicked: ${id}`);
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