import type { Language, Side, ClickType } from '@/types/types';

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

// スキル効果量の入力値のパターン("percentage": 割合(マイナス割合を含む)、"add": 加減算)
export type SkillEffectValueType = 'percentage' | 'add';

// スキル効果量の項目定義(キーはWeaponSkillEffect/WeaponSkillTotalのフィールド名。
// 表示ラベルの翻訳キーは "skill_" + key で参照する)
export interface SkillEffectFieldDefinition {
  key: string;
  type: SkillEffectValueType;
}

export interface SkillEffectSettings {
  fields: SkillEffectFieldDefinition[];
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
