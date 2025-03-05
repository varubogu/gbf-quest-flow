import React from 'react';
import { useTranslation } from 'react-i18next';
import type { JSX } from 'react';
interface SettingItemProps {
  labelKey: string;
  children: React.ReactNode;
}

export function SettingItem({ labelKey, children }: SettingItemProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="mb-4">
      <h3 className="font-semibold">{t(labelKey)}</h3>
      <div className="mt-2">
        {children}
      </div>
    </div>
  );
}