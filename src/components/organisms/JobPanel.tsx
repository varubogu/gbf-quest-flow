import React from 'react';
import useFlowStore from '@/stores/flowStore';
import type { Job, JobAbility, JobEquipment } from '@/types/models';

interface JobPanelProps {
  isEditing: boolean;
}

export const JobPanel: React.FC<JobPanelProps> = ({ isEditing }) => {
  const { flowData, updateFlowData } = useFlowStore();

  if (!flowData) return null;

  const handleJobChange = (field: keyof Job, value: string) => {
    if (!flowData) return;
    updateFlowData({
      organization: {
        ...flowData.organization,
        job: {
          ...flowData.organization.job,
          [field]: value
        }
      }
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
            [field]: value
          }
        }
      }
    });
  };

  const handleAbilityChange = (index: number, field: keyof JobAbility, value: string) => {
    if (!flowData) return;
    const newAbilities = [...flowData.organization.job.abilities];
    newAbilities[index] = {
      ...newAbilities[index],
      [field]: value
    };

    updateFlowData({
      organization: {
        ...flowData.organization,
        job: {
          ...flowData.organization.job,
          abilities: newAbilities
        }
      }
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 w-24">項目</th>
            <th className="border p-2 w-40">名前</th>
            <th className="border p-2">解説</th>
          </tr>
        </thead>
        <tbody>
          {/* ジョブ行 */}
          <tr>
            <td className="border p-2">ジョブ</td>
            <td className="border p-2">
              {isEditing ? (
                <input
                  type="text"
                  value={flowData.organization.job.name}
                  onChange={(e) => handleJobChange('name', e.target.value)}
                  className="border p-1 w-full"
                />
              ) : (
                flowData.organization.job.name
              )}
            </td>
            <td className="border p-2">
              {isEditing ? (
                <input
                  type="text"
                  value={flowData.organization.job.note}
                  onChange={(e) => handleJobChange('note', e.target.value)}
                  className="border p-1 w-full"
                />
              ) : (
                flowData.organization.job.note
              )}
            </td>
          </tr>
          {/* 特殊装備行 */}
          <tr>
            <td className="border p-2">特殊装備</td>
            <td className="border p-2">
              {isEditing ? (
                <input
                  type="text"
                  value={flowData.organization.job.equipment.name}
                  onChange={(e) => handleEquipmentChange('name', e.target.value)}
                  className="border p-1 w-full"
                />
              ) : (
                flowData.organization.job.equipment.name
              )}
            </td>
            <td className="border p-2">
              {isEditing ? (
                <input
                  type="text"
                  value={flowData.organization.job.equipment.note}
                  onChange={(e) => handleEquipmentChange('note', e.target.value)}
                  className="border p-1 w-full"
                />
              ) : (
                flowData.organization.job.equipment.note
              )}
            </td>
          </tr>
          {/* アビリティ行 */}
          {flowData.organization.job.abilities.map((ability, index) => (
            <tr key={`ability-${index}`}>
              {index === 0 && (
                <td className="border p-2" rowSpan={flowData.organization.job.abilities.length}>
                  アビリティ
                </td>
              )}
              <td className="border p-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={ability.name}
                    onChange={(e) => handleAbilityChange(index, 'name', e.target.value)}
                    className="border p-1 w-full"
                  />
                ) : (
                  ability.name
                )}
              </td>
              <td className="border p-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={ability.note}
                    onChange={(e) => handleAbilityChange(index, 'note', e.target.value)}
                    className="border p-1 w-full"
                  />
                ) : (
                  ability.note
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};