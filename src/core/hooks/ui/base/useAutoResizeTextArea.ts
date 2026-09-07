import { useEffect, useRef, type RefObject } from 'react';

function getScrollableParent(element: HTMLElement): HTMLElement | Window {
  let parent = element.parentElement;
  while (parent) {
    const { overflowY } = window.getComputedStyle(parent);
    if (overflowY === 'auto' || overflowY === 'scroll') {
      return parent;
    }
    parent = parent.parentElement;
  }
  return window;
}

/**
 * テキストエリアの高さを内容に応じて自動調整する。
 * ページジャンプを防ぐため、最寄りのスクロール容器の位置を復元する。
 */
export const useAutoResizeTextArea = (
  value: string,
  minHeight: string = 'auto'
): RefObject<HTMLTextAreaElement | null> => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const scroller = getScrollableParent(textarea);
    const isWindowScroller = scroller === window;
    const scrollPos = isWindowScroller ? window.scrollY : (scroller as HTMLElement).scrollTop;

    textarea.style.height = minHeight;
    textarea.style.height = `${textarea.scrollHeight}px`;

    if (isWindowScroller) {
      window.scrollTo(0, scrollPos);
    } else {
      (scroller as HTMLElement).scrollTop = scrollPos;
    }
  }, [value, minHeight]);

  return textareaRef;
};
