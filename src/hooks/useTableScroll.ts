import { useEffect, type RefObject } from 'react';
import type { Action } from '@/types/models';

interface UseTableScrollProps {
  containerRef: RefObject<HTMLDivElement | null>;
  currentRow: number;
  data: Action[];
  onRowSelect: (_index: number) => void;
  isEditMode: boolean;
}

export const useTableScroll = ({
  containerRef,
  currentRow,
  data,
  onRowSelect,
  isEditMode,
}: UseTableScrollProps) => {
  // ホイールイベントの制御
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (isEditMode) return;

      e.preventDefault();
      const delta = e.deltaY > 0 ? 1 : -1;
      const newIndex = currentRow + delta;

      if (newIndex >= 0 && newIndex < data.length) {
        onRowSelect(newIndex);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [currentRow, data.length, onRowSelect, isEditMode, containerRef]);

  // 自動スクロール制御
  useEffect(() => {
    if (isEditMode) return;

    const container = containerRef.current;
    const target = document.getElementById(`action-row-${currentRow}`);
    if (target && container) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const controlBar = container.querySelector('.sticky.top-0');
      const headerBar = container.querySelector('.sticky.top-12');
      const controlHeight = controlBar ? controlBar.getBoundingClientRect().height : 0;
      const headerHeight = headerBar ? headerBar.getBoundingClientRect().height : 0;
      const fixedHeight = controlHeight + headerHeight;
      const desiredScrollTop =
        container.scrollTop + (targetRect.top - containerRect.top) - fixedHeight;
      container.scrollTo({
        top: desiredScrollTop,
        behavior: 'smooth',
      });
    }
  }, [currentRow, isEditMode, containerRef]);
};