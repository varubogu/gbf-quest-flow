import React, { useMemo, type JSX } from 'react';
import type { WeaponSkillTotal } from '@/types/types';
import useFlowStore from '@/core/stores/flowStore';
import { SkillTable } from '@/components/molecules/SkillTable';
import { updateFlowData } from '@/core/facades/flowFacade';
import type { FlowStore } from '@/types/flowStore.types';

interface SkillTotalPanelProps {
  isEditing: boolean;
}

export function SkillTotalPanel({ isEditing }: SkillTotalPanelProps): JSX.Element | null {
  const flowData = useFlowStore((state: FlowStore) => state.flowData);

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
}
