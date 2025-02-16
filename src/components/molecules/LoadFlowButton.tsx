import React from 'react';
import useFlowStore from '@/stores/flowStore';
import { useTranslation } from 'react-i18next';

interface LoadFlowButtonProps {
  className?: string;
}

export const LoadFlowButton: React.FC<LoadFlowButtonProps> = ({ className }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(false);
  const loadFlowFromFile = useFlowStore((state) => state.loadFlowFromFile);

  const handleClick = async () => {
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
