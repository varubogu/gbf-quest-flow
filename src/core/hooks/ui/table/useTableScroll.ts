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
 * sticky ヘッダーぶんの上端オフセットを返す。
 */
function getStickyOffset(container: HTMLElement): number {
  const containerRect = container.getBoundingClientRect();
  let stickyHeight = 0;
  container.querySelectorAll<HTMLElement>('.sticky').forEach((el) => {
    stickyHeight = Math.max(stickyHeight, el.getBoundingClientRect().bottom - containerRect.top);
  });
  return stickyHeight;
}

/**
 * 行が sticky を除いた表示領域と重なるか。
 */
function isRowIntersectingView(
  row: HTMLElement,
  container: HTMLElement,
  stickyOffset: number
): boolean {
  const containerRect = container.getBoundingClientRect();
  const rowRect = row.getBoundingClientRect();
  const visibleTop = containerRect.top + stickyOffset;
  return rowRect.bottom > visibleTop && rowRect.top < containerRect.bottom;
}

/**
 * 表示領域上端に最も近い行インデックスを返す。
 */
function findTopVisibleRowIndex(
  container: HTMLElement,
  rowCount: number,
  stickyOffset: number
): number | null {
  const containerRect = container.getBoundingClientRect();
  const visibleTop = containerRect.top + stickyOffset;
  let bestIndex: number | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < rowCount; index += 1) {
    const row = document.getElementById(`action-row-${index}`);
    if (!row) continue;
    const rowRect = row.getBoundingClientRect();
    if (rowRect.bottom <= visibleTop || rowRect.top >= containerRect.bottom) continue;
    const distance = Math.abs(rowRect.top - visibleTop);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  }

  return bestIndex;
}

/**
 * 閲覧モードの行動表スクロール。
 * トラックパッドの慣性スクロールは奪わず、マウスホイールのみ行送りに使う。
 * 通常スクロールで選択行が画面外に出たら、見えている行へ選択を移す。
 */
export const useTableScroll = ({
  containerRef,
  currentRow,
  data,
  onRowSelect,
  isEditMode,
}: UseTableScrollProps): void => {
  const lastScrolledRowRef = useRef<number | null>(null);
  const skipAutoScrollRef = useRef(false);

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
    const container = containerRef.current;
    if (!container || isEditMode) return;

    let frame = 0;
    const syncSelectionToVisibleRow = (): void => {
      frame = 0;
      const stickyOffset = getStickyOffset(container);
      const currentEl = document.getElementById(`action-row-${currentRow}`);
      if (currentEl && isRowIntersectingView(currentEl, container, stickyOffset)) {
        return;
      }

      const nextIndex = findTopVisibleRowIndex(container, data.length, stickyOffset);
      if (nextIndex !== null && nextIndex !== currentRow) {
        skipAutoScrollRef.current = true;
        onRowSelect(nextIndex);
      }
    };

    const handleScroll = (): void => {
      if (frame) return;
      frame = window.requestAnimationFrame(syncSelectionToVisibleRow);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return (): void => {
      container.removeEventListener('scroll', handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [containerRef, currentRow, data.length, isEditMode, onRowSelect]);

  useEffect(() => {
    if (isEditMode) return;

    const container = containerRef.current;
    const target = document.getElementById(`action-row-${currentRow}`);
    if (!target || !container) return;

    if (skipAutoScrollRef.current) {
      skipAutoScrollRef.current = false;
      lastScrolledRowRef.current = currentRow;
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const stickyHeight = getStickyOffset(container);

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
