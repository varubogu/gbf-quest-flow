import { useCallback } from 'react';
import useFlowStore from '@/stores/flowStore';
import type { Member } from '@/types/models';
import { updateMemberField } from '@/utils/characters/calculations';

export const useCharacterForm = () => {
  const { flowData, updateFlowData } = useFlowStore();

  const handleMemberChange = useCallback(
    (position: 'front' | 'back', index: number, field: keyof Member, value: string) => {
      if (!flowData) return;

      const members = position === 'front'
        ? flowData.organization.member.front
        : flowData.organization.member.back;

      const newMembers = updateMemberField(members, index, field, value);

      updateFlowData({
        organization: {
          ...flowData.organization,
          member: {
            ...flowData.organization.member,
            [position]: newMembers,
          },
        },
      });
    },
    [flowData, updateFlowData]
  );

  return {
    handleMemberChange,
  };
};