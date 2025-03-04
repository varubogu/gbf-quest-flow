import { useCallback } from 'react';
import useFlowStore from '@/core/stores/flowStore';
import type { Member } from '@/types/types';
import type { CharacterPosition } from '@/types/models';
import { updateMemberField } from '@/lib/utils/characters/calculations';
import type { FlowStore } from '@/types/flowStore.types';
import { updateFlowData } from '@/core/facades/flowFacade';

interface UseCharacterFormResult {
  handleMemberChange: (
    _position: CharacterPosition,
    _index: number,
    _field: keyof Member,
    _value: string
  ) => void;
}

export const useCharacterForm = (): UseCharacterFormResult => {
  const flowData = useFlowStore((state: FlowStore) => state.flowData);

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
    [flowData]
  );

  return {
    handleMemberChange,
  };
};