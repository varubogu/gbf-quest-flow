import { useCallback } from 'react';
import useFlowStore from '@/stores/flowStore';
import type { Summon } from '@/types/models';
import { updateSummonField, updateSummonArrayField } from '@/utils/summons/calculations';

export interface UseSummonFormResult {
  handleSummonChange: (_type: 'main' | 'friend' | 'other' | 'sub', _index: number | null, _field: keyof Summon, _value: string) => void;
}

export const useSummonForm = (): UseSummonFormResult => {
  const { flowData, updateFlowData } = useFlowStore();

  const handleSummonChange = useCallback(
    (type: 'main' | 'friend' | 'other' | 'sub', index: number | null, field: keyof Summon, value: string) => {
      if (!flowData) return;

      let newSummonData;
      if (type === 'main') {
        newSummonData = {
          ...flowData.organization.summon,
          main: updateSummonField(flowData.organization.summon.main, field, value),
        };
      } else if (type === 'friend') {
        newSummonData = {
          ...flowData.organization.summon,
          friend: updateSummonField(flowData.organization.summon.friend, field, value),
        };
      } else if (type === 'other') {
        const newOther = updateSummonArrayField(
          flowData.organization.summon.other,
          index!,
          field,
          value
        );
        newSummonData = {
          ...flowData.organization.summon,
          other: newOther,
        };
      } else {
        const newSub = updateSummonArrayField(
          flowData.organization.summon.sub,
          index!,
          field,
          value
        );
        newSummonData = {
          ...flowData.organization.summon,
          sub: newSub,
        };
      }

      updateFlowData({
        organization: {
          ...flowData.organization,
          summon: newSummonData,
        },
      });
    },
    [flowData, updateFlowData]
  );

  return {
    handleSummonChange,
  };
};