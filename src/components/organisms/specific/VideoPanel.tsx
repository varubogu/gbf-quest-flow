import React, { type JSX } from 'react';
import useFlowStore from '@/core/stores/flowStore';
import { useTranslation } from 'react-i18next';
import { updateFlowData } from '@/core/facades/flowFacade';
import type { FlowStore } from '@/types/flowStore.types';

interface VideoPanelProps {
  isEditing: boolean;
}

export function VideoPanel({ isEditing }: VideoPanelProps): JSX.Element | null {
  const { t } = useTranslation();
  const flowData = useFlowStore((state: FlowStore) => state.flowData);

  if (!flowData) return null;

  const handleVideoChange = (value: string): void => {
    updateFlowData({ movie: value });
  };

  return (
    <div id="video-panel">
      <h3 className="text-lg font-bold mb-4">{t('video')}</h3>
      {isEditing ? (
        <input
          type="text"
          value={flowData.movie || ''}
          onChange={(e) => handleVideoChange(e.target.value)}
          className="border p-2 w-full"
          aria-label={t('video') as string}
        />
      ) : (
        flowData.movie && (
          <a
            href={flowData.movie}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
            aria-label={t('video') as string}
          >
            {flowData.movie}
          </a>
        )
      )}
    </div>
  );
}
