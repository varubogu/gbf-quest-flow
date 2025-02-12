import React from 'react';
import useFlowStore from '@/stores/flowStore';

interface CreateFlowButtonProps {
  className?: string;
}

export const CreateFlowButton: React.FC<CreateFlowButtonProps> = ({ className }) => {
  const createNewFlow = useFlowStore((state) => state.createNewFlow);

  return (
    <button
      onClick={() => createNewFlow()}
      className={`p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors ${className ?? ''}`}
    >
      新しいデータを作る
    </button>
  );
};