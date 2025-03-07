import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { TextInput } from '@/components/atoms/common/TextInput';
import type { TextInputProps } from '@/components/atoms/common/TextInput';

/**
 * サジェスト候補アイテムのインターフェース
 */
export interface SuggestItem {
  /**
   * サジェストアイテムの一意のID
   */
  id: string;
  /**
   * サジェストアイテムの表示名
   */
  label: string;
}

// TextInputPropsからonChangeとonSelectを除外した型を作成
type TextInputPropsWithoutOnChange = Omit<TextInputProps, 'onChange' | 'onSelect'>;

/**
 * サジェスト機能付きテキスト入力コンポーネントのプロパティ
 * @extends TextInputPropsWithoutOnChange - TextInputPropsからonChangeとonSelectを除外した型
 */
export interface SuggestTextInputProps extends TextInputPropsWithoutOnChange {
  /**
   * サジェスト候補を取得する関数
   * @param query - 入力された文字列
   * @returns サジェスト候補のリスト（同期または非同期）
   */
  onSuggest: (_query: string) => Promise<SuggestItem[]> | SuggestItem[];
  /**
   * 値が変更された時のコールバック
   * @param value - 入力された値
   */
  onChange?: (_value: string) => void;
  /**
   * アイテムが選択された時のコールバック
   * @param item - 選択されたアイテム
   */
  onSelect?: (_item: SuggestItem) => void;
  /**
   * 最大表示サジェスト数
   * @default 5
   */
  maxSuggestions?: number;
  /**
   * サジェストの表示遅延（ミリ秒）
   * @default 300
   */
  debounceMs?: number;
  /**
   * 入力フィールドの初期値
   */
  defaultValue?: string;
  /**
   * サジェストの表示方向を強制的に指定
   * @default 'auto' - 自動的に上下を判断
   */
  dropdownDirection?: 'up' | 'down' | 'auto';
}

/**
 * サジェスト機能付きテキスト入力コンポーネント
 *
 * ユーザーが入力中に候補を表示し、選択できるようにするコンポーネントです。
 * キーボード操作（上下矢印キー、Enter、Escape）とマウス操作でサジェストを選択できます。
 *
 * @example
 * ```tsx
 * <SuggestTextInput
 *   placeholder="都市名を入力"
 *   onSuggest={(query) => fetchCities(query)}
 *   onChange={(value) => setValue(value)}
 *   onSelect={(item) => setSelectedItem(item)}
 * />
 * ```
 */
export const SuggestTextInput = React.forwardRef<HTMLInputElement, SuggestTextInputProps>(
  (
    {
      className,
      onSuggest,
      onChange,
      onSelect,
      maxSuggestions = 5,
      debounceMs = 300,
      defaultValue = '',
      dropdownDirection = 'auto',
      ...props
    },
    ref
  ) => {
    /** 入力フィールドの現在の値 */
    const [inputValue, setInputValue] = React.useState<string>(defaultValue);
    /** サジェスト候補のリスト */
    const [suggestions, setSuggestions] = React.useState<SuggestItem[]>([]);
    /** サジェストドロップダウンの表示状態 */
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    /** 現在ハイライトされているサジェストアイテムのインデックス */
    const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1);
    /** サジェストの表示方向 */
    const [showDropUp, setShowDropUp] = React.useState<boolean>(false);
    /** 入力フィールドへの参照 */
    const inputRef = React.useRef<HTMLInputElement>(null);
    /** サジェストドロップダウンへの参照 */
    const suggestionsRef = React.useRef<HTMLDivElement>(null);
    /** コンポーネントのルート要素への参照 */
    const rootRef = React.useRef<HTMLDivElement>(null);
    /** デバウンスタイマーへの参照 */
    const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    /**
     * 外部refとinternalRefを結合するための関数
     *
     * 外部から渡されたrefと内部で使用するrefを両方適用するためのメモ化された関数
     */
    const combinedRef = React.useMemo(() => {
      return (node: HTMLInputElement) => {
        inputRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      };
    }, [ref]);

    /**
     * 入力値が変更された時の処理
     *
     * 1. 入力値を状態に保存
     * 2. onChangeコールバックを呼び出し
     * 3. デバウンスしてサジェスト候補を取得
     *
     * @param e - 入力変更イベント
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      if (onChange) {
        onChange(value);
      }

      // サジェスト候補を取得
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (value.trim() === '') {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      // デバウンスしてサジェスト候補を取得
      debounceTimerRef.current = setTimeout(async () => {
        try {
          const items = await onSuggest(value);
          setSuggestions(items.slice(0, maxSuggestions));
          setIsOpen(items.length > 0);
          setHighlightedIndex(-1);

          // ドロップダウンの表示方向を決定
          determineDropdownDirection();
        } catch (error) {
          console.error('Failed to fetch suggestions:', error);
          setSuggestions([]);
          setIsOpen(false);
        }
      }, debounceMs);
    };

    /**
     * サジェストアイテムがクリックされた時の処理
     *
     * 1. 選択されたアイテムのラベルを入力値に設定
     * 2. サジェストドロップダウンを閉じる
     * 3. onSelectコールバックを呼び出し
     * 4. onChangeコールバックを呼び出し
     *
     * @param item - 選択されたサジェストアイテム
     */
    const handleSuggestionClick = (item: SuggestItem) => {
      setInputValue(item.label);
      setSuggestions([]);
      setIsOpen(false);

      if (onSelect) {
        onSelect(item);
      }

      if (onChange) {
        onChange(item.label);
      }

      inputRef.current?.focus();
    };

    /**
     * キーボード操作の処理
     *
     * - ArrowDown: 次のサジェストアイテムをハイライト
     * - ArrowUp: 前のサジェストアイテムをハイライト
     * - Enter: ハイライトされたアイテムを選択
     * - Escape: サジェストドロップダウンを閉じる
     *
     * @param e - キーボードイベント
     */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prevIndex) =>
            prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
            const selectedItem = suggestions[highlightedIndex];
            if (selectedItem) {
              handleSuggestionClick(selectedItem);
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
        default:
          break;
      }
    };

    /**
     * ドロップダウンの表示方向を決定する
     * 画面の半分より下にある場合は上方向に表示
     */
    const determineDropdownDirection = React.useCallback(() => {
      if (dropdownDirection !== 'auto') {
        setShowDropUp(dropdownDirection === 'up');
        return;
      }

      if (!rootRef.current) return;

      const rect = rootRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementMiddleY = rect.top + rect.height / 2;

      // 画面の半分より下にある場合は上方向に表示
      setShowDropUp(elementMiddleY > windowHeight / 2);
    }, [dropdownDirection]);

    /**
     * 外部クリックでサジェストを閉じるためのイベントリスナーを設定
     */
    React.useEffect(() => {
      /**
       * ドキュメント上のクリックイベントハンドラ
       * サジェストドロップダウンまたは入力フィールド以外の場所がクリックされたらドロップダウンを閉じる
       *
       * @param e - マウスイベント
       */
      const handleClickOutside = (e: MouseEvent) => {
        if (
          suggestionsRef.current &&
          !suggestionsRef.current.contains(e.target as Node) &&
          inputRef.current &&
          !inputRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    /**
     * コンポーネントがアンマウントされる時にタイマーをクリア
     */
    React.useEffect(() => {
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    }, []);

    /**
     * defaultValueが変更された場合に入力値を更新
     */
    React.useEffect(() => {
      if (defaultValue !== inputValue) {
        setInputValue(defaultValue);
      }
    }, [defaultValue]);

    /**
     * ウィンドウのリサイズ時にドロップダウンの方向を再計算
     */
    React.useEffect(() => {
      const handleResize = () => {
        if (isOpen) {
          determineDropdownDirection();
        }
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [isOpen, determineDropdownDirection]);

    /**
     * サジェストが開かれた時にドロップダウンの方向を計算
     */
    React.useEffect(() => {
      if (isOpen) {
        determineDropdownDirection();
      }
    }, [isOpen, determineDropdownDirection]);

    /**
     * TextInputのonChangeを内部のhandleInputChangeに変換するためのラッパー
     *
     * @param e - 入力変更イベント
     */
    const handleOriginalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleInputChange(e);
    };

    return (
      <div ref={rootRef} className={cn('relative w-full', className)}>
        <TextInput
          ref={combinedRef}
          value={inputValue}
          onChange={handleOriginalInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.trim() !== '' && suggestions.length > 0 && setIsOpen(true)}
          {...props}
        />

        {isOpen && (
          <div
            ref={suggestionsRef}
            className={cn(
              'absolute z-10 w-full overflow-auto rounded-md border border-input bg-background py-1 shadow-md bg-white',
              {
                'bottom-full mb-1': showDropUp,
                'top-full mt-1': !showDropUp
              }
            )}
            style={{ maxHeight: '200px' }}
          >
            {suggestions.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  'cursor-pointer px-3 py-2 text-sm',
                  'hover:bg-accent hover:text-accent-foreground hover:bg-gray-300',
                  {
                    'bg-accent text-accent-foreground': index === highlightedIndex,
                  }
                )}
                onClick={() => handleSuggestionClick(item)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {item.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

SuggestTextInput.displayName = 'SuggestTextInput';