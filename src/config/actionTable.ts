import type {
  ActionTableColumnConfig,
  ActionTableStyleConfig,
  ActionTableConfig,
} from '@/types/types';

// デフォルトのカラム設定
export const defaultColumnConfig: ActionTableColumnConfig = {
  hp: {
    alignment: 'right',
    isEditable: true,
    isHeader: false,
    width: '5fr',
  },
  prediction: {
    alignment: 'left',
    isEditable: true,
    isHeader: false,
    width: '15fr',
  },
  charge: {
    alignment: 'center',
    isEditable: true,
    isHeader: false,
    width: '4fr',
  },
  guard: {
    alignment: 'center',
    isEditable: true,
    isHeader: false,
    width: '4fr',
  },
  action: {
    alignment: 'left',
    isEditable: true,
    isHeader: false,
    width: '30fr',
  },
  note: {
    alignment: 'left',
    isEditable: true,
    isHeader: false,
    width: '20fr',
  },
};

// デフォルトのスタイル設定
export const defaultStyleConfig: ActionTableStyleConfig = {
  baseBackground: 'bg-white',
  selectedBackground: 'bg-yellow-200',
  completedBackground: 'bg-gray-300',
  headerBackground: 'bg-green-300',
  borderColor: 'border-gray-400',
};

// デフォルトのテーブル設定
export const defaultTableConfig: ActionTableConfig = {
  columns: defaultColumnConfig,
  styles: defaultStyleConfig,
  buttonPosition: 'left',
  clickType: 'single',
};

// カラムヘッダーの翻訳キー
export const columnTranslationKeys: Record<keyof ActionTableColumnConfig, string> = {
  hp: 'hpColumn',
  prediction: 'triggerColumn',
  charge: 'ougiColumn',
  guard: 'guardColumn',
  action: 'actionColumn',
  note: 'notesColumn',
};