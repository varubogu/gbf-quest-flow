import { useEffect, type RefObject, useRef } from 'react';
import type { Action } from '@/types/models';

const TOUCHPAD_SCROLL_THRESHOLD = 35;

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
}: UseTableScrollProps): void => {
  const accumulatedDeltaRef = useRef(0);

  // ホイールスクロール制御
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isEditMode) return;

    const handleWheel = (e: WheelEvent): void => {
      const target = e.target as HTMLElement;
      if (!container.contains(target)) return;

      e.preventDefault();

      // タッチパッドの判定
      const isTouchpad = e.deltaMode === 0;

      if (isTouchpad) {
        // タッチパッドの場合は相対位置での処理
        accumulatedDeltaRef.current += e.deltaY;

        // 累積値が一定のしきい値を超えたら行を移動
        if (accumulatedDeltaRef.current < -TOUCHPAD_SCROLL_THRESHOLD && currentRow > 0) {
          onRowSelect(currentRow - 1);
          accumulatedDeltaRef.current = 0;
        } else if (
          accumulatedDeltaRef.current > TOUCHPAD_SCROLL_THRESHOLD &&
          currentRow < data.length - 1
        ) {
          onRowSelect(currentRow + 1);
          accumulatedDeltaRef.current = 0;
        }
      } else {
        // マウスホイールの場合は従来通りの処理
        if (e.deltaY < 0 && currentRow > 0) {
          onRowSelect(currentRow - 1);
        } else if (e.deltaY > 0 && currentRow < data.length - 1) {
          onRowSelect(currentRow + 1);
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return (): void => {
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