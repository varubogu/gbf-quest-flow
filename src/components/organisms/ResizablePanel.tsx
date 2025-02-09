import React, { useCallback, useEffect, useRef } from 'react';

interface ResizablePanelProps {
  topContent: React.ReactNode;
  bottomContent: React.ReactNode;
  className?: string;
}

export function ResizablePanel({ topContent, bottomContent, className = '' }: ResizablePanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // ドラッグ状態を保持する参照
  const dragState = useRef<{
    startY: number;
    topRowHeight: number;
    bottomRowHeight: number;
  } | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.current || !containerRef.current) return;

    const clientY = e.clientY;
    const { startY, topRowHeight, bottomRowHeight } = dragState.current;
    const dy = clientY - startY;
    const newTop = topRowHeight + dy;
    const newBottom = bottomRowHeight - dy;

    if (newTop < 50 || newBottom < 50) return;

    // 直接スタイルを操作
    containerRef.current.style.gridTemplateRows = `${newTop}px 8px ${newBottom}px`;
  }, []);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    dragState.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const initDrag = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!containerRef.current) return;

    const startY = e.clientY;
    const computedStyle = window.getComputedStyle(containerRef.current);
    const rows = computedStyle.gridTemplateRows.split(' ');
    const topRowHeight = parseFloat(rows[0]);
    const bottomRowHeight = parseFloat(rows[2]);

    dragState.current = {
      startY,
      topRowHeight,
      bottomRowHeight
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, handleMouseUp]);

  // 初期化処理
  useEffect(() => {
    // DOMの準備ができるまで待つ
    const initializeLayout = () => {
      if (!containerRef.current || initialized.current) return;

      const containerHeight = containerRef.current.clientHeight;
      if (containerHeight > 0) {
        const initialHeight = (containerHeight - 8) / 2;
        containerRef.current.style.gridTemplateRows = `${initialHeight}px 8px ${initialHeight}px`;
        initialized.current = true;
        console.log('レイアウト初期化完了:', containerHeight, initialHeight);
      } else {
        // まだコンテナの高さが取得できない場合は再試行
        requestAnimationFrame(initializeLayout);
      }
    };

    initializeLayout();

    // クリーンアップ
    return () => {
      initialized.current = false;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`grid relative ${className}`}
      style={{ gridTemplateRows: "1fr 8px 1fr" }}
      onLoad={() => {
        console.log('コンテナロード完了');
        if (containerRef.current) {
          console.log('コンテナ高さ:', containerRef.current.clientHeight);
        }
      }}
    >
      <div className="overflow-auto">
        {topContent}
      </div>
      <div
        ref={resizerRef}
        onMouseDown={initDrag}
        className="bg-gray-300 cursor-row-resize h-[8px] hover:bg-gray-400 transition-colors z-10"
      />
      <div className="overflow-hidden">
        {bottomContent}
      </div>
    </div>
  );
}