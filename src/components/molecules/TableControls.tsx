import * as React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TableControlsProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  buttonPosition?: 'top' | 'bottom' | 'both';
  className?: string;
}

export function TableControls({
  onMoveUp,
  onMoveDown,
  buttonPosition = 'both',
  className = '',
}: TableControlsProps) {
  const { t } = useTranslation();
  const showTop = buttonPosition === 'top' || buttonPosition === 'both';
  const showBottom = buttonPosition === 'bottom' || buttonPosition === 'both';

  return (
    <div className={`flex flex-col items-center justify-center gap-2 p-2 ${className}`}>
      {showTop && (
        <button
          onClick={onMoveUp}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
          title={t('action.moveUp')}
          aria-label={t('action.moveUp')}
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
      {showBottom && (
        <button
          onClick={onMoveDown}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
          title={t('action.moveDown')}
          aria-label={t('action.moveDown')}
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}