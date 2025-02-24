import React from 'react';
import useFlowStore from '@/stores/flowStore';
import type { Job, JobAbility, JobEquipment } from '@/types/models';
import {
  textInputBaseStyle,
  textareaBaseStyle,
} from '@/components/atoms/IconTextButton';
import { useTranslation } from 'react-i18next';
import {
  tableBaseStyle,
  tableHeaderRowStyle,
  tableHeaderCellBaseStyle,
  tableCellBaseStyle,
  tableWidthStyles,
} from '@/components/atoms/TableStyles';
import { useAutoResizeTextArea } from '@/hooks/ui/useAutoResizeTextArea';

// アビリティ行コンポーネント
const AbilityRow: React.FC<{
  ability: JobAbility;
  index: number;
  isEditing: boolean;
  totalAbilities: number;
  onAbilityChange: (_index: number, _field: keyof JobAbility, _value: string) => void;
}> = ({ ability, index, isEditing, totalAbilities, onAbilityChange }) => {
  const { t } = useTranslation();
  const abilityNoteRef = useAutoResizeTextArea(ability.note);

  return (
    <tr>
      {index === 0 && (
        <td className={tableCellBaseStyle} rowSpan={totalAbilities}>
          {t('characterAbilities')}
        </td>
      )}
      <td className={tableCellBaseStyle}>
        {isEditing ? (
          <input
            type="text"
            value={ability.name}
            onChange={(e) => onAbilityChange(index, 'name', e.target.value)}
            className={textInputBaseStyle}
          />
        ) : (
          ability.name
        )}
      </td>
      <td className={tableCellBaseStyle}>
        {isEditing ? (
          <textarea
            ref={abilityNoteRef}
            value={ability.note}
            onChange={(e) => onAbilityChange(index, 'note', e.target.value)}
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
  );
};

interface JobPanelProps {
  isEditing: boolean;
}

export const JobPanel: React.FC<JobPanelProps> = ({ isEditing }) => {
  const { t } = useTranslation();
  const { flowData, updateFlowData } = useFlowStore();

  // テキストエリアの参照を作成
  const jobNoteRef = useAutoResizeTextArea(flowData?.organization.job.note ?? '');
  const equipmentNoteRef = useAutoResizeTextArea(flowData?.organization.job.equipment.note ?? '');

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
                  ref={jobNoteRef}
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
                  ref={equipmentNoteRef}
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
            <AbilityRow
              key={`ability-${index}`}
              ability={ability}
              index={index}
              isEditing={isEditing}
              totalAbilities={flowData.organization.job.abilities.length}
              onAbilityChange={handleAbilityChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
