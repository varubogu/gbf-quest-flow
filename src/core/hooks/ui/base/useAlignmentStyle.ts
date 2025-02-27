import { useMemo } from 'react';
import type { TableAlignment } from '@/types/types';

export interface UseAlignmentStyleResult {
  alignmentClasses: {
    left: string;
    center: string;
    right: string;
  };
  getAlignmentClass: (_alignment?: TableAlignment) => string;
}

export const useAlignmentStyle = (): UseAlignmentStyleResult => {
  const alignmentClasses = useMemo(
    () => ({
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }),
    []
  );

  const getAlignmentClass = (alignment: TableAlignment = 'left'): string => alignmentClasses[alignment];

  return {
    alignmentClasses,
    getAlignmentClass,
  };
};