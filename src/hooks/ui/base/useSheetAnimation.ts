import { useState, useEffect } from 'react';

interface UseSheetAnimationProps {
  open: boolean;
  side: 'left' | 'right';
}

export interface UseSheetAnimationResult {
  isVisible: boolean;
  animateIn: boolean;
  overlayClasses: string;
  sheetClasses: string;
}

export const useSheetAnimation = ({ open, side }: UseSheetAnimationProps): UseSheetAnimationResult => {
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

  const overlayClasses = `fixed inset-0 bg-black z-40 transition-opacity duration-300 ease-out ${
    open ? 'opacity-50' : 'opacity-0'
  }`;

  const sheetClasses = `fixed top-0 ${side}-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-out ${
    animateIn ? 'translate-x-0' : side === 'left' ? '-translate-x-full' : 'translate-x-full'
  }`;

  return {
    isVisible,
    animateIn,
    overlayClasses,
    sheetClasses,
  };
};