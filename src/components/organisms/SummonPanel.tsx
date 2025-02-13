import React from 'react';
import useFlowStore from '@/stores/flowStore';
import type { Summon } from '@/types/models';

interface SummonPanelProps {
  isEditing: boolean;
}

export const SummonPanel: React.FC<SummonPanelProps> = ({ isEditing }) => {
  const { flowData, updateFlowData } = useFlowStore();

  if (!flowData) return null;

  const handleSummonChange = (type: 'main' | 'friend' | 'other' | 'sub', index: number | null, field: keyof Summon, value: string) => {
    if (!flowData) return;

    const newSummon = {
      ...((type === 'main' ? flowData.organization.summon.main :
          type === 'friend' ? flowData.organization.summon.friend :
          type === 'other' ? flowData.organization.summon.other[index!] :
          flowData.organization.summon.sub[index!])),
      [field]: value
    };

    let newSummonData;
    if (type === 'main') {
      newSummonData = {
        ...flowData.organization.summon,
        main: newSummon
      };
    } else if (type === 'friend') {
      newSummonData = {
        ...flowData.organization.summon,
        friend: newSummon
      };
    } else if (type === 'other') {
      const newOther = [...flowData.organization.summon.other];
      newOther[index!] = newSummon;
      newSummonData = {
        ...flowData.organization.summon,
        other: newOther
      };
    } else {
      const newSub = [...flowData.organization.summon.sub];
      newSub[index!] = newSummon;
      newSummonData = {
        ...flowData.organization.summon,
        sub: newSub
      };
    }

    updateFlowData({
      organization: {
        ...flowData.organization,
        summon: newSummonData
      }
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">カテゴリ</th>
            <th className="border p-2">召喚石名</th>
            <th className="border p-2">解説</th>
          </tr>
        </thead>
        <tbody>
          {/* メイン召喚石 */}
          <tr>
            <td className="border p-2">メイン</td>
            <td className="border p-2">
              {isEditing ? (
                <input
                  type="text"
                  value={flowData.organization.summon.main.name}
                  onChange={(e) => handleSummonChange('main', null, 'name', e.target.value)}
                  className="border p-1 w-full"
                />
              ) : (
                flowData.organization.summon.main.name
              )}
            </td>
            <td className="border p-2">
              {isEditing ? (
                <textarea
                  value={flowData.organization.summon.main.note}
                  onChange={(e) => handleSummonChange('main', null, 'note', e.target.value)}
                  className="border p-1 w-full"
                />
              ) : (
                flowData.organization.summon.main.note.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < flowData.organization.summon.main.note.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))
              )}
            </td>
          </tr>

          {/* フレンド召喚石 */}
          <tr>
            <td className="border p-2">フレンド</td>
            <td className="border p-2">
              {isEditing ? (
                <input
                  type="text"
                  value={flowData.organization.summon.friend.name}
                  onChange={(e) => handleSummonChange('friend', null, 'name', e.target.value)}
                  className="border p-1 w-full"
                />
              ) : (
                flowData.organization.summon.friend.name
              )}
            </td>
            <td className="border p-2">
              {isEditing ? (
                <textarea
                  value={flowData.organization.summon.friend.note}
                  onChange={(e) => handleSummonChange('friend', null, 'note', e.target.value)}
                  className="border p-1 w-full"
                />
              ) : (
                flowData.organization.summon.friend.note.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < flowData.organization.summon.friend.note.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))
              )}
            </td>
          </tr>

          {/* その他の召喚石 */}
          {flowData.organization.summon.other.map((summon, index) => (
            <tr key={`other-${index}`}>
              <td className="border p-2">通常石</td>
              <td className="border p-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={summon.name}
                    onChange={(e) => handleSummonChange('other', index, 'name', e.target.value)}
                    className="border p-1 w-full"
                  />
                ) : (
                  summon.name
                )}
              </td>
              <td className="border p-2">
                {isEditing ? (
                  <textarea
                    value={summon.note}
                    onChange={(e) => handleSummonChange('other', index, 'note', e.target.value)}
                    className="border p-1 w-full"
                  />
                ) : (
                  summon.note.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < summon.note.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))
                )}
              </td>
            </tr>
          ))}

          {/* サブ召喚石 */}
          {flowData.organization.summon.sub.map((summon, index) => (
            <tr key={`sub-${index}`}>
              <td className="border p-2">サブ</td>
              <td className="border p-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={summon.name}
                    onChange={(e) => handleSummonChange('sub', index, 'name', e.target.value)}
                    className="border p-1 w-full"
                  />
                ) : (
                  summon.name
                )}
              </td>
              <td className="border p-2">
                {isEditing ? (
                  <textarea
                    value={summon.note}
                    onChange={(e) => handleSummonChange('sub', index, 'note', e.target.value)}
                    className="border p-1 w-full"
                  />
                ) : (
                  summon.note.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < summon.note.split('\n').length - 1 && <br />}
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