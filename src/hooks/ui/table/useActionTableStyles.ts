import { useMemo } from 'react';
import type {
  ActionTableConfig,
  ActionTableColumn,
  ActionTableCellPosition,
} from '@/types/models';
import { cn } from '@/utils/cn';

interface UseActionTableStylesProps {
  config: ActionTableConfig;
  currentRow: number;
  isEditMode: boolean;
}

// 定数の外部化
const COMMON_CLASSES = {
  GRID_BASE: 'min-w-full grid',
  STICKY: 'sticky',
  BORDER: {
    BASE: 'border',
    RIGHT: 'border-r',
    LEFT: 'border-l',
    BOTTOM: 'border-b',
  },
  FLEX: {
    BASE: 'flex',
    GAP: 'gap-2',
  },
  POSITION: {
    TOP_0: 'top-0',
    TOP_12: 'top-12',
  },
  SHADOW: 'shadow-sm',
  Z_INDEX: {
    HEADER: 'z-10',
    CONTROL: 'z-20',
  },
} as const;

// テキストアラインメントの定数
const TEXT_ALIGNMENT = {
  LEFT: 'text-left',
  CENTER: 'text-center',
  RIGHT: 'text-right',
} as const;

export interface UseActionTableStylesResult {
  gridClasses: string;
  headerClasses: string;
  getCellClasses: (_props: ActionTableCellPosition & { isHeader?: boolean }) => string;
  controlBarClasses: string;
  buttonGroupClasses: string;
}

export const useActionTableStyles = ({
  config,
  currentRow,
  isEditMode,
}: UseActionTableStylesProps): UseActionTableStylesResult => {
  // グリッドレイアウトのクラスを生成
  const gridClasses = useMemo(() => {
    const columnWidths = Object.values(config.columns)
      .map((col) => col.width)
      .join(' ');

    const editModeColumns = isEditMode ? '56px 56px ' : '';
    return cn(
      COMMON_CLASSES.GRID_BASE,
      `grid-cols-[${editModeColumns}${columnWidths}]`
    );
  }, [config.columns, isEditMode]);

  // ヘッダー行のクラスを生成
  const headerClasses = useMemo(() => {
    return cn(
      gridClasses,
      config.styles.headerBackground,
      COMMON_CLASSES.STICKY,
      isEditMode ? COMMON_CLASSES.POSITION.TOP_0 : COMMON_CLASSES.POSITION.TOP_12,
      COMMON_CLASSES.Z_INDEX.HEADER,
      COMMON_CLASSES.SHADOW,
      COMMON_CLASSES.BORDER.BOTTOM,
      config.styles.borderColor,
      COMMON_CLASSES.BORDER.LEFT,
      COMMON_CLASSES.BORDER.RIGHT
    );
  }, [gridClasses, config.styles, isEditMode]);

  // 行の背景色を計算するメモ化関数
  const getRowBackground = useMemo(() => {
    return (rowIndex: number): string => {
      const hpRowCount = Array.from({ length: rowIndex + 1 }).filter(
        (_, i) => config.columns.hp && i <= rowIndex
      ).length;
      return hpRowCount % 2 === 1
        ? config.styles.baseBackground
        : config.styles.completedBackground;
    };
  }, [config.columns.hp, config.styles.baseBackground, config.styles.completedBackground]);

  // セルのクラスを生成する関数
  const getCellClasses = useMemo(() => {
    return ({
      rowIndex,
      column,
      isHeader = false,
    }: ActionTableCellPosition & { isHeader?: boolean }): string => {
      const isCurrentRow = rowIndex === currentRow;
      const baseBackground = getRowBackground(rowIndex);

      return cn(
        COMMON_CLASSES.BORDER.RIGHT,
        config.styles.borderColor,
        {
          [config.styles.selectedBackground]: !isEditMode && isCurrentRow,
          'opacity-50': !isEditMode && rowIndex < currentRow,
          [baseBackground]: !isCurrentRow || isEditMode,
        },
        getColumnAlignment(column),
        isHeader && config.styles.headerBackground
      );
    };
  }, [config.styles.borderColor, config.styles.selectedBackground, config.styles.headerBackground, currentRow, getRowBackground, isEditMode]);

  // コントロールバーのクラスを生成
  const controlBarClasses = useMemo(() => {
    return cn(
      COMMON_CLASSES.FLEX.BASE,
      'justify-between',
      'items-center',
      'p-2',
      COMMON_CLASSES.STICKY,
      COMMON_CLASSES.POSITION.TOP_0,
      'bg-white',
      COMMON_CLASSES.Z_INDEX.CONTROL
    );
  }, []);

  // ボタングループのクラスを生成
  const buttonGroupClasses = useMemo(() => {
    return cn(
      COMMON_CLASSES.FLEX.BASE,
      COMMON_CLASSES.FLEX.GAP,
      config.buttonPosition === 'right' && 'ml-auto'
    );
  }, [config.buttonPosition]);

  return {
    gridClasses,
    headerClasses,
    getCellClasses,
    controlBarClasses,
    buttonGroupClasses,
  };
};

// スタイル関連のユーティリティ関数
const getColumnAlignment = (column: ActionTableColumn): string => {
  const alignmentMap: Record<ActionTableColumn, string> = {
    hp: TEXT_ALIGNMENT.RIGHT,
    prediction: TEXT_ALIGNMENT.LEFT,
    charge: TEXT_ALIGNMENT.CENTER,
    guard: TEXT_ALIGNMENT.CENTER,
    action: TEXT_ALIGNMENT.LEFT,
    note: TEXT_ALIGNMENT.LEFT,
  };

  return alignmentMap[column] || TEXT_ALIGNMENT.LEFT;
};

export type { UseActionTableStylesProps };