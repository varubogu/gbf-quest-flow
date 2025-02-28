import { useCallback } from 'react';
import useFlowStoreFacade from '@/core/facades/flowStoreFacade';
import type { Member, CharacterPosition } from '@/types/types';
import { updateMemberField } from '@/lib/utils/characters/calculations';

interface UseCharacterFormResult {
  handleMemberChange: (
    _position: CharacterPosition,
    _index: number,
    _field: keyof Member,
    _value: string
  ) => void;
}

export const useCharacterForm = (): UseCharacterFormResult => {
  const flowData = useFlowStoreFacade((state) => state.flowData);
  const updateFlowData = useFlowStoreFacade((state) => state.updateFlowData);

  const handleMemberChange = useCallback(
    (position: CharacterPosition,
      index: number,
      field: keyof Member,
      value: string
    ) => {
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