import React, { type JSX } from 'react';
import useFlowStore from '@/core/stores/flowStore';
import type { Job, JobAbility, JobEquipment } from '@/types/types';
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
import { useAutoResizeTextArea } from '@/core/hooks/ui/base/useAutoResizeTextArea';
import { updateFlowData} from '@/core/facades/flowFacade';

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
        <th className={tableCellBaseStyle} rowSpan={totalAbilities}>
          {t('characterAbilities')}
        </th>
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

export function JobPanel({ isEditing }: JobPanelProps): JSX.Element {
  const { t } = useTranslation();
  const flowData = useFlowStore((state: any) => state.flowData);

  // テキストエリアの参照を作成
  const jobNoteRef = useAutoResizeTextArea(flowData?.organization.job.note ?? '');
  const equipmentNoteRef = useAutoResizeTextArea(flowData?.organization.job.equipment.note ?? '');

  if (!flowData) return null;

  const handleJobChange = (field: keyof Job, value: string): void => {
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

  const handleEquipmentChange = (field: keyof JobEquipment, value: string): void => {
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

  const handleAbilityChange = (index: number, field: keyof JobAbility, value: string): void => {
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
    <div id="job-panel" className="overflow-x-auto">
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
            <th className={tableCellBaseStyle}>{t('jobClass')}</th>
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
            <th className={tableCellBaseStyle}>{t('jobMainHand')}</th>
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
}
