import { useMemo } from 'react';

type Alignment = 'left' | 'center' | 'right';

export interface UseAlignmentStyleResult {
  alignmentClasses: {
    left: string;
    center: string;
    right: string;
  };
  getAlignmentClass: (_alignment?: Alignment) => string;
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

  const getAlignmentClass = (alignment: Alignment = 'left'): string => alignmentClasses[alignment];

  return {
    alignmentClasses,
    getAlignmentClass,
  };
};