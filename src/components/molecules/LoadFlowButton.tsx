import React, { type JSX, useState } from 'react';
import useFileOperationsFacade from '@/core/facades/fileOperationsFacade';
import { useTranslation } from 'react-i18next';

interface LoadFlowButtonProps {
  className?: string;
  onLoadComplete?: () => void;
}

export const LoadFlowButton: React.FC<LoadFlowButtonProps> = ({
  className,
  onLoadComplete
}): JSX.Element => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const loadFlowFromFile = useFileOperationsFacade((state) => state.loadFlowFromFile);

  const handleClick = async (): Promise<void> => {
    try {
      setIsLoading(true);

      await loadFlowFromFile();

      // 少し遅延させてローディング状態を解除
      setTimeout(() => {
        setIsLoading(false);
        if (onLoadComplete) {
          onLoadComplete();
        }
      }, 500);
    } catch (error) {
      console.error(t('failedToLoadFile'), error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className ?? ''}`}
      data-testid="load-flow-button"
    >
      {isLoading ? t('loadingFile') : t('loadData')}
    </button>
  );
};
