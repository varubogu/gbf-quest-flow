import { useCallback } from 'react';
import useFlowStore from '@/core/stores/flowStore';
import type { FlowStore } from '@/types/flowStore.types';
import type { Summon, SummonType } from '@/types/types';
import { updateSummonField, updateSummonArrayField } from '@/lib/utils/summons/calculations';
import useFlowFacade from '@/core/facades/flowFacade';

interface UseSummonFormResult {
  handleChange: (
    _type: SummonType,
    _index: number | null,
    _field: keyof Summon,
    _value: string
  ) => void;
}

export const useSummonForm = (): UseSummonFormResult => {
  const flowData = useFlowStore((state: FlowStore) => state.flowData);
  const { updateFlowData } = useFlowFacade();

  const handleChange = useCallback(
    (type: SummonType,
      index: number | null,
      field: keyof Summon,
      value: string
    ) => {
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
    handleChange,
  };
};