import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import useFlowStore from '@/core/stores/flowStore';
import { useCharacterForm } from '@/core/hooks/domain/characters/useCharacterForm';
import { CharacterForm } from './CharacterForm';
import {
  tableBaseStyle,
  tableHeaderRowStyle,
  tableHeaderCellBaseStyle,
  tableWidthStyles,
} from '@/components/styles/TableStyles';
import type { FlowStore } from '@/types/flowStore.types';

interface CharacterPanelProps {
  isEditing: boolean;
}

export const CharacterPanel: React.FC<CharacterPanelProps> = memo(({ isEditing }) => {
  const { t } = useTranslation();
  const flowData = useFlowStore((state: FlowStore) => state.flowData);
  const { handleMemberChange } = useCharacterForm();

  if (!flowData) return null;

  return (
    <div className="overflow-x-auto">
      <table id="character-table" className={tableBaseStyle} role="table" aria-label={t('characters') as string}>
        <thead>
          <tr className={tableHeaderRowStyle} role="row">
            <th
              className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.sm}`}
              role="columnheader"
              scope="col"
            >
              {t('characterPosition') as string}
            </th>
            <th
              className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.md}`}
              role="columnheader"
              scope="col"
            >
              {t('characterName') as string}
            </th>
            <th
              className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.xl}`}
              role="columnheader"
              scope="col"
            >
              {t('characterUsage') as string}
            </th>
            <th
              className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.xs}`}
              role="columnheader"
              scope="col"
            >
              {t('characterAwakening') as string}
            </th>
            <th
              className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.lg}`}
              role="columnheader"
              scope="col"
            >
              {t('characterAccessories') as string}
            </th>
            <th
              className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.lg}`}
              role="columnheader"
              scope="col"
            >
              {t('characterLimitBonus') as string}
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