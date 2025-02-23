import { useCallback } from 'react';
import type { Flow } from '@/types/models';
import { handleError } from '@/utils/accessibility';
import useFlowStore from '@/stores/flowStore';
import { saveFlow, updateNewFlowState } from '@/utils/flowOperations';
import { useTranslation } from 'react-i18next';

interface UseFlowDataModificationProps {
  flowData: Flow | null;
  recordChange: (_data: Flow) => void;
  hasChanges?: boolean;
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
}: UseFlowDataModificationProps) => {
  const { t } = useTranslation();
  const setFlowData = useFlowStore((state) => state.setFlowData);
  const setIsEditMode = useFlowStore((state) => state.setIsEditMode);
  const originalData = useFlowStore((state) => state.originalData);
  const initializeNewFlow = useFlowStore((state) => state.createNewFlow);

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
      // 1. ファイルの保存とUI状態の更新
      const success = await saveFlow(flowData);
      if (success) {
        // 2. 編集モードの終了（これにより履歴もクリアされる）
        setIsEditMode(false);
        return true;
      }
      return false;
    } catch (error) {
      handleError(error, '保存中');
      return false;
    }
  }, [flowData, setIsEditMode]);

  const handleCancel = useCallback(() => {
    try {
      // 1. 変更確認
      if (!confirmDiscard()) {
        return false;
      }

      // 2. データの復元
      if (originalData) {
        setFlowData(structuredClone(originalData));
      }
      // 3. 編集モードの終了（これにより履歴もクリアされる）
      setIsEditMode(false);
      return true;
    } catch (error) {
      handleError(error, '編集キャンセル中');
      return false;
    }
  }, [confirmDiscard, originalData, setFlowData, setIsEditMode]);

  const handleNew = useCallback(async () => {
    try {
      // 1. 変更確認
      if (!confirmDiscard()) {
        return false;
      }

      // 2. 新規データの初期化（これにより編集モードONと履歴クリアが行われる）
      initializeNewFlow();
      // 3. UI状態の更新
      updateNewFlowState(flowData);
      return true;
    } catch (error) {
      handleError(error, '新規作成中');
      return false;
    }
  }, [confirmDiscard, flowData, initializeNewFlow]);

  return {
    handleTitleChange,
    handleAlwaysChange,
    handleSave,
    handleCancel,
    handleNew,
  };
};