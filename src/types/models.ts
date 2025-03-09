import { z } from 'astro:content';

// 画面のモード
export type ViewMode = 'unloaded' | 'view' | 'edit' | 'new';

// アクションテーブルのカラム定義
export type ActionTableColumn = keyof Action;

// アクションテーブルの表示モード
export type ActionTableMode = 'view' | 'edit';

// 基本的な左右の位置を表す型
export type Side = 'left' | 'right';

// アクションテーブルのボタン位置
export type ActionTableButtonPosition = Side;

// アクションテーブルの行選択イベントハンドラ
export type ActionTableRowSelectHandler = (_index: number) => void;

// アクションテーブルのセル編集イベントハンドラ
export type ActionTableCellEditHandler = (
  _rowIndex: number,
  _field: ActionTableColumn,
  _value: string
) => void;

// アクションテーブルのセルの表示位置
export type TableAlignment = 'left' | 'center' | 'right';

// アクションテーブルのカラム設定
export type ActionTableColumnConfig = {
  [_K in ActionTableColumn]: ActionTableCellConfig;
};

// UI関連の型定義
export type MenuView = 'menu' | 'options';
export type ButtonVariant = 'default' | 'ghost';
export type TextVariant = 'default' | 'muted' | 'dimmed';
export type IconPosition = Side;
export type ClickType = 'single' | 'double';

// データ構造関連の型定義
export type WeaponType = 'main' | 'other' | 'additional';
export type SummonType = 'main' | 'friend' | 'other' | 'sub';
export type CharacterPosition = 'front' | 'back';

// アクセシビリティ関連の型定義
export type AnnouncementType = 'status' | 'alert';

// 設定関連の型定義
export type Language = '日本語' | 'English';
export type ButtonAlignment = 'left' | 'right';


// キャラクター/武器/召喚石の共通項目のスキーマ
const itemBaseSchema = z.object({
  key: z.string(),
  name: z.string(),
  note: z.string(),
});

// ジョブのスキーマ
const jobAbilitySchema = z.object({
  key: z.string(),
  name: z.string(),
  note: z.string(),
});

const jobEquipmentSchema = z.object({
  name: z.string(),
  note: z.string(),
});

const jobSchema = z.object({
  key: z.string(),
  name: z.string(),
  note: z.string(),
  equipment: jobEquipmentSchema,
  abilities: z.array(jobAbilitySchema),
});

// 編成メンバーのスキーマ
const memberSchema = itemBaseSchema.extend({
  key: z.string(),
  awaketype: z.string(),
  accessories: z.string(),
  limitBonus: z.string(),
});

// 武器のスキル効果量のスキーマ
const weaponSkillEffectSchema = z.object({
  key: z.string(),
  taRate: z.string(),
  hp: z.string(),
  defense: z.string(),
});

// 武器のスキル総合値のスキーマ
const weaponSkillTotalSchema = z.object({
  key: z.string(),
  taRate: z.string(),
  hp: z.string(),
  defense: z.string(),
});

const weaponSchema = itemBaseSchema.extend({
  key: z.string(),
  additionalSkill: z.string(),
});

const summonSchema = itemBaseSchema.extend({});

const abilitySchema = itemBaseSchema.extend({});
// 編成情報のスキーマ
const organizationSchema = z.object({
  job: jobSchema,
  member: z.object({
    front: z.array(memberSchema),
    back: z.array(memberSchema),
  }),
  weapon: z.object({
    main: weaponSchema,
    other: z.array(weaponSchema),
    additional: z.array(weaponSchema),
  }),
  weaponEffects: weaponSkillEffectSchema,
  totalEffects: weaponSkillTotalSchema,
  summon: z.object({
    main: summonSchema,
    friend: summonSchema,
    other: z.array(summonSchema),
    sub: z.array(summonSchema),
  }),
});

// 攻略フローの各アクションのスキーマ
const actionSchema = z.object({
  hp: z.string(),
  prediction: z.string(),
  charge: z.string(),
  guard: z.string(),
  action: z.string(),
  note: z.string(),
});

// メインのデータスキーマ
const flowSchema = z.object({
  title: z.string(),
  quest: z.string(),
  author: z.string(),
  description: z.string(),
  updateDate: z.string(),
  movie: z.string().optional(),
  note: z.string(),
  organization: organizationSchema,
  always: z.string(),
  flow: z.array(actionSchema),
});

// 型定義のエクスポート
export type WeaponSkillEffect = z.infer<typeof weaponSkillEffectSchema>;
export type WeaponSkillTotal = z.infer<typeof weaponSkillTotalSchema>;
export type ItemBase = z.infer<typeof itemBaseSchema>;
export type Member = z.infer<typeof memberSchema>;
export type Weapon = z.infer<typeof weaponSchema>;
export type Summon = z.infer<typeof summonSchema>;
export type Ability = z.infer<typeof abilitySchema>;
export type Organization = z.infer<typeof organizationSchema>;
export type Action = z.infer<typeof actionSchema>;
export type Flow = z.infer<typeof flowSchema>;
export type JobAbility = z.infer<typeof jobAbilitySchema>;
export type JobEquipment = z.infer<typeof jobEquipmentSchema>;
export type Job = z.infer<typeof jobSchema>;

// スキーマのエクスポート
export {
  itemBaseSchema,
  memberSchema,
  weaponSchema,
  summonSchema,
  organizationSchema,
  abilitySchema,
  actionSchema,
  flowSchema,
  jobAbilitySchema,
  jobEquipmentSchema,
  jobSchema,
};


// アクションテーブルの行操作イベントハンドラ
export interface ActionTableRowOperationHandlers {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDeleteRow?: (_index: number) => void;
  onAddRow?: (_index: number) => void;
  onPasteRows?: (_index: number, _rows: Partial<Action>[]) => void;
}

// アクションテーブルの状態
export interface ActionTableState {
  currentRow: number;
  data: Action[];
  isEditMode: boolean;
}

// アクションテーブルのスタイル設定
export interface ActionTableStyleConfig {
  baseBackground: string;
  selectedBackground: string;
  completedBackground: string;
  headerBackground: string;
  borderColor: string;
}

// アクションテーブルのセル位置
export interface ActionTableCellPosition {
  rowIndex: number;
  column: ActionTableColumn;
}

// アクションテーブルのセルの表示設定
export interface ActionTableCellConfig {
  alignment: TableAlignment;
  isEditable: boolean;
  isHeader: boolean;
  width: string;
}


// アクションテーブルの設定
export interface ActionTableConfig {
  columns: ActionTableColumnConfig;
  styles: ActionTableStyleConfig;
  buttonPosition?: ActionTableButtonPosition;
  clickType: ClickType;
}

export interface HistoryState {
  past: Flow[];
  future: Flow[];
}
