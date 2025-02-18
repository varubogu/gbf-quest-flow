import { useMemo } from 'react';
import { cn } from '@/utils/cn';
import useSettingsStore from '@/stores/settingsStore';

interface TableCellStyleProps {
  isHeader: boolean;
  isCurrentRow: boolean;
  isEditing: boolean;
  alignment: 'left' | 'center' | 'right';
  className?: string;
}

export const useTableCellStyles = () => {
  const { settings } = useSettingsStore();

  const alignmentClasses = useMemo(
    () => ({
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }),
    []
  );

  const getContainerClassName = ({
    isHeader,
    isCurrentRow,
    isEditing,
    alignment,
    className = '',
  }: TableCellStyleProps) => {
    return cn(
      'border-b border-r border-gray-400',
      isHeader ? 'bg-muted font-medium' : 'bg-background',
      isCurrentRow && 'bg-accent',
      !isHeader && 'cursor-text',
      alignmentClasses[alignment],
      className
    );
  };

  const getContainerStyle = () => ({
    paddingTop: `${settings.tablePadding}px`,
    paddingBottom: `${settings.tablePadding}px`,
    paddingLeft: `${Math.max(2, settings.tablePadding)}px`,
    paddingRight: `${Math.max(2, settings.tablePadding)}px`,
  });

  const getTextareaClassName = ({
    isHeader,
    alignment,
    className = '',
  }: Omit<TableCellStyleProps, 'isCurrentRow' | 'isEditing'>) => {
    return cn(
      'w-full bg-white border border-gray-400 rounded px-1 resize-none overflow-hidden',
      'text-sm leading-normal font-normal',
      alignmentClasses[alignment],
      className
    );
  };

  return {
    alignmentClasses,
    getContainerClassName,
    getContainerStyle,
    getTextareaClassName,
  };
};