import { useEffect, type RefObject, useRef } from 'react';
import type { Action } from '@/types/models';

const MOUSE_WHEEL_DELTA_THRESHOLD = 40;

interface UseTableScrollProps {
  containerRef: RefObject<HTMLDivElement | null>;
  currentRow: number;
  data: Action[];
  onRowSelect: (_index: number) => void;
  isEditMode: boolean;
}

/**
 * 閲覧モードの行動表スクロール。
 * トラックパッドの慣性スクロールは奪わず、マウスホイールのみ行送りに使う。
 */
export const useTableScroll = ({
  containerRef,
  currentRow,
  data,
  onRowSelect,
  isEditMode,
}: UseTableScrollProps): void => {
  const lastScrolledRowRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || isEditMode) return;

    const handleWheel = (e: WheelEvent): void => {
      const target = e.target as HTMLElement;
      if (!container.contains(target)) return;

      // ピクセル単位の小さなデルタはトラックパッドとみなし、通常スクロールを優先する
      const isTrackpadLike = e.deltaMode === 0 && Math.abs(e.deltaY) < MOUSE_WHEEL_DELTA_THRESHOLD;
      if (isTrackpadLike) {
        return;
      }

      e.preventDefault();
      if (e.deltaY < 0 && currentRow > 0) {
        onRowSelect(currentRow - 1);
      } else if (e.deltaY > 0 && currentRow < data.length - 1) {
        onRowSelect(currentRow + 1);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return (): void => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [currentRow, data.length, onRowSelect, isEditMode, containerRef]);

  useEffect(() => {
    if (isEditMode) return;

    const container = containerRef.current;
    const target = document.getElementById(`action-row-${currentRow}`);
    if (!target || !container) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const stickyEls = container.querySelectorAll<HTMLElement>('.sticky');
    let stickyHeight = 0;
    stickyEls.forEach((el) => {
      if (el === target) return;
      stickyHeight = Math.max(stickyHeight, el.getBoundingClientRect().bottom - containerRect.top);
    });

    const isAbove = targetRect.top < containerRect.top + stickyHeight;
    const isBelow = targetRect.bottom > containerRect.bottom;
    if (!isAbove && !isBelow && lastScrolledRowRef.current === currentRow) {
      return;
    }
    if (!isAbove && !isBelow) {
      lastScrolledRowRef.current = currentRow;
      return;
    }

    const desiredScrollTop =
      container.scrollTop + (targetRect.top - containerRect.top) - stickyHeight;
    container.scrollTo({
      top: desiredScrollTop,
      behavior: 'auto',
    });
    lastScrolledRowRef.current = currentRow;
  }, [currentRow, isEditMode, containerRef]);
};
