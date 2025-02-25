import type { Language, Side, ClickType } from "@/types/types";

export interface OrganizationSettings {
  job: {
    abilities: number;
  };
  member: {
    front: number;
    back: number;
  };
  weapon: {
    main: number;
    other: number;
    additional: number;
  };
  summon: {
    main: number;
    friend: number;
    other: number;
    sub: number;
  };
}

export interface AppSettings {
  language: Language;
  buttonAlignment: Side;
  tablePadding: number; // 行動表の余白（px単位、デフォルト8px）
  actionTableClickType: ClickType; // 行動表の選択方法
}

export interface Settings {
  actionTableClickType: ClickType;
  // 他の設定項目がある場合はここに追加
}
