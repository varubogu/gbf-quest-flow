import type { Flow, Job, JobAbility, JobEquipment } from '@/types/types';
import { updateFlowData } from '@/core/facades/flowFacade';
import useFlowStore from '@/core/stores/flowStore';
import type { FlowStore } from '@/types/flowStore.types';

export const useJobPanelHandlers = (): {
  flowData: Flow;
  handleJobChange: (_field: keyof Job, _value: string) => void;
  handleEquipmentChange: (_field: keyof JobEquipment, _value: string) => void;
  handleAbilityChange: (_index: number, _field: keyof JobAbility, _value: string) => void;
} => {
  const flowData = useFlowStore((state: FlowStore) => state.flowData) as Flow;

  const handleJobChange = (field: keyof Job, value: string): void => {
    if (!flowData) return;
    updateFlowData({
      organization: {
        ...flowData.organization,
        job: {
          ...flowData.organization.job,
          [field]: value,
        },
      },
    });
  };

  const handleEquipmentChange = (field: keyof JobEquipment, value: string): void => {
    if (!flowData) return;
    updateFlowData({
      organization: {
        ...flowData.organization,
        job: {
          ...flowData.organization.job,
          equipment: {
            ...flowData.organization.job.equipment,
            [field]: value,
          },
        },
      },
    });
  };

  const handleAbilityChange = (index: number, field: keyof JobAbility, value: string): void => {
    if (!flowData) return;
    const newAbilities = [...flowData.organization.job.abilities];
    newAbilities[index] = {
      name: '',
      note: '',
      ...newAbilities[index],
      [field]: value,
    };

    updateFlowData({
      organization: {
        ...flowData.organization,
        job: {
          ...flowData.organization.job,
          abilities: newAbilities,
        },
      },
    });
  };

  return {
    flowData,
    handleJobChange,
    handleEquipmentChange,
    handleAbilityChange
  };
};