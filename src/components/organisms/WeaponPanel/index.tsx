import React, { useMemo } from 'react';
import useFlowStore from '@/stores/flowStore';
import type { Weapon, WeaponSkillEffect } from '@/types/models';
import { useTranslation } from 'react-i18next';
import { SkillTable } from '@/components/molecules/SkillTable';
import { WeaponIcon } from '@/components/molecules/Weapon/WeaponIcon';
import { WeaponNote } from '@/components/molecules/Weapon/WeaponNote';
import {
  tableBaseStyle,
  tableHeaderRowStyle,
  tableHeaderCellBaseStyle,
  tableCellBaseStyle,
  tableWidthStyles,
} from '@/components/atoms/TableStyles';

interface WeaponPanelProps {
  isEditing: boolean;
}

export const WeaponPanel: React.FC<WeaponPanelProps> = ({ isEditing }) => {
  const { t } = useTranslation();
  const { flowData, updateFlowData } = useFlowStore();

  // メモ化された武器データを作成
  const weaponData = useMemo(() => {
    if (!flowData) return null;
    return {
      main: {
        name: flowData.organization.weapon.main.name,
        note: flowData.organization.weapon.main.note,
        additionalSkill: flowData.organization.weapon.main.additionalSkill,
      },
      other: flowData.organization.weapon.other.map(weapon => ({
        name: weapon.name,
        note: weapon.note,
        additionalSkill: weapon.additionalSkill,
      })),
      additional: flowData.organization.weapon.additional.map(weapon => ({
        name: weapon.name,
        note: weapon.note,
        additionalSkill: weapon.additionalSkill,
      })),
      effects: flowData.organization.weaponEffects,
    };
  }, [flowData]);

  if (!flowData || !weaponData) return null;

  const handleWeaponChange = (
    type: 'main' | 'other' | 'additional',
    index: number | null,
    field: keyof Weapon,
    value: string | WeaponSkillEffect
  ) => {
    if (!flowData) return;

    let newWeaponData;
    if (type === 'main') {
      newWeaponData = {
        ...flowData.organization.weapon,
        main: {
          name: flowData.organization.weapon.main.name,
          note: flowData.organization.weapon.main.note,
          additionalSkill: flowData.organization.weapon.main.additionalSkill,
          [field]: value,
        },
      };
    } else if (type === 'other' && index !== null) {
      const newOther = [...flowData.organization.weapon.other];
      const currentWeapon = newOther[index];
      if (currentWeapon) {
        newOther[index] = {
          name: currentWeapon.name,
          note: currentWeapon.note,
          additionalSkill: currentWeapon.additionalSkill,
          [field]: value,
        };
      }
      newWeaponData = {
        ...flowData.organization.weapon,
        other: newOther,
      };
    } else if (type === 'additional' && index !== null) {
      const newAdditional = [...flowData.organization.weapon.additional];
      const currentWeapon = newAdditional[index];
      if (currentWeapon) {
        newAdditional[index] = {
          name: currentWeapon.name,
          note: currentWeapon.note,
          additionalSkill: currentWeapon.additionalSkill,
          [field]: value,
        };
      }
      newWeaponData = {
        ...flowData.organization.weapon,
        additional: newAdditional,
      };
    }

    if (newWeaponData) {
      updateFlowData({
        organization: {
          ...flowData.organization,
          weapon: newWeaponData,
        },
      });
    }
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

  return (
    <div className="overflow-x-auto">
      <table className={tableBaseStyle}>
        <thead>
          <tr className={tableHeaderRowStyle}>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.sm}`}>
              {t('weaponCategory')}
            </th>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.md}`}>
              {t('weaponName')}
            </th>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.lg}`}>
              {t('weaponAdditionalSkill')}
            </th>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.xl}`}>
              {t('overview')}
            </th>
          </tr>
        </thead>
        <tbody>
          {/* メイン武器 */}
          <tr>
            <td className={tableCellBaseStyle}>{t('weaponMain')}</td>
            <WeaponIcon
              name={weaponData.main.name}
              isEditing={isEditing}
              onChange={(value) => handleWeaponChange('main', null, 'name', value)}
              aria-label={t('weaponName')}
            />
            <WeaponNote
              text={weaponData.main.additionalSkill}
              isEditing={isEditing}
              onChange={(value) => handleWeaponChange('main', null, 'additionalSkill', value)}
              aria-label={t('weaponAdditionalSkill')}
            />
            <WeaponNote
              text={weaponData.main.note}
              isEditing={isEditing}
              onChange={(value) => handleWeaponChange('main', null, 'note', value)}
              aria-label={t('overview')}
            />
          </tr>

          {/* その他の武器 */}
          {weaponData.other.map((weapon, index) => (
            <tr key={`other-${index}`}>
              {index === 0 && (
                <td
                  className={tableCellBaseStyle}
                  rowSpan={weaponData.other.length}
                >
                  {t('weaponNormal')}
                </td>
              )}
              <WeaponIcon
                name={weapon.name}
                isEditing={isEditing}
                onChange={(value) => handleWeaponChange('other', index, 'name', value)}
                aria-label={t('weaponName')}
              />
              <WeaponNote
                text={weapon.additionalSkill}
                isEditing={isEditing}
                onChange={(value) => handleWeaponChange('other', index, 'additionalSkill', value)}
                aria-label={t('weaponAdditionalSkill')}
              />
              <WeaponNote
                text={weapon.note}
                isEditing={isEditing}
                onChange={(value) => handleWeaponChange('other', index, 'note', value)}
                aria-label={t('overview')}
              />
            </tr>
          ))}

          {/* 追加武器 */}
          {weaponData.additional.map((weapon, index) => (
            <tr key={`additional-${index}`}>
              {index === 0 && (
                <td
                  className={tableCellBaseStyle}
                  rowSpan={weaponData.additional.length}
                >
                  {t('weaponAdditional')}
                </td>
              )}
              <WeaponIcon
                name={weapon.name}
                isEditing={isEditing}
                onChange={(value) => handleWeaponChange('additional', index, 'name', value)}
                aria-label={t('weaponName')}
              />
              <WeaponNote
                text={weapon.additionalSkill}
                isEditing={isEditing}
                onChange={(value) => handleWeaponChange('additional', index, 'additionalSkill', value)}
                aria-label={t('weaponAdditionalSkill')}
              />
              <WeaponNote
                text={weapon.note}
                isEditing={isEditing}
                onChange={(value) => handleWeaponChange('additional', index, 'note', value)}
                aria-label={t('overview')}
              />
            </tr>
          ))}
        </tbody>
      </table>

      {/* スキル効果 */}
      <SkillTable
        isEditing={isEditing}
        titleKey="skillEffects"
        values={weaponData.effects}
        onChange={handleSkillEffectChange}
      />
    </div>
  );
};