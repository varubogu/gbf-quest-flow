import React, { useMemo } from 'react';
import type { WeaponSkillTotal } from '@/types/types';
import useFlowStore from '@/stores/flowStore';
import { SkillTable } from '@/components/molecules/SkillTable';

interface SkillTotalPanelProps {
  isEditing: boolean;
}

export const SkillTotalPanel: React.FC<SkillTotalPanelProps> = ({ isEditing }) => {
  const { flowData, updateFlowData } = useFlowStore();

  // メモ化されたスキル総合値データを作成
  const skillTotalData = useMemo(() => {
    if (!flowData) return null;
    return {
      ...flowData.organization.totalEffects,
    };
  }, [flowData]);

  if (!flowData || !skillTotalData) return null;

  const handleSkillTotalChange = (field: keyof WeaponSkillTotal, value: string): void => {
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
    <div id="skill-total-panel">
      <SkillTable
        id="skill-total-table"
        isEditing={isEditing}
        titleKey="totalAmount"
        values={skillTotalData}
        onChange={handleSkillTotalChange}
      />
    </div>
  );
};
