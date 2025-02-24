import { useCallback, useState } from 'react';
import type { Flow } from '@/types/models';

/**
 * 編集履歴を管理するカスタムフック
 */
export function useEditHistory(_flowData: Flow | null) {
  const [editHistory, setEditHistory] = useState<Flow[]>([]);

  // 変更を記録
  const recordChange = useCallback((newData: Flow) => {
    setEditHistory((prev) => [...prev, newData]);
  }, []);

  // 履歴をクリア
  const clearHistory = useCallback(() => {
    setEditHistory([]);
  }, []);

  // 変更があるかどうかを確認
  const hasChanges = editHistory.length > 0;

  return { editHistory, recordChange, clearHistory, hasChanges };
}