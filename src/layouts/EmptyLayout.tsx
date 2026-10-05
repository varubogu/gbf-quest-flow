import React from 'react';
import { useTranslation } from 'react-i18next';
import { LoadFlowButton } from '@/components/atoms/specific/LoadFlowButton';
import { CreateFlowButton } from '@/components/atoms/specific/CreateFlowButton';
import { LoadFromUrlForm } from '@/components/molecules/specific/LoadFromUrlForm';

interface EmptyLayoutProps {
  onNew?: () => void;
}

export function EmptyLayout({ onNew }: EmptyLayoutProps): React.ReactElement {
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh flex items-center justify-center flex-col px-4 py-8">
      <div className="text-lg mb-6 text-center">{t('noDataLoaded')}</div>
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <CreateFlowButton onClick={onNew} />
        <LoadFlowButton />
      </div>
      <LoadFromUrlForm />
    </div>
  );
}
