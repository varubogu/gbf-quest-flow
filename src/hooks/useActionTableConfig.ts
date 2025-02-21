import { useMemo } from 'react';
import type { ActionTableButtonPosition } from '@/types/models';
import { cn } from '@/utils/cn';

interface ActionTableColumnConfig {
  [key: string]: {
    alignment: string;
    isEditable: boolean;
    isHeader: boolean;
    width: string;
  };
}

interface UseActionTableConfigProps {
  isEditMode: boolean;
}

export const useActionTableConfig = ({
  isEditMode,
}: UseActionTableConfigProps) => {
  // グリッドレイアウトのクラスを生成
  const gridClasses = useMemo(() => {
    const editColumns = isEditMode
      ? 'grid-cols-[3.5rem_3.5rem_5fr_15fr_4fr_4fr_30fr_20fr]'
      : 'grid-cols-[5fr_15fr_4fr_4fr_30fr_20fr]';
    return cn('min-w-full grid', editColumns);
  }, [isEditMode]);

  // ヘッダー行のクラスを生成
  const headerClasses = useMemo(() => {
    return cn(
      gridClasses,
      'bg-green-300',
      'sticky',
      isEditMode ? 'top-0' : 'top-12',
      'z-10',
      'shadow-sm',
      'border-b',
      'border-gray-400',
      'border-l',
      'border-r'
    );
  }, [gridClasses, isEditMode]);

  // データ行のクラスを生成する関数
  const getRowClasses = ({
    index,
    currentRow,
    baseBackground,
  }: {
    index: number;
    currentRow: number;
    baseBackground: string;
  }) => {
    return cn(
      gridClasses,
      'border-b',
      'border-gray-400',
      'border-l',
      'border-r',
      !isEditMode && index === currentRow
        ? 'border border-yellow-500 bg-yellow-200'
        : !isEditMode && index < currentRow
          ? `opacity-50 ${baseBackground}`
          : baseBackground
    );
  };

  return {
    headerClasses,
    getRowClasses,
  };
};

// 設定の型ガード関数
export const isValidColumnConfig = (config: unknown): config is ActionTableColumnConfig => {
  if (typeof config !== 'object' || config === null) return false;

  const requiredColumns = ['hp', 'prediction', 'charge', 'guard', 'action', 'note'];
  return requiredColumns.every((column) => {
    const col = (config as any)[column];
    return (
      col &&
      typeof col.alignment === 'string' &&
      typeof col.isEditable === 'boolean' &&
      typeof col.isHeader === 'boolean' &&
      typeof col.width === 'string'
    );
  });
};

export const isValidButtonPosition = (
  position: unknown
): position is ActionTableButtonPosition => {
  return position === 'left' || position === 'right';
};