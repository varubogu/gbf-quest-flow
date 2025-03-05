import React from 'react';
import { useTranslation } from 'react-i18next';
import { LoadFlowButton } from '@/components/molecules/LoadFlowButton';
import { CreateFlowButton } from '@/components/atoms/specific/CreateFlowButton';

interface EmptyLayoutProps {
  onNew?: () => void;
}

export function EmptyLayout({ onNew }: EmptyLayoutProps): React.ReactElement {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <div className="text-lg mb-4">{t('noDataLoaded')}</div>
      <div className="flex gap-4">
        <CreateFlowButton onClick={onNew} />
        <LoadFlowButton />
      </div>
    </div>
  );
}
