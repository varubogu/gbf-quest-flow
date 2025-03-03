import React, { type JSX } from 'react';
import useFlowStore from '@/core/stores/flowStore';
import type { Summon, SummonType } from '@/types/types';
import { useTranslation } from 'react-i18next';
import { SummonIcon } from '@/components/molecules/Summon/SummonIcon';
import { SummonNote } from '@/components/molecules/Summon/SummonNote';
import {
  tableBaseStyle,
  tableHeaderRowStyle,
  tableHeaderCellBaseStyle,
  tableCellBaseStyle,
  tableWidthStyles,
} from '@/components/atoms/TableStyles';
import { updateFlowData } from '@/core/facades/flowFacade';

interface SummonPanelProps {
  isEditing: boolean;
}

export function SummonPanel({ isEditing }: SummonPanelProps): JSX.Element {
  const { t } = useTranslation();
  const flowData = useFlowStore((state: any) => state.flowData);

  if (!flowData) return null;

  const handleSummonChange = (type: SummonType, index: number | null, field: keyof Summon, value: string): void => {
    if (!flowData) return;

    let newSummonData;
    if (type === 'main') {
      newSummonData = {
        ...flowData.organization.summon,
        main: {
          name: flowData.organization.summon.main.name,
          note: flowData.organization.summon.main.note,
          [field]: value,
        },
      };
    } else if (type === 'friend') {
      newSummonData = {
        ...flowData.organization.summon,
        friend: {
          name: flowData.organization.summon.friend.name,
          note: flowData.organization.summon.friend.note,
          [field]: value,
        },
      };
    } else if (type === 'other' && index !== null) {
      const newOther = [...flowData.organization.summon.other];
      const currentSummon = newOther[index];
      if (currentSummon) {
        newOther[index] = {
          name: currentSummon.name,
          note: currentSummon.note,
          [field]: value,
        };
      }
      newSummonData = {
        ...flowData.organization.summon,
        other: newOther,
      };
    } else if (type === 'sub' && index !== null) {
      const newSub = [...flowData.organization.summon.sub];
      const currentSummon = newSub[index];
      if (currentSummon) {
        newSub[index] = {
          name: currentSummon.name,
          note: currentSummon.note,
          [field]: value,
        };
      }
      newSummonData = {
        ...flowData.organization.summon,
        sub: newSub,
      };
    }

    if (newSummonData) {
      updateFlowData({
        organization: {
          ...flowData.organization,
          summon: newSummonData,
        },
      });
    }
  };

  return (
    <div id="summon-panel">
      <div className="overflow-x-auto">
        <table id="flow-action-table" className={tableBaseStyle}>
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
              <th className={tableCellBaseStyle}>{t('summonMain')}</th>
              <SummonIcon
                name={flowData.organization.summon.main.name}
                isEditing={isEditing}
                onChange={(value) => handleSummonChange('main', null, 'name', value)}
                aria-label={t('summonName') as string}
              />
              <SummonNote
                note={flowData.organization.summon.main.note}
                isEditing={isEditing}
                onChange={(value) => handleSummonChange('main', null, 'note', value)}
                aria-label={t('overview') as string}
              />
            </tr>
            {/* フレンド召喚石 */}
            <tr>
              <th className={tableCellBaseStyle}>{t('summonFriend')}</th>
              <SummonIcon
                name={flowData.organization.summon.friend.name}
                isEditing={isEditing}
                onChange={(value) => handleSummonChange('friend', null, 'name', value)}
                aria-label={t('summonName') as string}
              />
              <SummonNote
                note={flowData.organization.summon.friend.note}
                isEditing={isEditing}
                onChange={(value) => handleSummonChange('friend', null, 'note', value)}
                aria-label={t('overview') as string}
              />
            </tr>
            {/* その他の召喚石 */}
            {flowData.organization.summon.other.map((summon, index) => (
              <tr key={`other-${index}`}>
                {index === 0 && (
                  <th
                    className={tableCellBaseStyle}
                    rowSpan={flowData.organization.summon.other.length}
                  >
                    {t('summonNormal')}
                  </th>
                )}
                <SummonIcon
                  name={summon.name}
                  isEditing={isEditing}
                  onChange={(value) => handleSummonChange('other', index, 'name', value)}
                  aria-label={t('summonName') as string}
                />
                <SummonNote
                  note={summon.note}
                  isEditing={isEditing}
                  onChange={(value) => handleSummonChange('other', index, 'note', value)}
                  aria-label={t('overview') as string}
                />
              </tr>
            ))}
            {/* サブ召喚石 */}
            {flowData.organization.summon.sub.map((summon, index) => (
              <tr key={`sub-${index}`}>
                {index === 0 && (
                  <th
                    className={tableCellBaseStyle}
                    rowSpan={flowData.organization.summon.sub.length}
                  >
                    {t('summonSub')}
                  </th>
                )}
                <SummonIcon
                  name={summon.name}
                  isEditing={isEditing}
                  onChange={(value) => handleSummonChange('sub', index, 'name', value)}
                  aria-label={t('summonName') as string}
                />
                <SummonNote
                  note={summon.note}
                  isEditing={isEditing}
                  onChange={(value) => handleSummonChange('sub', index, 'note', value)}
                  aria-label={t('overview') as string}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
