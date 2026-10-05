import React, { useCallback } from 'react';
import { SuggestTextInput, type SuggestItem } from '@/components/molecules/common/SuggestTextInput';
import { cn } from '@/lib/utils/cn';
import { textInputBaseStyle } from '@/components/atoms/common/IconTextButton';

interface HybridSuggestInputProps {
  value: string;
  onChange: (_value: string) => void;
  onSuggest: (_query: string) => SuggestItem[] | Promise<SuggestItem[]>;
  onSelectItem?: (_item: SuggestItem) => void;
  onRemember?: (_value: string) => void;
  className?: string;
  'aria-label'?: string;
  maxLength?: number;
  placeholder?: string;
  debounceMs?: number;
  maxSuggestions?: number;
}

/**
 * 自由入力と候補選択を両立する入力。候補に無い文字列もそのまま確定できる。
 */
export const HybridSuggestInput: React.FC<HybridSuggestInputProps> = ({
  value,
  onChange,
  onSuggest,
  onSelectItem,
  onRemember,
  className,
  maxLength,
  placeholder,
  debounceMs = 120,
  maxSuggestions = 8,
  'aria-label': ariaLabel,
}) => {
  const handleSelect = useCallback(
    (item: SuggestItem) => {
      onChange(item.label);
      onSelectItem?.(item);
      onRemember?.(item.label);
    },
    [onChange, onSelectItem, onRemember]
  );

  const handleChange = useCallback(
    (next: string) => {
      onChange(next);
    },
    [onChange]
  );

  const handleBlur = useCallback(() => {
    onRemember?.(value);
  }, [onRemember, value]);

  return (
    <SuggestTextInput
      defaultValue={value}
      onChange={handleChange}
      onSuggest={onSuggest}
      onSelect={handleSelect}
      onBlur={handleBlur}
      showOnFocus
      debounceMs={debounceMs}
      maxSuggestions={maxSuggestions}
      maxLength={maxLength}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className={cn(textInputBaseStyle, 'border-0 shadow-none p-0', className)}
    />
  );
};
