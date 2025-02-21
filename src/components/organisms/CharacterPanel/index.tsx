import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import useFlowStore from '@/stores/flowStore';
import { CharacterForm } from './CharacterForm';
import { useCharacterForm } from '@/hooks/characters/useCharacterForm';
import {
  tableBaseStyle,
  tableHeaderRowStyle,
  tableHeaderCellBaseStyle,
  tableWidthStyles,
} from '@/components/atoms/TableStyles';

interface CharacterPanelProps {
  isEditing: boolean;
}

export const CharacterPanel: React.FC<CharacterPanelProps> = memo(({ isEditing }) => {
  const { t } = useTranslation();
  const { flowData } = useFlowStore();
  const { handleMemberChange } = useCharacterForm();

  if (!flowData) return null;

  return (
    <div className="overflow-x-auto">
      <table className={tableBaseStyle} role="table" aria-label={t('characters')}>
        <thead>
          <tr className={tableHeaderRowStyle} role="row">
            <th
              className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.sm}`}
              role="columnheader"
              scope="col"
            >
              {t('characterPosition')}
            </th>
            <th
              className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.md}`}
              role="columnheader"
              scope="col"
            >
              {t('characterName')}
            </th>
            <th
              className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.xl}`}
              role="columnheader"
              scope="col"
            >
              {t('characterUsage')}
            </th>
            <th
              className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.xs}`}
              role="columnheader"
              scope="col"
            >
              {t('characterAwakening')}
            </th>
            <th
              className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.lg}`}
              role="columnheader"
              scope="col"
            >
              {t('characterAccessories')}
            </th>
            <th
              className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.lg}`}
              role="columnheader"
              scope="col"
            >
              {t('characterLimitBonus')}
            </th>
          </tr>
        </thead>
        <tbody>
          <CharacterForm
            position="front"
            members={flowData.organization.member.front}
            isEditing={isEditing}
            onMemberChange={handleMemberChange}
          />
          <CharacterForm
            position="back"
            members={flowData.organization.member.back}
            isEditing={isEditing}
            onMemberChange={handleMemberChange}
          />
        </tbody>
      </table>
    </div>
  );
});