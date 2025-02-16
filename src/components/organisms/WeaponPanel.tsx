import React from 'react';
import useFlowStore from '@/stores/flowStore';
import type { Weapon, WeaponSkillEffect, WeaponSkillTotal } from '@/types/models';
import {
  textInputBaseStyle,
  textareaBaseStyle,
  useAutoResizeTextArea,
} from '@/components/atoms/IconTextButton';
import { useTranslation } from 'react-i18next';
import { SkillTable } from '@/components/molecules/SkillTable';
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

  if (!flowData) return null;

  const handleWeaponChange = (
    type: 'main' | 'other' | 'additional',
    index: number | null,
    field: keyof Weapon,
    value: string | WeaponSkillEffect
  ) => {
    if (!flowData) return;

    const newWeapon = {
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
            <td className={tableCellBaseStyle}>
              {isEditing ? (
                <input
                  type="text"
                  value={flowData.organization.weapon.main.name}
                  onChange={(e) => handleWeaponChange('main', null, 'name', e.target.value)}
                  className={textInputBaseStyle}
                />
              ) : (
                flowData.organization.weapon.main.name
              )}
            </td>
            <td className={tableCellBaseStyle}>
              {isEditing ? (
                <textarea
                  ref={useAutoResizeTextArea(flowData.organization.weapon.main.additionalSkill)}
                  value={flowData.organization.weapon.main.additionalSkill}
                  onChange={(e) =>
                    handleWeaponChange('main', null, 'additionalSkill', e.target.value)
                  }
                  className={textareaBaseStyle}
                />
              ) : (
                flowData.organization.weapon.main.additionalSkill.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i <
                      flowData.organization.weapon.main.additionalSkill.split('\n').length - 1 && (
                      <br />
                    )}
                  </React.Fragment>
                ))
              )}
            </td>
            <td className={tableCellBaseStyle}>
              {isEditing ? (
                <textarea
                  ref={useAutoResizeTextArea(flowData.organization.weapon.main.note)}
                  value={flowData.organization.weapon.main.note}
                  onChange={(e) => handleWeaponChange('main', null, 'note', e.target.value)}
                  className={textareaBaseStyle}
                />
              ) : (
                flowData.organization.weapon.main.note.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < flowData.organization.weapon.main.note.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))
              )}
            </td>
          </tr>

          {/* その他の武器 */}
          {flowData.organization.weapon.other.map((weapon, index) => (
            <tr key={`other-${index}`}>
              {index === 0 && (
                <td
                  className={`${tableCellBaseStyle}`}
                  rowSpan={flowData.organization.weapon.other.length}
                >
                  {t('weaponNormal')}
                </td>
              )}
              <td className={tableCellBaseStyle}>
                {isEditing ? (
                  <input
                    type="text"
                    value={weapon.name}
                    onChange={(e) => handleWeaponChange('other', index, 'name', e.target.value)}
                    className={textInputBaseStyle}
                  />
                ) : (
                  weapon.name
                )}
              </td>
              <td className={tableCellBaseStyle}>
                {isEditing ? (
                  <textarea
                    ref={useAutoResizeTextArea(weapon.additionalSkill)}
                    value={weapon.additionalSkill}
                    onChange={(e) =>
                      handleWeaponChange('other', index, 'additionalSkill', e.target.value)
                    }
                    className={textareaBaseStyle}
                  />
                ) : (
                  weapon.additionalSkill.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < weapon.additionalSkill.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))
                )}
              </td>
              <td className={tableCellBaseStyle}>
                {isEditing ? (
                  <textarea
                    ref={useAutoResizeTextArea(weapon.note)}
                    value={weapon.note}
                    onChange={(e) => handleWeaponChange('other', index, 'note', e.target.value)}
                    className={textareaBaseStyle}
                  />
                ) : (
                  weapon.note.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < weapon.note.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))
                )}
              </td>
            </tr>
          ))}

          {/* 追加武器 */}
          {flowData.organization.weapon.additional.map((weapon, index) => (
            <tr key={`additional-${index}`}>
              {index === 0 && (
                <td
                  className={`${tableCellBaseStyle}`}
                  rowSpan={flowData.organization.weapon.additional.length}
                >
                  {t('weaponAdditional')}
                </td>
              )}
              <td className={tableCellBaseStyle}>
                {isEditing ? (
                  <input
                    type="text"
                    value={weapon.name}
                    onChange={(e) =>
                      handleWeaponChange('additional', index, 'name', e.target.value)
                    }
                    className={textInputBaseStyle}
                  />
                ) : (
                  weapon.name
                )}
              </td>
              <td className={tableCellBaseStyle}>
                {isEditing ? (
                  <textarea
                    ref={useAutoResizeTextArea(weapon.additionalSkill)}
                    value={weapon.additionalSkill}
                    onChange={(e) =>
                      handleWeaponChange('additional', index, 'additionalSkill', e.target.value)
                    }
                    className={textareaBaseStyle}
                  />
                ) : (
                  weapon.additionalSkill.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < weapon.additionalSkill.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))
                )}
              </td>
              <td className={tableCellBaseStyle}>
                {isEditing ? (
                  <textarea
                    ref={useAutoResizeTextArea(weapon.note)}
                    value={weapon.note}
                    onChange={(e) =>
                      handleWeaponChange('additional', index, 'note', e.target.value)
                    }
                    className={textareaBaseStyle}
                  />
                ) : (
                  weapon.note.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < weapon.note.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <SkillTable
        title={t('skillEffects')}
        values={flowData.organization.weaponEffects}
        onChange={handleSkillEffectChange}
        isEditing={isEditing}
      />
    </div>
  );
};
