import React from 'react';
import { useTranslation } from 'react-i18next';
import type { WeaponSkillEffect, WeaponSkillTotal } from '@/types/models';
import { useAutoResizeTextArea } from '@/components/atoms/IconTextButton';

interface SkillTableProps {
  isEditing: boolean;
  title: string;
  values: WeaponSkillEffect | WeaponSkillTotal;
  onChange: (field: keyof (WeaponSkillEffect | WeaponSkillTotal), value: string) => void;
}

export const SkillTable: React.FC<SkillTableProps> = ({ isEditing, title, values, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">{t('skill')}</th>
            <th className="border p-2">{title === t('skillEffects') ? t('effectAmount') : t('totalAmount')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">{t('taRate')}</td>
            <td className="border p-2">
              {isEditing ? (
                <textarea
                  ref={useAutoResizeTextArea(values.taRate)}
                  value={values.taRate}
                  onChange={(e) => onChange('taRate', e.target.value)}
                  className="w-full p-1 border rounded resize-none overflow-hidden whitespace-pre-wrap break-words min-h-[3rem]"
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
            <td className="border p-2">HP</td>
            <td className="border p-2">
              {isEditing ? (
                <textarea
                  ref={useAutoResizeTextArea(values.hp)}
                  value={values.hp}
                  onChange={(e) => onChange('hp', e.target.value)}
                  className="w-full p-1 border rounded resize-none overflow-hidden whitespace-pre-wrap break-words min-h-[3rem]"
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
            <td className="border p-2">{t('defense')}</td>
            <td className="border p-2">
              {isEditing ? (
                <textarea
                  ref={useAutoResizeTextArea(values.defense)}
                  value={values.defense}
                  onChange={(e) => onChange('defense', e.target.value)}
                  className="w-full p-1 border rounded resize-none overflow-hidden whitespace-pre-wrap break-words min-h-[3rem]"
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