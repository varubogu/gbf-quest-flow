import { useMemo } from 'react';
import { cn } from '@/utils/cn';
import useSettingsStore from '@/stores/settingsStore';

interface BaseStyleProps {
  isHeader: boolean;
  className?: string;
}

export const useTableCellBaseStyle = () => {
  const { settings } = useSettingsStore();

  const baseClasses = useMemo(
    () => ({
      border: 'border-b border-r border-gray-400',
      background: 'bg-background',
      header: 'bg-green-300 font-medium',
      cursor: 'cursor-text',
    }),
    []
  );

  const getBaseClassName = ({ isHeader, className = '' }: BaseStyleProps) => {
    return cn(
      baseClasses.border,
      isHeader ? baseClasses.header : baseClasses.background,
      !isHeader && baseClasses.cursor,
      className
    );
  };

  const getBasePadding = () => ({
    paddingTop: `${settings.tablePadding}px`,
    paddingBottom: `${settings.tablePadding}px`,
    paddingLeft: `${Math.max(2, settings.tablePadding)}px`,
    paddingRight: `${Math.max(2, settings.tablePadding)}px`,
  });

  return {
    baseClasses,
    getBaseClassName,
    getBasePadding,
  };
};