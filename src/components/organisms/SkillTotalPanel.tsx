import React from 'react';
import useFlowStore from '@/stores/flowStore';
import { useTranslation } from 'react-i18next';
import type { WeaponSkillTotal } from '@/types/models';
import { textareaBaseStyle, useAutoResizeTextArea } from '@/components/atoms/IconTextButton';

interface SkillTotalPanelProps {
  isEditing: boolean;
}

export const SkillTotalPanel: React.FC<SkillTotalPanelProps> = ({ isEditing }) => {
  const { t } = useTranslation();
  const { flowData, updateFlowData } = useFlowStore();

  if (!flowData) return null;

  const handleSkillTotalChange = (field: keyof WeaponSkillTotal, value: string) => {
    if (!flowData) return;

    const newSkillTotal = {
      ...flowData.organization.weapon.main.skillTotal,
      [field]: value
    };

    updateFlowData({
      organization: {
        ...flowData.organization,
        weapon: {
          ...flowData.organization.weapon,
          main: {
            ...flowData.organization.weapon.main,
            skillTotal: newSkillTotal
          }
        }
      }
    });
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">{t('skillTotals')}</h3>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">{t('skill')}</th>
            <th className="border p-2">{t('totalAmount')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">{t('taRate')}</td>
            <td className="border p-2">
              {isEditing ? (
                <textarea
                  ref={useAutoResizeTextArea(flowData.organization.weapon.main.skillTotal.taRate)}
                  value={flowData.organization.weapon.main.skillTotal.taRate}
                  onChange={(e) => handleSkillTotalChange('taRate', e.target.value)}
                  className="w-full p-1 border rounded resize-none overflow-hidden whitespace-pre-wrap break-words min-h-[3rem]"
                />
              ) : (
                flowData.organization.weapon.main.skillTotal.taRate.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < flowData.organization.weapon.main.skillTotal.taRate.split('\n').length - 1 && <br />}
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
                  ref={useAutoResizeTextArea(flowData.organization.weapon.main.skillTotal.hp)}
                  value={flowData.organization.weapon.main.skillTotal.hp}
                  onChange={(e) => handleSkillTotalChange('hp', e.target.value)}
                  className="w-full p-1 border rounded resize-none overflow-hidden whitespace-pre-wrap break-words min-h-[3rem]"
                />
              ) : (
                flowData.organization.weapon.main.skillTotal.hp.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < flowData.organization.weapon.main.skillTotal.hp.split('\n').length - 1 && <br />}
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
                  ref={useAutoResizeTextArea(flowData.organization.weapon.main.skillTotal.defense)}
                  value={flowData.organization.weapon.main.skillTotal.defense}
                  onChange={(e) => handleSkillTotalChange('defense', e.target.value)}
                  className="w-full p-1 border rounded resize-none overflow-hidden whitespace-pre-wrap break-words min-h-[3rem]"
                />
              ) : (
                flowData.organization.weapon.main.skillTotal.defense.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < flowData.organization.weapon.main.skillTotal.defense.split('\n').length - 1 && <br />}
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