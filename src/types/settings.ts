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
  language: '日本語' | 'English';
  buttonAlignment: '左' | '右';
  tablePadding: number; // 行動表の余白（px単位、デフォルト8px）
  actionTableClickType: 'single' | 'double'; // 行動表の選択方法
}

export interface Settings {
  actionTableClickType: 'single' | 'double';
  // 他の設定項目がある場合はここに追加
}
