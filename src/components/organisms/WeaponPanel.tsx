import React from 'react';
import useFlowStore from '@/stores/flowStore';
import type { Weapon, WeaponSkillEffect, WeaponSkillTotal } from '@/types/models';
import { textInputBaseStyle, textareaBaseStyle, useAutoResizeTextArea } from '@/components/atoms/IconTextButton';
import { useTranslation } from 'react-i18next';

interface WeaponPanelProps {
  isEditing: boolean;
}

export const WeaponPanel: React.FC<WeaponPanelProps> = ({ isEditing }) => {
  const { t } = useTranslation();
  const { flowData, updateFlowData } = useFlowStore();

  if (!flowData) return null;

  const handleWeaponChange = (type: 'main' | 'other' | 'additional', index: number | null, field: keyof Weapon, value: string | WeaponSkillEffect) => {
    if (!flowData) return;

    const newWeapon = {
      ...((type === 'main' ? flowData.organization.weapon.main :
          type === 'other' ? flowData.organization.weapon.other[index!] :
          flowData.organization.weapon.additional[index!])),
      [field]: value
    };

    let newWeaponData;
    if (type === 'main') {
      newWeaponData = {
        ...flowData.organization.weapon,
        main: newWeapon
      };
    } else if (type === 'other') {
      const newOther = [...flowData.organization.weapon.other];
      newOther[index!] = newWeapon;
      newWeaponData = {
        ...flowData.organization.weapon,
        other: newOther
      };
    } else {
      const newAdditional = [...flowData.organization.weapon.additional];
      newAdditional[index!] = newWeapon;
      newWeaponData = {
        ...flowData.organization.weapon,
        additional: newAdditional
      };
    }

    updateFlowData({
      organization: {
        ...flowData.organization,
        weapon: newWeaponData
      }
    });
  };

  const handleSkillEffectChange = (type: 'main' | 'other' | 'additional', index: number | null, field: keyof WeaponSkillEffect, value: string) => {
    if (!flowData) return;

    let targetWeapon: Weapon;
    if (type === 'main') {
      targetWeapon = flowData.organization.weapon.main;
    } else if (type === 'other') {
      targetWeapon = flowData.organization.weapon.other[index!];
    } else {
      targetWeapon = flowData.organization.weapon.additional[index!];
    }

    const newSkillEffects = {
      ...targetWeapon.skillEffects,
      [field]: value
    };

    handleWeaponChange(type, index, 'skillEffects', newSkillEffects);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 w-24">{t('weaponCategory')}</th>
            <th className="border p-2 w-40">{t('weaponName')}</th>
            <th className="border p-2 min-w-[200px]">{t('weaponAdditionalSkill')}</th>
            <th className="border p-2 min-w-[300px]">{t('overview')}</th>
          </tr>
        </thead>
        <tbody>
          {/* メイン武器 */}
          <tr>
            <td className="border p-2">{t('weaponMain')}</td>
            <td className="border p-2">
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
            <td className="border p-2">
              {isEditing ? (
                <textarea
                  ref={useAutoResizeTextArea(flowData.organization.weapon.main.additionalSkill)}
                  value={flowData.organization.weapon.main.additionalSkill}
                  onChange={(e) => handleWeaponChange('main', null, 'additionalSkill', e.target.value)}
                  className={textareaBaseStyle}
                />
              ) : (
                flowData.organization.weapon.main.additionalSkill.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < flowData.organization.weapon.main.additionalSkill.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))
              )}
            </td>
            <td className="border p-2">
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
                <td className="border p-2" rowSpan={flowData.organization.weapon.other.length}>
                  {t('weaponNormal')}
                </td>
              )}
              <td className="border p-2">
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
              <td className="border p-2">
                {isEditing ? (
                  <textarea
                    ref={useAutoResizeTextArea(weapon.additionalSkill)}
                    value={weapon.additionalSkill}
                    onChange={(e) => handleWeaponChange('other', index, 'additionalSkill', e.target.value)}
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
              <td className="border p-2">
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
                <td className="border p-2" rowSpan={flowData.organization.weapon.additional.length}>
                  {t('weaponAdditional')}
                </td>
              )}
              <td className="border p-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={weapon.name}
                    onChange={(e) => handleWeaponChange('additional', index, 'name', e.target.value)}
                    className={textInputBaseStyle}
                  />
                ) : (
                  weapon.name
                )}
              </td>
              <td className="border p-2">
                {isEditing ? (
                  <textarea
                    ref={useAutoResizeTextArea(weapon.additionalSkill)}
                    value={weapon.additionalSkill}
                    onChange={(e) => handleWeaponChange('additional', index, 'additionalSkill', e.target.value)}
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
              <td className="border p-2">
                {isEditing ? (
                  <textarea
                    ref={useAutoResizeTextArea(weapon.note)}
                    value={weapon.note}
                    onChange={(e) => handleWeaponChange('additional', index, 'note', e.target.value)}
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

      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">{t('skillEffects')}</h3>
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">{t('skill')}</th>
              <th className="border p-2">{t('effectAmount')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">{t('taRate')}</td>
              <td className="border p-2">
                {isEditing ? (
                  <textarea
                    ref={useAutoResizeTextArea(flowData.organization.weapon.main.skillEffects.taRate)}
                    value={flowData.organization.weapon.main.skillEffects.taRate}
                    onChange={(e) => handleSkillEffectChange('main', null, 'taRate', e.target.value)}
                    className={textareaBaseStyle}
                  />
                ) : (
                  flowData.organization.weapon.main.skillEffects.taRate.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < flowData.organization.weapon.main.skillEffects.taRate.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))
                )}
              </td>
            </tr>
            <tr>
              <td className="border p-2">HP</td>
              <td className="border p-2">
                {isEditing ? (
                  <textarea
                    ref={useAutoResizeTextArea(flowData.organization.weapon.main.skillEffects.hp)}
                    value={flowData.organization.weapon.main.skillEffects.hp}
                    onChange={(e) => handleSkillEffectChange('main', null, 'hp', e.target.value)}
                    className={textareaBaseStyle}
                  />
                ) : (
                  flowData.organization.weapon.main.skillEffects.hp.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < flowData.organization.weapon.main.skillEffects.hp.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))
                )}
              </td>
            </tr>
            <tr>
              <td className="border p-2">{t('defense')}</td>
              <td className="border p-2">
                {isEditing ? (
                  <textarea
                    ref={useAutoResizeTextArea(flowData.organization.weapon.main.skillEffects.defense)}
                    value={flowData.organization.weapon.main.skillEffects.defense}
                    onChange={(e) => handleSkillEffectChange('main', null, 'defense', e.target.value)}
                    className={textareaBaseStyle}
                  />
                ) : (
                  flowData.organization.weapon.main.skillEffects.defense.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < flowData.organization.weapon.main.skillEffects.defense.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};