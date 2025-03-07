import { useEffect } from 'react';

interface UseTableKeyboardNavigationProps<T> {
  currentRow: number;
  data: T[];
  onRowSelect: (_index: number) => void;
  isEditMode: boolean;
}

export const useTableKeyboardNavigation = <T>({
  currentRow,
  data,
  onRowSelect,
  isEditMode,
}: UseTableKeyboardNavigationProps<T>): void => {
  useEffect(() => {
    if (isEditMode) return;

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowUp' && currentRow > 0) {
        e.preventDefault();
        onRowSelect(currentRow - 1);
      } else if (e.key === 'ArrowDown' && currentRow < data.length - 1) {
        e.preventDefault();
        onRowSelect(currentRow + 1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return (): void => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onRowSelect, currentRow, data.length, isEditMode]);
};