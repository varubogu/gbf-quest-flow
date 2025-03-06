import type { Flow, Summon, SummonType } from '@/types/types';
import { updateFlowData } from '@/core/facades/flowFacade';
import useFlowStore from '@/core/stores/flowStore';
import type { FlowStore } from '@/types/flowStore.types';

export const useSummonHandlers = (): {
  flowData: Flow | undefined;
  handleSummonChange: (_type: SummonType, _index: number | null, _field: keyof Summon, _value: string) => void;
} => {
  const flowData = useFlowStore((state: FlowStore) => state.flowData);

  const handleSummonChange = (type: SummonType, index: number | null, field: keyof Summon, value: string): void => {
    if (!flowData) return;

    let newSummonData;
    if (type === 'main') {
      newSummonData = {
        ...flowData.organization.summon,
        main: {
          ...flowData.organization.summon.main,
          [field]: value,
        },
      };
    } else if (type === 'friend') {
      newSummonData = {
        ...flowData.organization.summon,
        friend: {
          ...flowData.organization.summon.friend,
          [field]: value,
        },
      };
    } else if (type === 'other' && index !== null) {
      const newOther = [...flowData.organization.summon.other];
      const currentSummon = newOther[index];
      if (currentSummon) {
        newOther[index] = {
          ...currentSummon,
          [field]: value,
        };
      }
      newSummonData = {
        ...flowData.organization.summon,
        other: newOther,
      };
    } else if (type === 'sub' && index !== null) {
      const newSub = [...flowData.organization.summon.sub];
      const currentSummon = newSub[index];
      if (currentSummon) {
        newSub[index] = {
          ...currentSummon,
          [field]: value,
        };
      }
      newSummonData = {
        ...flowData.organization.summon,
        sub: newSub,
      };
    }

    if (newSummonData) {
      updateFlowData({
        organization: {
          ...flowData.organization,
          summon: newSummonData,
        },
      });
    }
  };

  return {
    flowData,
    handleSummonChange
  };
};