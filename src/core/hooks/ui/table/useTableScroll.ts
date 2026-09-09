import { useEffect, type RefObject, useRef } from 'react';
import type { Action } from '@/types/models';

const MOUSE_WHEEL_DELTA_THRESHOLD = 40;
const FULLY_VISIBLE_EPSILON_PX = 0.5;

interface UseTableScrollProps {
  containerRef: RefObject<HTMLDivElement | null>;
  currentRow: number;
  data: Action[];
  onRowSelect: (_index: number) => void;
  isEditMode: boolean;
}

/**
 * display:grid な tr でもセルから正しい矩形を取る。
 */
function getRowRect(row: HTMLElement): DOMRect {
  const cells = row.querySelectorAll('td, th');
  if (cells.length === 0) {
    return row.getBoundingClientRect();
  }
  let top = Number.POSITIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;
  let left = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  cells.forEach((cell) => {
    const rect = cell.getBoundingClientRect();
    top = Math.min(top, rect.top);
    bottom = Math.max(bottom, rect.bottom);
    left = Math.min(left, rect.left);
    right = Math.max(right, rect.right);
  });
  return new DOMRect(left, top, right - left, bottom - top);
}

/**
 * 上下ボタンとヘッダーセルぶんの上端オフセットを返す。
 */
function getStickyOffset(container: HTMLElement): number {
  const containerRect = container.getBoundingClientRect();
  const controlsHeight = Number.parseFloat(
    container.style.getPropertyValue('--table-controls-height')
  );
  let stickyBottom = containerRect.top + (Number.isFinite(controlsHeight) ? controlsHeight : 0);
  container.querySelectorAll<HTMLElement>('thead th').forEach((cell) => {
    stickyBottom = Math.max(stickyBottom, cell.getBoundingClientRect().bottom);
  });
  return Math.max(0, stickyBottom - containerRect.top);
}

/**
 * 行が表示領域内に完全に収まっているか。
 */
function isRowFullyVisible(
  row: HTMLElement,
  container: HTMLElement,
  stickyOffset: number
): boolean {
  const containerRect = container.getBoundingClientRect();
  const rowRect = getRowRect(row);
  const visibleTop = containerRect.top + stickyOffset;
  return (
    rowRect.top + FULLY_VISIBLE_EPSILON_PX >= visibleTop &&
    rowRect.bottom - FULLY_VISIBLE_EPSILON_PX <= containerRect.bottom
  );
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
  const rowRect = getRowRect(row);
  const visibleTop = containerRect.top + stickyOffset;
  return rowRect.bottom > visibleTop && rowRect.top < containerRect.bottom;
}

/**
 * 完全に見えている行のうち、最も上のインデックスを返す。
 */
function findTopFullyVisibleRowIndex(
  container: HTMLElement,
  rowCount: number,
  stickyOffset: number
): number | null {
  for (let index = 0; index < rowCount; index += 1) {
    const row = document.getElementById(`action-row-${index}`);
    if (!row) continue;
    if (isRowFullyVisible(row, container, stickyOffset)) {
      return index;
    }
  }
  return null;
}

/**
 * 表示領域と交差している行のうち、上端に最も近いインデックスを返す。
 */
function findTopIntersectingRowIndex(
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
    if (!isRowIntersectingView(row, container, stickyOffset)) continue;
    const distance = Math.abs(getRowRect(row).top - visibleTop);
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
 * 通常スクロールでは、完全に見えている行のうち一番上を選択する。
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
      const nextIndex =
        findTopFullyVisibleRowIndex(container, data.length, stickyOffset) ??
        findTopIntersectingRowIndex(container, data.length, stickyOffset);
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
    const targetRect = getRowRect(target);
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
