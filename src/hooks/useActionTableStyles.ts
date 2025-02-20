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

export const useActionTableStyles = ({
  config,
  currentRow,
  isEditMode,
}: UseActionTableStylesProps) => {
  // グリッドレイアウトのクラスを生成
  const gridClasses = useMemo(() => {
    const columnWidths = Object.values(config.columns)
      .map((col) => col.width)
      .join(' ');

    const editModeColumns = isEditMode ? '56px 56px ' : '';
    return `min-w-full grid grid-cols-[${editModeColumns}${columnWidths}]`;
  }, [config.columns, isEditMode]);

  // ヘッダー行のクラスを生成
  const headerClasses = useMemo(() => {
    return cn(
      gridClasses,
      config.styles.headerBackground,
      'sticky',
      isEditMode ? 'top-0' : 'top-12',
      'z-10',
      'shadow-sm',
      'border-b',
      config.styles.borderColor,
      'border-l',
      'border-r'
    );
  }, [gridClasses, config.styles, isEditMode]);

  // セルのクラスを生成する関数
  const getCellClasses = ({
    rowIndex,
    column,
    isHeader = false,
  }: ActionTableCellPosition & { isHeader?: boolean }) => {
    const columnConfig = config.columns[column];
    const isCurrentRow = rowIndex === currentRow;

    // HPが入っている行数をカウント（背景色の交互表示用）
    const hpRowCount = Array.from({ length: rowIndex + 1 }).filter(
      (_, i) => config.columns.hp && i <= rowIndex
    ).length;
    const isEvenRow = hpRowCount % 2 === 1;

    const baseBackground = isEvenRow
      ? config.styles.baseBackground
      : config.styles.completedBackground;

    return cn(
      'border-r',
      config.styles.borderColor,
      {
        [config.styles.selectedBackground]: !isEditMode && isCurrentRow,
        'opacity-50': !isEditMode && rowIndex < currentRow,
        [baseBackground]: !isCurrentRow || isEditMode,
      },
      columnConfig.alignment === 'left' && 'text-left',
      columnConfig.alignment === 'center' && 'text-center',
      columnConfig.alignment === 'right' && 'text-right',
      isHeader && config.styles.headerBackground
    );
  };

  // コントロールバーのクラスを生成
  const controlBarClasses = useMemo(() => {
    return cn(
      'flex',
      'justify-between',
      'items-center',
      'p-2',
      'sticky',
      'top-0',
      'bg-white',
      'z-20'
    );
  }, []);

  // ボタングループのクラスを生成
  const buttonGroupClasses = useMemo(() => {
    return cn('flex', 'gap-2', config.buttonPosition === 'right' && 'ml-auto');
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
export const getColumnAlignment = (column: ActionTableColumn): string => {
  switch (column) {
    case 'hp':
      return 'text-right';
    case 'charge':
    case 'guard':
      return 'text-center';
    default:
      return 'text-left';
  }
};