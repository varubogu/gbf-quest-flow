import React from 'react';
import useFlowStore from '@/stores/flowStore';
import { useTranslation } from 'react-i18next';

interface CreateFlowButtonProps {
  className?: string;
}

export const CreateFlowButton: React.FC<CreateFlowButtonProps> = ({ className }) => {
  const { t } = useTranslation();
  const createNewFlow = useFlowStore((state) => state.createNewFlow);

  return (
    <button
      onClick={() => createNewFlow()}
      className={`p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors ${className ?? ''}`}
    >
      {t('newData')}
    </button>
  );
};