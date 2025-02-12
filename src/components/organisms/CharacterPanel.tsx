import React from 'react';
import useFlowStore from '@/stores/flowStore';
import type { Member } from '@/types/models';
import { textInputBaseStyle, textareaBaseStyle, useAutoResizeTextArea } from '@/components/atoms/IconTextButton';

interface CharacterPanelProps {
  isEditing: boolean;
}

export const CharacterPanel: React.FC<CharacterPanelProps> = ({ isEditing }) => {
  const { flowData, updateFlowData } = useFlowStore();

  if (!flowData) return null;

  const handleMemberChange = (position: 'front' | 'back', index: number, field: keyof Member, value: string) => {
    if (!flowData) return;
    const newMembers = position === 'front'
      ? [...flowData.organization.member.front]
      : [...flowData.organization.member.back];

    newMembers[index] = {
      ...newMembers[index],
      [field]: value
    };

    updateFlowData({
      organization: {
        ...flowData.organization,
        member: {
          ...flowData.organization.member,
          [position]: newMembers
        }
      }
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 w-24">ポジション</th>
            <th className="border p-2 w-40">キャラ</th>
            <th className="border p-2 min-w-[300px]">用途</th>
            <th className="border p-2 w-20">覚醒</th>
            <th className="border p-2 min-w-[200px]">指輪・耳飾り</th>
            <th className="border p-2 min-w-[200px]">LB</th>
          </tr>
        </thead>
        <tbody>
          {/* フロントメンバー */}
          {flowData.organization.member.front.map((char, index) => (
            <tr key={`front-${index}`}>
              {index === 0 && (
                <td className="border p-2" rowSpan={flowData.organization.member.front.length}>
                  フロント
                </td>
              )}
              <td className="border p-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={char.name}
                    onChange={(e) => handleMemberChange('front', index, 'name', e.target.value)}
                    className={textInputBaseStyle}
                  />
                ) : (
                  char.name
                )}
              </td>
              <td className="border p-2">
                {isEditing ? (
                  <textarea
                    ref={useAutoResizeTextArea(char.note)}
                    value={char.note}
                    onChange={(e) => handleMemberChange('front', index, 'note', e.target.value)}
                    className={textareaBaseStyle}
                  />
                ) : (
                  char.note.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < char.note.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))
                )}
              </td>
              <td className="border p-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={char.awaketype}
                    onChange={(e) => handleMemberChange('front', index, 'awaketype', e.target.value)}
                    className={textInputBaseStyle}
                    maxLength={4}
                  />
                ) : (
                  char.awaketype
                )}
              </td>
              <td className="border p-2">
                {isEditing ? (
                  <textarea
                    ref={useAutoResizeTextArea(char.accessories)}
                    value={char.accessories}
                    onChange={(e) => handleMemberChange('front', index, 'accessories', e.target.value)}
                    className={textareaBaseStyle}
                  />
                ) : (
                  char.accessories
                )}
              </td>
              <td className="border p-2">
                {isEditing ? (
                  <textarea
                    ref={useAutoResizeTextArea(char.limitBonus)}
                    value={char.limitBonus}
                    onChange={(e) => handleMemberChange('front', index, 'limitBonus', e.target.value)}
                    className={textareaBaseStyle}
                  />
                ) : (
                  char.limitBonus
                )}
              </td>
            </tr>
          ))}
          {/* サブメンバー */}
          {flowData.organization.member.back.map((char, index) => (
            <tr key={`back-${index}`}>
              {index === 0 && (
                <td className="border p-2" rowSpan={flowData.organization.member.back.length}>
                  サブ
                </td>
              )}
              <td className="border p-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={char.name}
                    onChange={(e) => handleMemberChange('back', index, 'name', e.target.value)}
                    className={textInputBaseStyle}
                  />
                ) : (
                  char.name
                )}
              </td>
              <td className="border p-2">
                {isEditing ? (
                  <textarea
                    ref={useAutoResizeTextArea(char.note)}
                    value={char.note}
                    onChange={(e) => handleMemberChange('back', index, 'note', e.target.value)}
                    className={textareaBaseStyle}
                  />
                ) : (
                  char.note.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < char.note.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))
                )}
              </td>
              <td className="border p-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={char.awaketype}
                    onChange={(e) => handleMemberChange('back', index, 'awaketype', e.target.value)}
                    className={textInputBaseStyle}
                    maxLength={4}
                  />
                ) : (
                  char.awaketype
                )}
              </td>
              <td className="border p-2">
                {isEditing ? (
                  <textarea
                    ref={useAutoResizeTextArea(char.accessories)}
                    value={char.accessories}
                    onChange={(e) => handleMemberChange('back', index, 'accessories', e.target.value)}
                    className={textareaBaseStyle}
                  />
                ) : (
                  char.accessories
                )}
              </td>
              <td className="border p-2">
                {isEditing ? (
                  <textarea
                    ref={useAutoResizeTextArea(char.limitBonus)}
                    value={char.limitBonus}
                    onChange={(e) => handleMemberChange('back', index, 'limitBonus', e.target.value)}
                    className={textareaBaseStyle}
                  />
                ) : (
                  char.limitBonus
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};