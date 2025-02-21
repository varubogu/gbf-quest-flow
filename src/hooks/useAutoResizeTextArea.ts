import { useEffect, useRef } from 'react';

/**
 * テキストエリアの高さを内容に応じて自動調整するカスタムフック
 * @param value - テキストエリアの値
 * @param minHeight - 最小の高さ（オプション、デフォルト: 'auto'）
 * @returns テキストエリアのref
 */
export const useAutoResizeTextArea = (value: string, minHeight: string = 'auto') => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 現在のスクロール位置を保存
    const scrollPos = window.scrollY;

    // 高さをリセットして実際の高さを計算
    textarea.style.height = minHeight;
    const scrollHeight = textarea.scrollHeight;

    // 新しい高さを設定
    textarea.style.height = `${scrollHeight}px`;

    // スクロール位置を復元（ページのジャンプを防ぐ）
    window.scrollTo(0, scrollPos);
  }, [value, minHeight]);

  return textareaRef;
};