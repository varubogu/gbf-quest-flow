import React, { useState } from 'react';
import useFlowStoreFacade from '@/core/stores/flowStoreFacade';
import { useTranslation } from 'react-i18next';

interface CreateFlowButtonProps {
  className?: string;
  onCreate?: () => void;
}

export const CreateFlowButton: React.FC<CreateFlowButtonProps> = ({
  className,
  onCreate
}) => {
  const { t } = useTranslation();
  const [isCreating, setIsCreating] = useState(false);
  const createNewFlow = useFlowStoreFacade((state) => state.createNewFlow);

  const handleClick = async () => {
    try {
      setIsCreating(true);
      console.log('CreateFlowButton: 新規フロー作成ボタンがクリックされました');

      // 新規フロー作成
      createNewFlow();

      // 少し遅延させてローディング状態を解除
      setTimeout(() => {
        setIsCreating(false);
        if (onCreate) {
          onCreate();
        }
      }, 500);
    } catch (error) {
      console.error('新規フロー作成中にエラーが発生しました:', error);
      setIsCreating(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isCreating}
      className={`p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className ?? ''}`}
      data-testid="create-flow-button"
    >
      {isCreating ? t('creating') : t('newData')}
    </button>
  );
};
