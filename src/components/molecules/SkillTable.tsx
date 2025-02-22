import React from 'react';
import { useTranslation } from 'react-i18next';
import type { WeaponSkillEffect, WeaponSkillTotal } from '@/types/models';
import { useAutoResizeTextArea } from '@/hooks/useAutoResizeTextArea';
import { textareaBaseStyle } from '@/components/atoms/IconTextButton';
import {
  tableBaseStyle,
  tableHeaderRowStyle,
  tableHeaderCellBaseStyle,
  tableCellBaseStyle,
  tableWidthStyles,
} from '@/components/atoms/TableStyles';

interface SkillTableProps {
  isEditing: boolean;
  titleKey: string;
  values: WeaponSkillEffect | WeaponSkillTotal;
  onChange: (_field: keyof (WeaponSkillEffect | WeaponSkillTotal), _value: string) => void;
}

export const SkillTable: React.FC<SkillTableProps> = ({ isEditing, titleKey, values, onChange }) => {
  const { t } = useTranslation();

  // フックをトップレベルで直接呼び出す
  const taRateRef = useAutoResizeTextArea(values.taRate);
  const hpRef = useAutoResizeTextArea(values.hp);
  const defenseRef = useAutoResizeTextArea(values.defense);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">{t(titleKey)}</h3>
      <table className={tableBaseStyle}>
        <thead>
          <tr className={tableHeaderRowStyle}>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles['1/4']}`}>
              {t('skill')}
            </th>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles['3/4']}`}>
              {t('effectAmount')}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={tableCellBaseStyle}>{t('taRate')}</td>
            <td className={tableCellBaseStyle}>
              {isEditing ? (
                <textarea
                  ref={taRateRef}
                  value={values.taRate}
                  onChange={(e) => onChange('taRate', e.target.value)}
                  className={textareaBaseStyle}
                />
              ) : (
                values.taRate.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < values.taRate.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))
              )}
            </td>
          </tr>
          <tr>
            <td className={tableCellBaseStyle}>HP</td>
            <td className={tableCellBaseStyle}>
              {isEditing ? (
                <textarea
                  ref={hpRef}
                  value={values.hp}
                  onChange={(e) => onChange('hp', e.target.value)}
                  className={textareaBaseStyle}
                />
              ) : (
                values.hp.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < values.hp.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))
              )}
            </td>
          </tr>
          <tr>
            <td className={tableCellBaseStyle}>{t('defense')}</td>
            <td className={tableCellBaseStyle}>
              {isEditing ? (
                <textarea
                  ref={defenseRef}
                  value={values.defense}
                  onChange={(e) => onChange('defense', e.target.value)}
                  className={textareaBaseStyle}
                />
              ) : (
                values.defense.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < values.defense.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
