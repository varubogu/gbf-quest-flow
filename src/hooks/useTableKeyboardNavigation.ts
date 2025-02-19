import { useEffect } from 'react';
import type { Action } from '@/types/models';

interface UseTableKeyboardNavigationProps {
  currentRow: number;
  data: Action[];
  onRowSelect: (_index: number) => void;
  isEditMode: boolean;
}

export const useTableKeyboardNavigation = ({
  currentRow,
  data,
  onRowSelect,
  isEditMode,
}: UseTableKeyboardNavigationProps) => {
  useEffect(() => {
    if (isEditMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && currentRow > 0) {
        e.preventDefault();
        onRowSelect(currentRow - 1);
      } else if (e.key === 'ArrowDown' && currentRow < data.length - 1) {
        e.preventDefault();
        onRowSelect(currentRow + 1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onRowSelect, currentRow, data.length, isEditMode]);
};