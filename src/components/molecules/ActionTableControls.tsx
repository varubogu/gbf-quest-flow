import * as React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { IconButton } from '../atoms/IconButton';
import { useTranslation } from 'react-i18next';
import type { ActionTableButtonPosition } from '@/types/models';

interface ActionTableControlsProps {
  buttonPosition: ActionTableButtonPosition;
  currentRow: number;
  totalRows: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const ActionTableControls: React.FC<ActionTableControlsProps> = ({
  buttonPosition,
  currentRow,
  totalRows,
  onMoveUp,
  onMoveDown,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center p-2 sticky top-0 bg-white z-20">
      <div className={`flex gap-2 ${buttonPosition === 'right' ? 'ml-auto' : ''}`}>
        <IconButton
          icon={ChevronUp}
          label={t('moveUp') as string}
          onClick={onMoveUp}
          disabled={currentRow <= 0}
        />
        <IconButton
          icon={ChevronDown}
          label={t('moveDown') as string}
          onClick={onMoveDown}
          disabled={currentRow >= totalRows - 1}
        />
      </div>
    </div>
  );
};