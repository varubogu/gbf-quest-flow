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
    if (!flowData || !updateFlowData) return;

    const newSkillTotal = {
      ...flowData.organization.totalEffects,
      [field]: value,
    };

    updateFlowData({
      ...flowData,
      organization: {
        ...flowData.organization,
        totalEffects: newSkillTotal,
      },
    });
  };

  return (
    <div>
      <SkillTable
        title={t('skillTotals')}
        values={flowData.organization.totalEffects}
        onChange={handleSkillTotalChange}
        isEditing={isEditing}
      />
    </div>
  );
};
