import React from 'react';
import useFlowStore from '@/stores/flowStore';
import type { Summon } from '@/types/models';
import { textInputBaseStyle, textareaBaseStyle, useAutoResizeTextArea } from '@/components/atoms/IconTextButton';
import { useTranslation } from 'react-i18next';
import { tableBaseStyle, tableHeaderRowStyle, tableHeaderCellBaseStyle, tableCellBaseStyle, tableWidthStyles } from '@/components/atoms/TableStyles';

interface SummonPanelProps {
  isEditing: boolean;
}

export const SummonPanel: React.FC<SummonPanelProps> = ({ isEditing }) => {
  const { t } = useTranslation();
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
      <table className={tableBaseStyle}>
        <thead>
          <tr className={tableHeaderRowStyle}>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.sm}`}>{t('summonCategory')}</th>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.md}`}>{t('summonName')}</th>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.xl}`}>{t('overview')}</th>
          </tr>
        </thead>
        <tbody>
          {/* メイン召喚石 */}
          <tr>
            <td className={tableCellBaseStyle}>{t('summonMain')}</td>
            <td className={tableCellBaseStyle}>
              {isEditing ? (
                <input
                  type="text"
                  value={flowData.organization.summon.main.name}
                  onChange={(e) => handleSummonChange('main', null, 'name', e.target.value)}
                  className={textInputBaseStyle}
                />
              ) : (
                flowData.organization.summon.main.name
              )}
            </td>
            <td className={tableCellBaseStyle}>
              {isEditing ? (
                <textarea
                  ref={useAutoResizeTextArea(flowData.organization.summon.main.note)}
                  value={flowData.organization.summon.main.note}
                  onChange={(e) => handleSummonChange('main', null, 'note', e.target.value)}
                  className={textareaBaseStyle}
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
            <td className={tableCellBaseStyle}>{t('summonFriend')}</td>
            <td className={tableCellBaseStyle}>
              {isEditing ? (
                <input
                  type="text"
                  value={flowData.organization.summon.friend.name}
                  onChange={(e) => handleSummonChange('friend', null, 'name', e.target.value)}
                  className={textInputBaseStyle}
                />
              ) : (
                flowData.organization.summon.friend.name
              )}
            </td>
            <td className={tableCellBaseStyle}>
              {isEditing ? (
                <textarea
                  ref={useAutoResizeTextArea(flowData.organization.summon.friend.note)}
                  value={flowData.organization.summon.friend.note}
                  onChange={(e) => handleSummonChange('friend', null, 'note', e.target.value)}
                  className={textareaBaseStyle}
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
              {index === 0 && (
                <td className={`${tableCellBaseStyle}`} rowSpan={flowData.organization.summon.other.length}>
                  {t('summonNormal')}
                </td>
              )}
              <td className={tableCellBaseStyle}>
                {isEditing ? (
                  <input
                    type="text"
                    value={summon.name}
                    onChange={(e) => handleSummonChange('other', index, 'name', e.target.value)}
                    className={textInputBaseStyle}
                  />
                ) : (
                  summon.name
                )}
              </td>
              <td className={tableCellBaseStyle}>
                {isEditing ? (
                  <textarea
                    ref={useAutoResizeTextArea(summon.note)}
                    value={summon.note}
                    onChange={(e) => handleSummonChange('other', index, 'note', e.target.value)}
                    className={textareaBaseStyle}
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
              {index === 0 && (
                <td className={`${tableCellBaseStyle}`} rowSpan={flowData.organization.summon.sub.length}>
                  {t('summonSub')}
                </td>
              )}
              <td className={tableCellBaseStyle}>
                {isEditing ? (
                  <input
                    type="text"
                    value={summon.name}
                    onChange={(e) => handleSummonChange('sub', index, 'name', e.target.value)}
                    className={textInputBaseStyle}
                  />
                ) : (
                  summon.name
                )}
              </td>
              <td className={tableCellBaseStyle}>
                {isEditing ? (
                  <textarea
                    ref={useAutoResizeTextArea(summon.note)}
                    value={summon.note}
                    onChange={(e) => handleSummonChange('sub', index, 'note', e.target.value)}
                    className={textareaBaseStyle}
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