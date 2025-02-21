import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Weapon, WeaponData } from '@/types/models';
import {
  textInputBaseStyle,
  textareaBaseStyle,
  useAutoResizeTextArea,
} from '@/components/atoms/IconTextButton';
import {
  tableBaseStyle,
  tableHeaderRowStyle,
  tableHeaderCellBaseStyle,
  tableCellBaseStyle,
  tableWidthStyles,
} from '@/components/atoms/TableStyles';

interface WeaponFormProps {
  isEditing: boolean;
  weapons: WeaponData;
  onWeaponChange: (
    type: 'main' | 'other' | 'additional',
    index: number | null,
    field: keyof Weapon,
    value: string
  ) => void;
}

export const WeaponForm: React.FC<WeaponFormProps> = ({ isEditing, weapons, onWeaponChange }) => {
  const { t } = useTranslation();

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
                  value={weapons.main.name}
                  onChange={(e) => onWeaponChange('main', null, 'name', e.target.value)}
                  className={textInputBaseStyle}
                />
              ) : (
                weapons.main.name
              )}
            </td>
            <td className={tableCellBaseStyle}>
              {isEditing ? (
                <textarea
                  ref={useAutoResizeTextArea(weapons.main.additionalSkill)}
                  value={weapons.main.additionalSkill}
                  onChange={(e) => onWeaponChange('main', null, 'additionalSkill', e.target.value)}
                  className={textareaBaseStyle}
                />
              ) : (
                weapons.main.additionalSkill.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < weapons.main.additionalSkill.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))
              )}
            </td>
            <td className={tableCellBaseStyle}>
              {isEditing ? (
                <textarea
                  ref={useAutoResizeTextArea(weapons.main.note)}
                  value={weapons.main.note}
                  onChange={(e) => onWeaponChange('main', null, 'note', e.target.value)}
                  className={textareaBaseStyle}
                />
              ) : (
                weapons.main.note.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < weapons.main.note.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))
              )}
            </td>
          </tr>

          {/* その他の武器 */}
          {weapons.other.map((weapon, index) => (
            <tr key={`other-${index}`}>
              {index === 0 && (
                <td className={tableCellBaseStyle} rowSpan={weapons.other.length}>
                  {t('weaponNormal')}
                </td>
              )}
              <td className={tableCellBaseStyle}>
                {isEditing ? (
                  <input
                    type="text"
                    value={weapon.name}
                    onChange={(e) => onWeaponChange('other', index, 'name', e.target.value)}
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
                      onWeaponChange('other', index, 'additionalSkill', e.target.value)
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
                    onChange={(e) => onWeaponChange('other', index, 'note', e.target.value)}
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
          {weapons.additional.map((weapon, index) => (
            <tr key={`additional-${index}`}>
              {index === 0 && (
                <td className={tableCellBaseStyle} rowSpan={weapons.additional.length}>
                  {t('weaponAdditional')}
                </td>
              )}
              <td className={tableCellBaseStyle}>
                {isEditing ? (
                  <input
                    type="text"
                    value={weapon.name}
                    onChange={(e) => onWeaponChange('additional', index, 'name', e.target.value)}
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
                      onWeaponChange('additional', index, 'additionalSkill', e.target.value)
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
                    onChange={(e) => onWeaponChange('additional', index, 'note', e.target.value)}
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
    </div>
  );
};