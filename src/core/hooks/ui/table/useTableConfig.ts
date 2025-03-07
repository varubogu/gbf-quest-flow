import { useMemo } from 'react';
import { cn } from '@/lib/utils/cn';

export interface TableColumnConfig {
  [key: string]: {
    alignment: string;
    isEditable: boolean;
    isHeader: boolean;
    width: string;
  };
}

interface UseTableConfigProps {
  isEditMode: boolean;
  columnWidths?: string[];
  baseBackground?: string;
  selectedBackground?: string;
  completedBackground?: string;
  headerBackground?: string;
  borderColor?: string;
}

export interface UseTableConfigResult {
  headerClasses: string;
  getRowClasses: (_props: { index: number; currentRow: number; baseBackground: string }) => string;
}

export const useTableConfig = ({
  isEditMode,
  columnWidths = [],
  baseBackground = 'bg-white',
  selectedBackground = 'bg-yellow-200',
  completedBackground = 'bg-gray-300',
  headerBackground = 'bg-green-300',
  borderColor = 'border-gray-400',
}: UseTableConfigProps): UseTableConfigResult => {
  // グリッドレイアウトのクラスを生成
  const gridClasses = useMemo(() => {
    // 編集モードの場合は削除と追加ボタン用の列を追加
    const editPrefix = isEditMode ? 'grid-cols-[3.5rem_3.5rem_' : 'grid-cols-[';

    // カラム幅が指定されている場合はそれを使用
    const widthsStr = columnWidths.length > 0
      ? columnWidths.join('_')
      : '5fr_15fr_4fr_4fr_30fr_20fr';

    return cn('min-w-full grid', `${editPrefix}${widthsStr}]`);
  }, [isEditMode, columnWidths]);

  // ヘッダー行のクラスを生成
  const headerClasses = useMemo(() => {
    return cn(
      gridClasses,
      headerBackground,
      'sticky',
      isEditMode ? 'top-0' : 'top-12',
      'z-10',
      'shadow-sm',
      'border-b',
      borderColor,
      'border-l',
      'border-r'
    );
  }, [gridClasses, isEditMode, headerBackground, borderColor]);

  // データ行のクラスを生成する関数
  const getRowClasses = ({
    index,
    currentRow,
    baseBackground: rowBackground,
  }: {
    index: number;
    currentRow: number;
    baseBackground: string;
  }): string => {
    return cn(
      gridClasses,
      'border-b',
      borderColor,
      'border-l',
      'border-r',
      !isEditMode && index === currentRow
        ? `border border-yellow-500 ${selectedBackground}`
        : !isEditMode && index < currentRow
          ? `opacity-50 ${rowBackground}`
          : rowBackground
    );
  };

  return {
    headerClasses,
    getRowClasses,
  };
};

// 設定の型ガード関数
export const isValidColumnConfig = (config: unknown): config is TableColumnConfig => {
  if (typeof config !== 'object' || config === null) return false;

  // 少なくとも1つのプロパティがあることを確認
  const configObject = config as Record<string, unknown>;
  const keys = Object.keys(configObject);
  if (keys.length === 0) return false;

  // 各プロパティが正しい形式かチェック
  return keys.every((key) => {
    const col = configObject[key];
    return (
      col &&
      typeof col === 'object' &&
      col !== null &&
      'alignment' in col &&
      typeof (col as { alignment: unknown }).alignment === 'string' &&
      'isEditable' in col &&
      typeof (col as { isEditable: unknown }).isEditable === 'boolean' &&
      'isHeader' in col &&
      typeof (col as { isHeader: unknown }).isHeader === 'boolean' &&
      'width' in col &&
      typeof (col as { width: unknown }).width === 'string'
    );
  });
};

export const isValidButtonPosition = (
  position: unknown
): position is 'left' | 'right' => {
  return position === 'left' || position === 'right';
};