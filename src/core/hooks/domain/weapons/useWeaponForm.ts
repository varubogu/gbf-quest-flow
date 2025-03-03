import type { Weapon, WeaponSkillEffect, WeaponType } from '@/types/types';
import useFlowStore from '@/core/stores/flowStore';
import type { FlowStore } from '@/types/flowStore.types';

export interface UseWeaponFormResult {
  handleChange: (
    _type: WeaponType,
    _index: number | null,
    _field: keyof Weapon,
    _value: string | WeaponSkillEffect
  ) => void;
  handleSkillEffectChange: (_field: keyof WeaponSkillEffect, _value: string) => void;
}

export const useWeaponForm = (): UseWeaponFormResult => {
  const flowData = useFlowStore((state: FlowStore) => state.flowData);
  const updateFlowData = useFlowStore((state: FlowStore) => state.updateFlowData);

  const handleChange = (
    type: WeaponType,
    index: number | null,
    field: keyof Weapon,
    value: string | WeaponSkillEffect
  ): void => {
    if (!flowData) return;

    const newWeapon = {
      name: '',
      note: '',
      additionalSkill: '',
      ...(type === 'main'
        ? flowData.organization.weapon.main
        : type === 'other'
          ? flowData.organization.weapon.other[index!]
          : flowData.organization.weapon.additional[index!]),
      [field]: value,
    };

    let newWeaponData;
    if (type === 'main') {
      newWeaponData = {
        ...flowData.organization.weapon,
        main: newWeapon,
      };
    } else if (type === 'other') {
      const newOther = [...flowData.organization.weapon.other];
      newOther[index!] = newWeapon;
      newWeaponData = {
        ...flowData.organization.weapon,
        other: newOther,
      };
    } else {
      const newAdditional = [...flowData.organization.weapon.additional];
      newAdditional[index!] = newWeapon;
      newWeaponData = {
        ...flowData.organization.weapon,
        additional: newAdditional,
      };
    }

    updateFlowData({
      organization: {
        ...flowData.organization,
        weapon: newWeaponData,
      },
    });
  };

  const handleSkillEffectChange = (field: keyof WeaponSkillEffect, value: string): void => {
    if (!flowData || !updateFlowData) return;

    const newSkillEffects = {
      ...flowData.organization.weaponEffects,
      [field]: value,
    };

    updateFlowData({
      ...flowData,
      organization: {
        ...flowData.organization,
        weaponEffects: newSkillEffects,
      },
    });
  };

  return {
    handleChange,
    handleSkillEffectChange,
  };
};