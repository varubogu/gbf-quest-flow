import { useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import useSettingsStore from '@/core/stores/settingsStore';

interface BaseStyleProps {
  isHeader: boolean;
  className?: string;
}

export interface UseTableCellBaseStyleResult {
  baseClasses: {
    border: string;
    background: string;
    header: string;
    cursor: string;
  };
  getBaseClassName: (_props: BaseStyleProps) => string;
  getBasePadding: () => {
    paddingTop: string;
    paddingBottom: string;
    paddingLeft: string;
    paddingRight: string;
  };
}

export const useTableCellBaseStyle = (): UseTableCellBaseStyleResult => {
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

  const getBaseClassName = ({ isHeader, className = '' }: BaseStyleProps): string => {
    return cn(
      baseClasses.border,
      isHeader ? baseClasses.header : baseClasses.background,
      !isHeader && baseClasses.cursor,
      className
    );
  };

  interface Padding {
    paddingTop: string;
    paddingBottom: string;
    paddingLeft: string;
    paddingRight: string;
  }

  const getBasePadding = (): Padding => ({
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