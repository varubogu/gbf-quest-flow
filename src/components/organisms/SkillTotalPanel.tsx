import React from 'react';
import useFlowStore from '@/stores/flowStore';
import { useTranslation } from 'react-i18next';
import type { WeaponSkillTotal } from '@/types/models';
import { SkillTable } from '@/components/molecules/SkillTable';

interface SkillTotalPanelProps {
  isEditing: boolean;
}

export const SkillTotalPanel: React.FC<SkillTotalPanelProps> = ({ isEditing }) => {
  const { t } = useTranslation();
  const { flowData, updateFlowData } = useFlowStore();

  if (!flowData) return null;

  const handleSkillTotalChange = (field: keyof WeaponSkillTotal, value: string) => {
    if (!flowData) return;

    const newSkillTotal = {
      ...flowData.organization.weapon.main.skillTotal,
      [field]: value
    };

    updateFlowData({
      organization: {
        ...flowData.organization,
        weapon: {
          ...flowData.organization.weapon,
          main: {
            ...flowData.organization.weapon.main,
            skillTotal: newSkillTotal
          }
        }
      }
    });
  };

  return (
    <div>
      <SkillTable
        isEditing={isEditing}
        title={t('skillTotals')}
        values={flowData.organization.weapon.main.skillTotal}
        onChange={handleSkillTotalChange}
      />
    </div>
  );
};