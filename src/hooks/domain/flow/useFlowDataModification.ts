import { useCallback } from 'react';
import type { Flow } from '@/types/models';
import { handleError } from '@/utils/accessibility';
import useFlowStore from '@/stores/flowStore';
import { handleFlowSave, handleNewFlow, handleCancel } from '@/services/flowEventService';
import { useTranslation } from 'react-i18next';

interface UseFlowDataModificationProps {
  flowData: Flow | null;
  recordChange: (_data: Flow) => void;
  hasChanges?: boolean;
}

export interface UseFlowDataModificationResult {
  handleTitleChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAlwaysChange: (_e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSave: () => Promise<boolean>;
  handleCancel: () => Promise<boolean>;
  handleNew: () => Promise<boolean>;
}

/**
 * フローデータの操作に関するフック
 * 各操作は以下の順序で処理を行う：
 * 1. 変更確認（必要な場合）
 * 2. データの操作（Store）
 * 3. UI状態の更新（URL、アクセシビリティ）
 */
export const useFlowDataModification = ({
  flowData,
  recordChange,
  hasChanges = false,
}: UseFlowDataModificationProps): UseFlowDataModificationResult => {
  const { t } = useTranslation();
  const setFlowData = useFlowStore((state) => state.setFlowData);

  // データ変更のハンドラー
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!flowData) return;
      try {
        const newData = {
          ...flowData,
          title: e.target.value,
        };
        // 1. データの更新
        setFlowData(newData);
        // 2. 変更の記録
        recordChange(newData);
      } catch (error) {
        handleError(error, 'タイトル更新中');
      }
    },
    [flowData, setFlowData, recordChange]
  );

  const handleAlwaysChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!flowData) return;
      try {
        const newData = {
          ...flowData,
          always: e.target.value,
        };
        // 1. データの更新
        setFlowData(newData);
        // 2. 変更の記録
        recordChange(newData);
      } catch (error) {
        handleError(error, '常時実行項目更新中');
      }
    },
    [flowData, setFlowData, recordChange]
  );

  // 変更破棄の確認
  const confirmDiscard = useCallback(() => {
    if (!hasChanges) return true;
    return window.confirm(
      t('confirmDiscardChanges', '変更内容が保存されていません。変更を破棄してもよろしいですか？')
    );
  }, [hasChanges, t]);

  // 操作系のハンドラー
  const handleSave = useCallback(async () => {
    if (!flowData) return false;
    try {
      return await handleFlowSave(flowData, null, recordChange);
    } catch (error) {
      handleError(error, '保存中');
      return false;
    }
  }, [flowData, recordChange]);

  const handleCancelEdit = useCallback(async () => {
    try {
      return await handleCancel(hasChanges, recordChange);
    } catch (error) {
      handleError(error, '編集キャンセル中');
      return false;
    }
  }, [hasChanges, recordChange]);

  const handleNew = useCallback(async () => {
    try {
      if (!confirmDiscard()) {
        return false;
      }
      handleNewFlow(flowData);
      return true;
    } catch (error) {
      handleError(error, '新規作成中');
      return false;
    }
  }, [confirmDiscard, flowData]);

  return {
    handleTitleChange,
    handleAlwaysChange,
    handleSave,
    handleCancel: handleCancelEdit,
    handleNew,
  };
};