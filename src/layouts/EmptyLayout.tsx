import React from 'react';
import { useTranslation } from 'react-i18next';
import { LoadFlowButton } from '@/components/molecules/LoadFlowButton';
import { CreateFlowButton } from '@/components/molecules/CreateFlowButton';
import { loadSlugData } from '@/lib/functions';

export function EmptyLayout() {
  const { t } = useTranslation();

  // URLパラメータのチェック
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('d')) {
      const slug = urlParams.get('d');
      if (slug) {
        loadSlugData(slug);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <div className="text-lg mb-4">{t('noDataLoaded')}</div>
      <div className="flex gap-4">
        <CreateFlowButton />
        <LoadFlowButton />
      </div>
    </div>
  );
}