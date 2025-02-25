import type { Flow } from '@/types/models';
import { announceToScreenReader, handleError } from '@/utils/accessibility';

/**
 * フローデータを保存する
 * @param flowData 保存するフローデータ
 * @param sourceId ソースID（オプション）
 * @returns 保存が成功したかどうか
 */
export const saveFlow = async (flowData: Flow, sourceId: string | null = null): Promise<boolean> => {
  try {
    const dataStr = JSON.stringify(flowData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${flowData.title || 'flow'}.json`;
    a.setAttribute('aria-label', `${flowData.title}をダウンロード`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const currentPath = sourceId ? `/${sourceId}` : '/';
    history.replaceState({ flowData, isSaving: true }, '', currentPath);
    announceToScreenReader('フローを保存しました');
    return true;
  } catch (error) {
    handleError(error, '保存中');
    return false;
  }
};

/**
 * 新規作成時のURL状態とアクセシビリティを更新する
 * @param flowData 現在のフローデータ（履歴用）
 */
export const updateNewFlowState = (flowData: Flow | null = null): void => {
  try {
    if (flowData) {
      history.pushState({ flowData }, '', '/?mode=new');
    }
    announceToScreenReader('新しいフローを作成しました');
  } catch (error) {
    handleError(error, '新規作成中');
  }
};