import React, { type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import {
  tableBaseStyle,
  tableHeaderRowStyle,
  tableHeaderCellBaseStyle,
  tableWidthStyles,
} from '@/components/styles/TableStyles';
import { useSummonHandlers } from '@/core/hooks/ui/specific/useSummonHandlers';
import { MainSummonSection } from '@/components/molecules/specific/summon/MainSummonSection';
import { FriendSummonSection } from '@/components/molecules/specific/summon/FriendSummonSection';
import { OtherSummonSection } from '@/components/molecules/specific/summon/OtherSummonSection';
import { SubSummonSection } from '@/components/molecules/specific/summon/SubSummonSection';
import type { Summon } from '@/types/types';

interface SummonPanelProps {
  isEditing: boolean;
}

export function SummonPanel({ isEditing }: SummonPanelProps): JSX.Element | null {
  const { t } = useTranslation();
  const { flowData, handleSummonChange } = useSummonHandlers();

  if (!flowData) return null;

  const handleMainSummonChange = (field: keyof Summon, value: string): void => {
    handleSummonChange('main', null, field, value);
  };

  const handleFriendSummonChange = (field: keyof Summon, value: string): void => {
    handleSummonChange('friend', null, field, value);
  };

  const handleOtherSummonChange = (index: number, field: keyof Summon, value: string): void => {
    handleSummonChange('other', index, field, value);
  };

  const handleSubSummonChange = (index: number, field: keyof Summon, value: string): void => {
    handleSummonChange('sub', index, field, value);
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
            <MainSummonSection
              summon={flowData.organization.summon.main}
              isEditing={isEditing}
              onSummonChange={handleMainSummonChange}
            />

            {/* フレンド召喚石 */}
            <FriendSummonSection
              summon={flowData.organization.summon.friend}
              isEditing={isEditing}
              onSummonChange={handleFriendSummonChange}
            />

            {/* その他の召喚石 */}
            <OtherSummonSection
              summons={flowData.organization.summon.other}
              isEditing={isEditing}
              onSummonChange={handleOtherSummonChange}
            />

            {/* サブ召喚石 */}
            <SubSummonSection
              summons={flowData.organization.summon.sub}
              isEditing={isEditing}
              onSummonChange={handleSubSummonChange}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}
