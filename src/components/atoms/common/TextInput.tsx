import * as React from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * テキスト入力フィールドのプロパティ
 * @extends React.InputHTMLAttributes<HTMLInputElement> - 標準のinput要素のプロパティを継承
 */
export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
  /**
   * 入力フィールドの右側に表示するアイコンやボタン
   * 検索アイコンやクリアボタンなどを配置できます
   */
  rightElement?: React.ReactNode;
}

/**
 * 単一行のテキスト入力コンポーネント
 *
 * エラー表示機能や右側に要素を配置する機能を持つ拡張されたテキスト入力フィールドです。
 *
 * @example
 * ```tsx
 * <TextInput
 *   placeholder="ユーザー名を入力"
 *   error={hasError}
 *   errorMessage="ユーザー名は必須です"
 *   rightElement={<SearchIcon />}
 * />
 * ```
 */
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, error, errorMessage, rightElement, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          ref={ref}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            {
              'border-destructive focus-visible:ring-destructive': error,
            },
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">{rightElement}</div>
        )}
        {error && errorMessage && (
          <p className="mt-1 text-xs text-destructive">{errorMessage}</p>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';