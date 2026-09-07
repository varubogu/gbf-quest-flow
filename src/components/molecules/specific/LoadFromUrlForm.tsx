import React, { useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { loadFlowFromQuery } from '@/core/facades/fileOperationFacade';
import { Button } from '@/components/ui/button';

interface LoadFromUrlFormProps {
  onLoaded?: () => void;
}

/**
 * 公開 URL またはコンテンツIDから行動表を開くフォーム。
 */
export function LoadFromUrlForm({ onLoaded }: LoadFromUrlFormProps): JSX.Element {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError(null);
    try {
      const isUrl = /^https?:\/\//i.test(trimmed);
      await loadFlowFromQuery({
        remoteUrl: isUrl ? trimmed : null,
        dataId: isUrl ? null : trimmed,
      });
      onLoaded?.();
    } catch {
      setError(t('failedToLoadFromUrl') as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-2">
      <label className="text-sm text-muted-foreground" htmlFor="load-from-url">
        {t('loadFromUrlHint')}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="load-from-url"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t('loadFromUrlPlaceholder') as string}
          className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm"
          aria-label={t('loadFromUrl') as string}
        />
        <Button type="submit" disabled={isLoading || !value.trim()} className="min-h-10">
          {isLoading ? t('loadingFile') : t('loadFromUrl')}
        </Button>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </form>
  );
}
