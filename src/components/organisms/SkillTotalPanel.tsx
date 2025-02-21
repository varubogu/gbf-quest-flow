import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { WeaponSkillTotal } from '@/types/models';
import useFlowStore from '@/stores/flowStore';
import { SkillTable } from '@/components/molecules/SkillTable';

interface SkillTotalPanelProps {
  isEditing: boolean;
}

export const SkillTotalPanel: React.FC<SkillTotalPanelProps> = ({ isEditing }) => {
  const { t } = useTranslation();
  const { flowData, updateFlowData } = useFlowStore();

  // メモ化されたスキル総合値データを作成
  const skillTotalData = useMemo(() => {
    if (!flowData) return null;
    return {
      ...flowData.organization.totalEffects,
    };
  }, [flowData]);

  if (!flowData || !skillTotalData) return null;

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
        title={t('totalAmount', { ns: 'weapon' })}
        values={skillTotalData}
        onChange={handleSkillTotalChange}
        isEditing={isEditing}
      />
    </div>
  );
};
