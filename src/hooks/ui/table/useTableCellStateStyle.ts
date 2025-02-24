import { useMemo } from 'react';
import { cn } from '@/utils/cn';

interface StateStyleProps {
  isCurrentRow: boolean;
  isHeader: boolean;
}

type TextVariant = 'default' | 'dimmed' | 'muted';

export const useTableCellStateStyle = () => {
  const stateClasses = useMemo(
    () => ({
      current: 'bg-accent',
    }),
    []
  );

  const getStateClassName = ({ isCurrentRow }: Pick<StateStyleProps, 'isCurrentRow'>) => {
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