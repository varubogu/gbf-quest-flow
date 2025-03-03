import React from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import useFlowStore from '@/core/stores/flowStore';
import { SummonForm } from './SummonForm';

interface SummonPanelProps {
  isEditing: boolean;
}

export const SummonPanel = memo(({ isEditing }: SummonPanelProps) => {
  const { t } = useTranslation();
  const flowData = useFlowStore((state: any) => state.flowData);

  if (!flowData) return null;

  const { main, friend, other, sub } = flowData.organization.summon;

  return (
    <div role="region" aria-label={t('summon.panelLabel') as string}>
      <h2>{t('summon.title')}</h2>
      <div>
        <h3>{t('summon.mainTitle')}</h3>
        <SummonForm
          type="main"
          summons={[main]}
          isEditing={isEditing}
        />
      </div>
      <div>
        <h3>{t('summon.friendTitle')}</h3>
        <SummonForm
          type="friend"
          summons={[friend]}
          isEditing={isEditing}
        />
      </div>
      <div>
        <h3>{t('summon.otherTitle')}</h3>
        <SummonForm
          type="other"
          summons={other}
          isEditing={isEditing}
        />
      </div>
      <div>
        <h3>{t('summon.subTitle')}</h3>
        <SummonForm
          type="sub"
          summons={sub}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
});