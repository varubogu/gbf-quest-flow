import { useMemo } from 'react';
import { cn } from '@/utils/cn';
import { textInputBaseStyle, textareaBaseStyle } from '@/components/atoms/IconTextButton';

interface TextareaStyleProps {
  isHeader: boolean;
  alignment: 'left' | 'center' | 'right';
  className?: string;
}

export interface UseTextareaStyleResult {
  getTextareaClassName: (_props: TextareaStyleProps) => string;
}

export const useTextareaStyle = (): UseTextareaStyleResult => {
  const baseClasses = useMemo(
    () => ({
      base: [
        'w-full bg-white border border-gray-400 rounded px-1',
        'resize-none overflow-hidden',
        'text-sm leading-normal font-normal',
      ],
      alignment: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    }),
    []
  );

  const getTextareaClassName = ({ isHeader, alignment, className = '' }: TextareaStyleProps): string => {
    return cn(
      baseClasses.base,
      baseClasses.alignment[alignment],
      isHeader ? textInputBaseStyle : textareaBaseStyle,
      className
    );
  };

  return {
    getTextareaClassName,
  };
};