import type { Side } from '@/types/models';
import { useState, useEffect } from 'react';

interface UseSheetAnimationProps {
  open: boolean;
  side: Side;
}

export interface UseSheetAnimationResult {
  isVisible: boolean;
  animateIn: boolean;
  overlayClasses: string;
  sheetClasses: string;
}

export const useSheetAnimation = ({
  open,
  side,
}: UseSheetAnimationProps): UseSheetAnimationResult => {
  const [isVisible, setIsVisible] = useState(open);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      const timer = setTimeout(() => setAnimateIn(true), 20);
      return (): void => clearTimeout(timer);
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return (): void => clearTimeout(timer);
    }
  }, [open]);

  const overlayClasses = `fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-out ${
    open ? 'opacity-100' : 'opacity-0'
  }`;

  const sideClass = side === 'left' ? 'left-0' : 'right-0';
  const hiddenTranslate = side === 'left' ? '-translate-x-full' : 'translate-x-full';
  const sheetClasses = `fixed top-0 ${sideClass} h-full w-64 bg-white text-foreground shadow-xl z-[60] transform transition-transform duration-300 ease-out ${
    animateIn ? 'translate-x-0' : hiddenTranslate
  }`;

  return {
    isVisible,
    animateIn,
    overlayClasses,
    sheetClasses,
  };
};
