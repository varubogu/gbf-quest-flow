/**
 * スクリーンリーダーに通知を送信する
 * @param message 通知メッセージ
 * @param type 通知タイプ（'status' または 'alert'）
 */
export function announceToScreenReader(message: string, type: 'status' | 'alert' = 'status'): void {
  const element = document.createElement('div');
  element.setAttribute('role', type);
  element.setAttribute('aria-live', type === 'alert' ? 'assertive' : 'polite');
  element.className = 'sr-only';
  element.textContent = message;
  document.body.appendChild(element);
  setTimeout(() => document.body.removeChild(element), 1000);
}

/**
 * エラーをハンドリングし、スクリーンリーダーに通知する
 * @param error エラーオブジェクト
 * @param context エラーが発生したコンテキスト
 */
export function handleError(error: unknown, context: string): void {
  console.error(`${context}:`, error);
  announceToScreenReader(`${context}にエラーが発生しました`, 'alert');
}