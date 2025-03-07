import React, { useMemo, type JSX } from 'react';
import useFlowStore from '@/core/stores/flowStore';
import type { Weapon, WeaponSkillEffect, WeaponType } from '@/types/models';
import { useTranslation } from 'react-i18next';
import { SkillTable } from '@/components/organisms/specific/skills/SkillTable';
import { WeaponIcon } from '@/components/molecules/specific/weapon/WeaponIcon';
import { WeaponNote } from '@/components/molecules/specific/weapon/WeaponNote';
import {
  tableBaseStyle,
  tableHeaderRowStyle,
  tableHeaderCellBaseStyle,
  tableCellBaseStyle,
  tableWidthStyles,
} from '@/components/styles/TableStyles';
import { updateFlowData } from '@/core/facades/flowFacade';
import type { FlowStore } from '@/types/flowStore.types';

interface WeaponPanelProps {
  isEditing: boolean;
}

export function WeaponPanel({ isEditing }: WeaponPanelProps): JSX.Element {
  const { t } = useTranslation();
  const flowData = useFlowStore((state: FlowStore) => state.flowData);

  // メモ化された武器データを作成
  const weaponData = useMemo(() => {
    if (!flowData) return null;
    return {
      main: {
        name: flowData.organization.weapon.main.name,
        note: flowData.organization.weapon.main.note,
        additionalSkill: flowData.organization.weapon.main.additionalSkill,
      } as Weapon,
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
    type: WeaponType,
    index: number | null,
    field: keyof Weapon,
    value: string | WeaponSkillEffect
  ): void => {
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

  const handleSkillEffectChange = (field: keyof WeaponSkillEffect, value: string): void => {
    if (!flowData || !updateFlowData) return;

    const newSkillEffects = {
      ...flowData.organization.weaponEffects,
      [field]: value,
    };

    updateFlowData({
      organization: {
        ...flowData.organization,
        weaponEffects: newSkillEffects,
      },
    });
  };

  return (
    <div id="weapon-panel" className="overflow-x-auto">
      <table id="weapon-table" className={tableBaseStyle}>
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
            <th className={tableCellBaseStyle}>{t('weaponMain')}</th>
            <WeaponIcon
              name={weaponData.main.name}
              isEditing={isEditing}
              onChange={(value) => handleWeaponChange('main', null, 'name', value)}
              aria-label={t('weaponName') as string}
            />
            <WeaponNote
              text={weaponData.main.additionalSkill}
              isEditing={isEditing}
              onChange={(value) => handleWeaponChange('main', null, 'additionalSkill', value)}
              aria-label={t('weaponAdditionalSkill') as string}
            />
            <WeaponNote
              text={weaponData.main.note}
              isEditing={isEditing}
              onChange={(value) => handleWeaponChange('main', null, 'note', value)}
              aria-label={t('overview') as string}
            />
          </tr>

          {/* その他の武器 */}
          {weaponData.other.map((weapon: Weapon, index: number) => (
            <tr key={`other-${index}`}>
              {index === 0 && (
                <th
                  className={tableCellBaseStyle}
                  rowSpan={weaponData.other.length}
                >
                  {t('weaponNormal')}
                </th>
              )}
              <WeaponIcon
                name={weapon.name}
                isEditing={isEditing}
                onChange={(value) => handleWeaponChange('other', index, 'name', value)}
                aria-label={t('weaponName') as string}
              />
              <WeaponNote
                text={weapon.additionalSkill}
                isEditing={isEditing}
                onChange={(value) => handleWeaponChange('other', index, 'additionalSkill', value)}
                aria-label={t('weaponAdditionalSkill') as string}
              />
              <WeaponNote
                text={weapon.note}
                isEditing={isEditing}
                onChange={(value) => handleWeaponChange('other', index, 'note', value)}
                aria-label={t('overview') as string}
              />
            </tr>
          ))}

          {/* 追加武器 */}
          {weaponData.additional.map((weapon: Weapon, index: number) => (
            <tr key={`additional-${index}`}>
              {index === 0 && (
                <th
                  className={tableCellBaseStyle}
                  rowSpan={weaponData.additional.length}
                >
                  {t('weaponAdditional')}
                </th>
              )}
              <WeaponIcon
                name={weapon.name}
                isEditing={isEditing}
                onChange={(value) => handleWeaponChange('additional', index, 'name', value)}
                aria-label={t('weaponName') as string}
              />
              <WeaponNote
                text={weapon.additionalSkill}
                isEditing={isEditing}
                onChange={(value) => handleWeaponChange('additional', index, 'additionalSkill', value)}
                aria-label={t('weaponAdditionalSkill') as string}
              />
              <WeaponNote
                text={weapon.note}
                isEditing={isEditing}
                onChange={(value) => handleWeaponChange('additional', index, 'note', value)}
                aria-label={t('overview') as string}
              />
            </tr>
          ))}
        </tbody>
      </table>

      {/* スキル効果 */}
      <SkillTable
        id="weapon-skill-table"
        isEditing={isEditing}
        titleKey="skillEffects"
        values={weaponData.effects}
        onChange={handleSkillEffectChange}
      />
    </div>
  );
}