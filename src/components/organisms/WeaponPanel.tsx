import React from 'react';
import useFlowStore from '@/stores/flowStore';
import type { Weapon } from '@/types/models';

interface WeaponPanelProps {
  isEditing: boolean;
}

export const WeaponPanel: React.FC<WeaponPanelProps> = ({ isEditing }) => {
  const { flowData, updateFlowData } = useFlowStore();

  if (!flowData) return null;

  const handleWeaponChange = (type: 'main' | 'other' | 'additional', index: number | null, field: keyof Weapon, value: string) => {
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">カテゴリ</th>
            <th className="border p-2">武器名</th>
            <th className="border p-2">追加スキル</th>
            <th className="border p-2">解説</th>
          </tr>
        </thead>
        <tbody>
          {/* メイン武器 */}
          <tr>
            <td className="border p-2">メイン</td>
            <td className="border p-2">
              {isEditing ? (
                <input
                  type="text"
                  value={flowData.organization.weapon.main.name}
                  onChange={(e) => handleWeaponChange('main', null, 'name', e.target.value)}
                  className="border p-1 w-full"
                />
              ) : (
                flowData.organization.weapon.main.name
              )}
            </td>
            <td className="border p-2">
              {isEditing ? (
                <textarea
                  value={flowData.organization.weapon.main.additionalSkill}
                  onChange={(e) => handleWeaponChange('main', null, 'additionalSkill', e.target.value)}
                  className="border p-1 w-full"
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
                  value={flowData.organization.weapon.main.note}
                  onChange={(e) => handleWeaponChange('main', null, 'note', e.target.value)}
                  className="border p-1 w-full"
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
                  通常武器
                </td>
              )}
              <td className="border p-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={weapon.name}
                    onChange={(e) => handleWeaponChange('other', index, 'name', e.target.value)}
                    className="border p-1 w-full"
                  />
                ) : (
                  weapon.name
                )}
              </td>
              <td className="border p-2">
                {isEditing ? (
                  <textarea
                    value={weapon.additionalSkill}
                    onChange={(e) => handleWeaponChange('other', index, 'additionalSkill', e.target.value)}
                    className="border p-1 w-full"
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
                    value={weapon.note}
                    onChange={(e) => handleWeaponChange('other', index, 'note', e.target.value)}
                    className="border p-1 w-full"
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
                  追加武器
                </td>
              )}
              <td className="border p-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={weapon.name}
                    onChange={(e) => handleWeaponChange('additional', index, 'name', e.target.value)}
                    className="border p-1 w-full"
                  />
                ) : (
                  weapon.name
                )}
              </td>
              <td className="border p-2">
                {isEditing ? (
                  <textarea
                    value={weapon.additionalSkill}
                    onChange={(e) => handleWeaponChange('additional', index, 'additionalSkill', e.target.value)}
                    className="border p-1 w-full"
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
                    value={weapon.note}
                    onChange={(e) => handleWeaponChange('additional', index, 'note', e.target.value)}
                    className="border p-1 w-full"
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
        <h3 className="text-lg font-bold mb-4">スキル効果量</h3>
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">スキル</th>
              <th className="border p-2">効果量</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">TA確率</td>
              <td className="border p-2">
                {isEditing ? (
                  <input type="text" defaultValue="55" className="border p-1 w-full" />
                ) : (
                  "55"
                )}
              </td>
            </tr>
            <tr>
              <td className="border p-2">HP</td>
              <td className="border p-2">
                {isEditing ? (
                  <input type="text" defaultValue="400" className="border p-1 w-full" />
                ) : (
                  "400"
                )}
              </td>
            </tr>
            <tr>
              <td className="border p-2">防御</td>
              <td className="border p-2">
                {isEditing ? (
                  <input type="text" defaultValue="90（HP100時）" className="border p-1 w-full" />
                ) : (
                  "90（HP100時）"
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};