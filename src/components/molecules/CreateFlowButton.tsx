import React, { useState } from 'react';
import useEditModeStore from '@/core/stores/editModeStore';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/atoms/Button';
import { Plus } from 'lucide-react';
import type { JSX } from 'react';

interface CreateFlowButtonProps {
  className?: string;
  onClick?: () => void;
}

export function CreateFlowButton({ className, onClick }: CreateFlowButtonProps): JSX.Element {
  const { t } = useTranslation();
  const [isCreating, setIsCreating] = useState(false);
  const createNewFlow = useEditModeStore((state: any) => state.createNewFlow);

  const handleClick = async () => {
    try {
      setIsCreating(true);
      console.log('CreateFlowButton: 新規フロー作成ボタンがクリックされました');

      // 新規フロー作成
      createNewFlow();

      // 少し遅延させてローディング状態を解除
      setTimeout(() => {
        setIsCreating(false);
        if (onClick) {
          onClick();
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
}
