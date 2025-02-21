import React from 'react';
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

export const CharacterPanel: React.FC<CharacterPanelProps> = ({ isEditing }) => {
  const { t } = useTranslation();
  const { flowData } = useFlowStore();
  const { handleMemberChange } = useCharacterForm();

  if (!flowData) return null;

  return (
    <div className="overflow-x-auto">
      <table className={tableBaseStyle}>
        <thead>
          <tr className={tableHeaderRowStyle}>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.sm}`}>
              {t('characterPosition')}
            </th>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.md}`}>
              {t('characterName')}
            </th>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.xl}`}>
              {t('characterUsage')}
            </th>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.xs}`}>
              {t('characterAwakening')}
            </th>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.lg}`}>
              {t('characterAccessories')}
            </th>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.lg}`}>
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
};