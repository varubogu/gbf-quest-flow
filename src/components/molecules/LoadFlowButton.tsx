import React, { type JSX } from 'react';
import useFlowStoreFacade from '@/core/stores/flowStoreFacade';
import { useTranslation } from 'react-i18next';

interface LoadFlowButtonProps {
  className?: string;
}

export const LoadFlowButton: React.FC<LoadFlowButtonProps> = ({ className }): JSX.Element => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(false);
  const loadFlowFromFile = useFlowStoreFacade((state) => state.loadFlowFromFile);

  const handleClick = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await loadFlowFromFile();
    } catch (error) {
      console.error(t('failedToLoadFile'), error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className ?? ''}`}
    >
      {isLoading ? t('loadingFile') : t('loadData')}
    </button>
  );
};
