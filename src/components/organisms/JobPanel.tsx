import React from 'react';
import useFlowStore from '@/stores/flowStore';
import type { Job, JobAbility, JobEquipment } from '@/types/models';
import {
  textInputBaseStyle,
  textareaBaseStyle,
  useAutoResizeTextArea,
} from '@/components/atoms/IconTextButton';
import { useTranslation } from 'react-i18next';
import {
  tableBaseStyle,
  tableHeaderRowStyle,
  tableHeaderCellBaseStyle,
  tableCellBaseStyle,
  tableWidthStyles,
} from '@/components/atoms/TableStyles';

interface JobPanelProps {
  isEditing: boolean;
}

export const JobPanel: React.FC<JobPanelProps> = ({ isEditing }) => {
  const { t } = useTranslation();
  const { flowData, updateFlowData } = useFlowStore();

  if (!flowData) return null;

  const handleJobChange = (field: keyof Job, value: string) => {
    if (!flowData) return;
    updateFlowData({
      organization: {
        ...flowData.organization,
        job: {
          ...flowData.organization.job,
          [field]: value,
        },
      },
    });
  };

  const handleEquipmentChange = (field: keyof JobEquipment, value: string) => {
    if (!flowData) return;
    updateFlowData({
      organization: {
        ...flowData.organization,
        job: {
          ...flowData.organization.job,
          equipment: {
            ...flowData.organization.job.equipment,
            [field]: value,
          },
        },
      },
    });
  };

  const handleAbilityChange = (index: number, field: keyof JobAbility, value: string) => {
    if (!flowData) return;
    const newAbilities = [...flowData.organization.job.abilities];
    newAbilities[index] = {
      name: '',
      note: '',
      ...newAbilities[index],
      [field]: value,
    };

    updateFlowData({
      organization: {
        ...flowData.organization,
        job: {
          ...flowData.organization.job,
          abilities: newAbilities,
        },
      },
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className={tableBaseStyle}>
        <thead>
          <tr className={tableHeaderRowStyle}>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.sm}`}>{t('jobItem')}</th>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.md}`}>
              {t('jobValue')}
            </th>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.xl}`}>
              {t('overview')}
            </th>
          </tr>
        </thead>
        <tbody>
          {/* ジョブ行 */}
          <tr>
            <td className={tableCellBaseStyle}>{t('jobClass')}</td>
            <td className={tableCellBaseStyle}>
              {isEditing ? (
                <input
                  type="text"
                  value={flowData.organization.job.name}
                  onChange={(e) => handleJobChange('name', e.target.value)}
                  className={textInputBaseStyle}
                />
              ) : (
                flowData.organization.job.name
              )}
            </td>
            <td className={tableCellBaseStyle}>
              {isEditing ? (
                <textarea
                  ref={useAutoResizeTextArea(flowData.organization.job.note)}
                  value={flowData.organization.job.note}
                  onChange={(e) => handleJobChange('note', e.target.value)}
                  className={textareaBaseStyle}
                />
              ) : (
                flowData.organization.job.note.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < flowData.organization.job.note.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))
              )}
            </td>
          </tr>
          {/* 特殊装備行 */}
          <tr>
            <td className={tableCellBaseStyle}>{t('jobMainHand')}</td>
            <td className={tableCellBaseStyle}>
              {isEditing ? (
                <input
                  type="text"
                  value={flowData.organization.job.equipment.name}
                  onChange={(e) => handleEquipmentChange('name', e.target.value)}
                  className={textInputBaseStyle}
                />
              ) : (
                flowData.organization.job.equipment.name
              )}
            </td>
            <td className={tableCellBaseStyle}>
              {isEditing ? (
                <textarea
                  ref={useAutoResizeTextArea(flowData.organization.job.equipment.note)}
                  value={flowData.organization.job.equipment.note}
                  onChange={(e) => handleEquipmentChange('note', e.target.value)}
                  className={textareaBaseStyle}
                />
              ) : (
                flowData.organization.job.equipment.note.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < flowData.organization.job.equipment.note.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))
              )}
            </td>
          </tr>
          {/* アビリティ行 */}
          {flowData.organization.job.abilities.map((ability, index) => (
            <tr key={`ability-${index}`}>
              {index === 0 && (
                <td
                  className={`${tableCellBaseStyle}`}
                  rowSpan={flowData.organization.job.abilities.length}
                >
                  {t('characterAbilities')}
                </td>
              )}
              <td className={tableCellBaseStyle}>
                {isEditing ? (
                  <input
                    type="text"
                    value={ability.name}
                    onChange={(e) => handleAbilityChange(index, 'name', e.target.value)}
                    className={textInputBaseStyle}
                  />
                ) : (
                  ability.name
                )}
              </td>
              <td className={tableCellBaseStyle}>
                {isEditing ? (
                  <textarea
                    ref={useAutoResizeTextArea(ability.note)}
                    value={ability.note}
                    onChange={(e) => handleAbilityChange(index, 'note', e.target.value)}
                    className={textareaBaseStyle}
                  />
                ) : (
                  ability.note.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < ability.note.split('\n').length - 1 && <br />}
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
