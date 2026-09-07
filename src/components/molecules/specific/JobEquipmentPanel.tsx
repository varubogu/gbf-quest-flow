import React from 'react';
import { useTranslation } from 'react-i18next';
import { textareaBaseStyle } from '@/components/atoms/common/IconTextButton';
import { HybridSuggestInput } from '@/components/molecules/common/HybridSuggestInput';
import { rememberName, suggestHistory } from '@/core/facades/suggestFacade';
import { tableCellBaseStyle } from '@/components/styles/TableStyles';
import { useAutoResizeTextArea } from '@/core/hooks/ui/base/useAutoResizeTextArea';
import type { JobEquipment } from '@/types/types';

interface JobEquipmentPanelProps {
  equipment: JobEquipment;
  isEditing: boolean;
  onEquipmentChange: (_field: keyof JobEquipment, _value: string) => void;
}

export const JobEquipmentPanel: React.FC<JobEquipmentPanelProps> = ({
  equipment,
  isEditing,
  onEquipmentChange,
}) => {
  const { t } = useTranslation();
  const equipmentNoteRef = useAutoResizeTextArea(equipment.note);

  return (
    <tr>
      <th className={tableCellBaseStyle}>{t('jobMainHand')}</th>
      <td className={tableCellBaseStyle}>
        {isEditing ? (
          <HybridSuggestInput
            value={equipment.name}
            onChange={(value) => onEquipmentChange('name', value)}
            onSuggest={(query) => suggestHistory('equipment', query)}
            onRemember={(value) => rememberName('equipment', value)}
            aria-label={t('jobMainHand') as string}
          />
        ) : (
          equipment.name
        )}
      </td>
      <td className={tableCellBaseStyle}>
        {isEditing ? (
          <textarea
            ref={equipmentNoteRef}
            value={equipment.note}
            onChange={(e) => onEquipmentChange('note', e.target.value)}
            className={textareaBaseStyle}
          />
        ) : (
          equipment.note.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < equipment.note.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))
        )}
      </td>
    </tr>
  );
};
