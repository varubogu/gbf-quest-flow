import React, { useMemo } from 'react';
import type { WeaponSkillTotal } from '@/types/types';
import useFlowStoreFacade from '@/core/facades/flowStoreFacade';
import { SkillTable } from '@/components/molecules/SkillTable';

interface SkillTotalPanelProps {
  isEditing: boolean;
}

export const SkillTotalPanel: React.FC<SkillTotalPanelProps> = ({ isEditing }) => {
  const flowData = useFlowStoreFacade((state) => state.flowData);
  const updateFlowData = useFlowStoreFacade((state) => state.updateFlowData);

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
