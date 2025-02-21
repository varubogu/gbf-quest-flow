import type { Weapon, WeaponSkillEffect } from '@/types/models';
import useFlowStore from '@/stores/flowStore';

export const useWeaponForm = () => {
  const { flowData, updateFlowData } = useFlowStore();

  const handleWeaponChange = (
    type: 'main' | 'other' | 'additional',
    index: number | null,
    field: keyof Weapon,
    value: string | WeaponSkillEffect
  ) => {
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

  const handleSkillEffectChange = (field: keyof WeaponSkillEffect, value: string) => {
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
    handleWeaponChange,
    handleSkillEffectChange,
  };
};