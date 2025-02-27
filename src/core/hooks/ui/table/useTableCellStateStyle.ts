import { useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import type { TextVariant } from '@/types/types';

interface StateStyleProps {
  isCurrentRow: boolean;
  isHeader: boolean;
}

export interface UseTableCellStateStyleResult {
  stateClasses: { current: string };
  getStateClassName: (_props: Pick<StateStyleProps, 'isCurrentRow'>) => string;
  getTextVariant: (_props: StateStyleProps) => TextVariant;
}

export const useTableCellStateStyle = (): UseTableCellStateStyleResult => {
  const stateClasses = useMemo(
    () => ({
      current: 'bg-accent',
    }),
    []
  );

  const getStateClassName = ({ isCurrentRow }: Pick<StateStyleProps, 'isCurrentRow'>): string => {
    return cn(isCurrentRow && stateClasses.current);
  };

  const getTextVariant = ({ isCurrentRow, isHeader }: StateStyleProps): TextVariant => {
    if (isHeader) return 'default';
    return isCurrentRow ? 'default' : 'dimmed';
  };

  return {
    stateClasses,
    getStateClassName,
    getTextVariant,
  };
};