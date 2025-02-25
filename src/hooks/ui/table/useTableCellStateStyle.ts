import { useMemo } from 'react';
import { cn } from '@/utils/cn';

interface StateStyleProps {
  isCurrentRow: boolean;
  isHeader: boolean;
}

type TextVariant = 'default' | 'dimmed' | 'muted';

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