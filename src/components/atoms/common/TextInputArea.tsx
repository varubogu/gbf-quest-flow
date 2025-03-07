import * as React from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * 複数行テキスト入力フィールドのプロパティ
 * @extends React.TextareaHTMLAttributes<HTMLTextAreaElement> - 標準のtextarea要素のプロパティを継承
 */
export interface TextInputAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * エラー状態を示すフラグ
   * trueの場合、入力フィールドの枠線が赤色になります
   */
  error?: boolean;
  /**
   * エラーメッセージ
   * errorがtrueの場合に表示されるメッセージ
   */
  errorMessage?: string;
}

/**
 * 複数行のテキスト入力コンポーネント
 *
 * エラー表示機能を持つ拡張された複数行テキスト入力フィールドです。
 * 垂直方向にリサイズ可能で、最小高さが設定されています。
 *
 * @example
 * ```tsx
 * <TextInputArea
 *   placeholder="コメントを入力"
 *   rows={5}
 *   error={hasError}
 *   errorMessage="コメントは必須です"
 * />
 * ```
 */
export const TextInputArea = React.forwardRef<HTMLTextAreaElement, TextInputAreaProps>(
  ({ className, error, errorMessage, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'resize-vertical',
            {
              'border-destructive focus-visible:ring-destructive': error,
            },
            className
          )}
          {...props}
        />
        {error && errorMessage && (
          <p className="mt-1 text-xs text-destructive">{errorMessage}</p>
        )}
      </div>
    );
  }
);

TextInputArea.displayName = 'TextInputArea';