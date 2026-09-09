import React, { type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import {
  tableBaseStyle,
  tableHeaderRowStyle,
  tableHeaderCellBaseStyle,
  tableWidthStyles,
} from '@/components/styles/TableStyles';
import { useJobPanelHandlers } from '@/core/hooks/ui/specific/useJobPanelHandlers';
import { AbilityRow } from '@/components/molecules/specific/AbilityRow';
import { JobInfoPanel } from '@/components/molecules/specific/JobInfoPanel';
import { JobEquipmentPanel } from '@/components/molecules/specific/JobEquipmentPanel';

interface JobPanelProps {
  isEditing: boolean;
}

export function JobPanel({ isEditing }: JobPanelProps): JSX.Element | null {
  const { t } = useTranslation();
  const {
    flowData,
    handleJobChange,
    handleJobSelect,
    handleEquipmentChange,
    handleAbilityChange,
    handleAbilitySelect,
  } = useJobPanelHandlers();

  if (!flowData) return null;

  return (
    <div id="job-panel" className="overflow-x-auto">
      <table className={tableBaseStyle}>
        <thead>
          <tr className={tableHeaderRowStyle}>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.sm}`}>{t('jobItem')}</th>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.md}`}>
              {t('jobValue')}
            </th>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.xl}`}>
              {t('overview')}
            </th>
          </tr>
        </thead>
        <tbody>
          {/* ジョブ情報 */}
          <JobInfoPanel
            job={flowData.organization.job}
            isEditing={isEditing}
            onJobChange={handleJobChange}
            onJobSelect={(item) => handleJobSelect(item.label, item.id)}
          />

          {/* 特殊装備情報 */}
          <JobEquipmentPanel
            equipment={flowData.organization.job.equipment}
            isEditing={isEditing}
            onEquipmentChange={handleEquipmentChange}
          />

          {/* アビリティ情報 */}
          {flowData.organization.job.abilities.map((ability, index) => (
            <AbilityRow
              key={`ability-${index}`}
              ability={ability}
              index={index}
              isEditing={isEditing}
              totalAbilities={flowData.organization.job.abilities.length}
              jobKey={flowData.organization.job.key || flowData.organization.job.name}
              onAbilityChange={handleAbilityChange}
              onAbilitySelect={(abilityIndex, item) =>
                handleAbilitySelect(abilityIndex, item.label, item.id)
              }
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
