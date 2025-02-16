import React from 'react';
import useFlowStore from '@/stores/flowStore';
import type { Member } from '@/types/models';
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

interface CharacterPanelProps {
  isEditing: boolean;
}

export const CharacterPanel: React.FC<CharacterPanelProps> = ({ isEditing }) => {
  const { t } = useTranslation();
  const { flowData, updateFlowData } = useFlowStore();

  if (!flowData) return null;

  const handleMemberChange = (
    position: 'front' | 'back',
    index: number,
    field: keyof Member,
    value: string
  ) => {
    if (!flowData) return;
    const newMembers =
      position === 'front'
        ? [...flowData.organization.member.front]
        : [...flowData.organization.member.back];

    newMembers[index] = {
      name: '',
      note: '',
      awaketype: '',
      accessories: '',
      limitBonus: '',
      ...newMembers[index],
      [field]: value,
    };

    updateFlowData({
      organization: {
        ...flowData.organization,
        member: {
          ...flowData.organization.member,
          [position]: newMembers,
        },
      },
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className={tableBaseStyle}>
        <thead>
          <tr className={tableHeaderRowStyle}>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.sm}`}>
              {t('characterPosition')}
            </th>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.md}`}>
              {t('characterName')}
            </th>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.xl}`}>
              {t('characterUsage')}
            </th>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.xs}`}>
              {t('characterAwakening')}
            </th>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.lg}`}>
              {t('characterAccessories')}
            </th>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.lg}`}>
              {t('characterLimitBonus')}
            </th>
          </tr>
        </thead>
        <tbody>
          {/* フロントメンバー */}
          {flowData.organization.member.front.map((char, index) => (
            <tr key={`front-${index}`}>
              {index === 0 && (
                <td
                  className={`${tableCellBaseStyle}`}
                  rowSpan={flowData.organization.member.front.length}
                >
                  {t('characterFront')}
                </td>
              )}
              <td className={tableCellBaseStyle}>
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
              <td className={tableCellBaseStyle}>
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
              <td className={tableCellBaseStyle}>
                {isEditing ? (
                  <input
                    type="text"
                    value={char.awaketype}
                    onChange={(e) =>
                      handleMemberChange('front', index, 'awaketype', e.target.value)
                    }
                    className={textInputBaseStyle}
                    maxLength={4}
                  />
                ) : (
                  char.awaketype
                )}
              </td>
              <td className={tableCellBaseStyle}>
                {isEditing ? (
                  <textarea
                    ref={useAutoResizeTextArea(char.accessories)}
                    value={char.accessories}
                    onChange={(e) =>
                      handleMemberChange('front', index, 'accessories', e.target.value)
                    }
                    className={textareaBaseStyle}
                  />
                ) : (
                  char.accessories
                )}
              </td>
              <td className={tableCellBaseStyle}>
                {isEditing ? (
                  <textarea
                    ref={useAutoResizeTextArea(char.limitBonus)}
                    value={char.limitBonus}
                    onChange={(e) =>
                      handleMemberChange('front', index, 'limitBonus', e.target.value)
                    }
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
                <td
                  className={`${tableCellBaseStyle}`}
                  rowSpan={flowData.organization.member.back.length}
                >
                  {t('characterBack')}
                </td>
              )}
              <td className={tableCellBaseStyle}>
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
              <td className={tableCellBaseStyle}>
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
              <td className={tableCellBaseStyle}>
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
              <td className={tableCellBaseStyle}>
                {isEditing ? (
                  <textarea
                    ref={useAutoResizeTextArea(char.accessories)}
                    value={char.accessories}
                    onChange={(e) =>
                      handleMemberChange('back', index, 'accessories', e.target.value)
                    }
                    className={textareaBaseStyle}
                  />
                ) : (
                  char.accessories
                )}
              </td>
              <td className={tableCellBaseStyle}>
                {isEditing ? (
                  <textarea
                    ref={useAutoResizeTextArea(char.limitBonus)}
                    value={char.limitBonus}
                    onChange={(e) =>
                      handleMemberChange('back', index, 'limitBonus', e.target.value)
                    }
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
