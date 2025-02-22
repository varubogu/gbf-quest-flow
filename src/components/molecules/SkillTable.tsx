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

type SkillValue = WeaponSkillEffect | WeaponSkillTotal;
type SkillField = keyof SkillValue;

interface SkillRowProps {
  field: SkillField;
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (_field: SkillField, _value: string) => void;
}

const SkillRow: React.FC<SkillRowProps> = ({ field, label, value, isEditing, onChange }) => {
  const textareaRef = useAutoResizeTextArea(value);

  return (
    <tr>
      <td className={tableCellBaseStyle}>{label}</td>
      <td className={tableCellBaseStyle}>
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            className={textareaBaseStyle}
          />
        ) : (
          value.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < value.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))
        )}
      </td>
    </tr>
  );
};

interface SkillTableProps {
  isEditing: boolean;
  titleKey: string;
  values: SkillValue;
  onChange: (_field: SkillField, _value: string) => void;
}

export const SkillTable: React.FC<SkillTableProps> = ({ isEditing, titleKey, values, onChange }) => {
  const { t } = useTranslation();

  const skillRows: { field: SkillField; labelKey: string }[] = [
    { field: 'taRate', labelKey: 'taRate' },
    { field: 'hp', labelKey: 'hp' },
    { field: 'defense', labelKey: 'defense' },
  ];

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
          {skillRows.map(({ field, labelKey }) => (
            <SkillRow
              key={field}
              field={field}
              label={t(labelKey)}
              value={values[field]}
              isEditing={isEditing}
              onChange={onChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
