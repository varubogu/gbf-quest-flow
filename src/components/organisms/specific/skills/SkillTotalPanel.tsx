import React, { useMemo, type JSX } from 'react';
import type { WeaponSkillTotal } from '@/types/types';
import useFlowStore from '@/core/stores/flowStore';
import { SkillTable } from '@/components/organisms/specific/skills/SkillTable';
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

  // メモ化されたスキル総合値の備考データを作成
  const skillTotalNoteData = useMemo(() => {
    if (!flowData) return null;
    return {
      ...flowData.organization.totalEffectNotes,
    };
  }, [flowData]);

  if (!flowData || !skillTotalData || !skillTotalNoteData) return null;

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

  const handleSkillTotalNoteChange = (field: keyof WeaponSkillTotal, value: string): void => {
    if (!flowData || !updateFlowData) return;

    const newSkillTotalNotes = {
      ...flowData.organization.totalEffectNotes,
      [field]: value,
    };

    updateFlowData({
      organization: {
        ...flowData.organization,
        totalEffectNotes: newSkillTotalNotes,
      },
    });
  };

  const handleSkillTotalRemove = (field: keyof WeaponSkillTotal): void => {
    if (!flowData || !updateFlowData) return;

    const newSkillTotal = { ...flowData.organization.totalEffects };
    delete newSkillTotal[field];

    const newSkillTotalNotes = { ...flowData.organization.totalEffectNotes };
    delete newSkillTotalNotes[field];

    updateFlowData({
      organization: {
        ...flowData.organization,
        totalEffects: newSkillTotal,
        totalEffectNotes: newSkillTotalNotes,
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
        notes={skillTotalNoteData}
        onChange={handleSkillTotalChange}
        onNoteChange={handleSkillTotalNoteChange}
        onRemove={handleSkillTotalRemove}
      />
    </div>
  );
}
