import React from 'react';
import { useTranslation } from 'react-i18next';

export function LoadingLayout(): React.ReactElement {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">{t('loading')}</div>
    </div>
  );
}
