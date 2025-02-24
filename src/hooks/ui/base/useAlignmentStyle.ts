import { useMemo } from 'react';

type Alignment = 'left' | 'center' | 'right';

export const useAlignmentStyle = () => {
  const alignmentClasses = useMemo(
    () => ({
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }),
    []
  );

  const getAlignmentClass = (alignment: Alignment = 'left') => alignmentClasses[alignment];

  return {
    alignmentClasses,
    getAlignmentClass,
  };
};