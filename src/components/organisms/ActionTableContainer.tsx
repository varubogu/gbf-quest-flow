import * as React from 'react';
import { ActionTable } from './ActionTable';
import type { Action } from '@/types/models';
import useFlowStore from '@/stores/flowStore';
import useSettingsStore from '@/stores/settingsStore';

interface ActionTableContainerProps {
  isEditMode?: boolean;
  data?: Action[];
}

export const ActionTableContainer: React.FC<ActionTableContainerProps> = ({
  isEditMode = false,
  data,
}) => {
  const { currentRow, setCurrentRow } = useFlowStore();
  const { flowData, setFlowData } = useFlowStore();
  const { undo, redo } = useFlowStore();
  const { settings } = useSettingsStore();

  // キーボードイベントのハンドラを追加
  React.useEffect(() => {
    if (!isEditMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Z
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      }
      // Cmd/Ctrl + Shift + Z
      else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        redo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditMode, undo, redo]);

  // flowDataが存在しない場合は何も表示しない
  if (!flowData) {
    return null;
  }

  const handleRowSelect = (index: number) => {
    setCurrentRow(index);
  };

  const handleMoveUp = () => {
    if (currentRow > 0) setCurrentRow(currentRow - 1);
  };

  const handleMoveDown = () => {
    if (currentRow < flowData.flow.length - 1) setCurrentRow(currentRow + 1);
  };

  const handleCellEdit = (rowIndex: number, field: keyof Action, value: string) => {
    if (!flowData) return;

    const newFlow = [...flowData.flow];
    newFlow[rowIndex] = {
      hp: '',
      prediction: '',
      charge: '',
      guard: '',
      action: '',
      note: '',
      ...newFlow[rowIndex],
      [field]: value,
    };

    setFlowData({
      ...flowData,
      flow: newFlow,
    });
  };

  const handleDeleteRow = (rowIndex: number) => {
    if (!flowData) return;

    const newFlow = [...flowData.flow];
    newFlow.splice(rowIndex, 1);

    setFlowData({
      ...flowData,
      flow: newFlow,
    });

    // 削除した行が現在の選択行より前なら、選択行を1つ上に移動
    if (rowIndex < currentRow) {
      setCurrentRow(currentRow - 1);
    }
    // 削除した行が現在の選択行なら、選択行をそのままにする（次の行が選択されることになる）
    else if (rowIndex === currentRow && currentRow >= newFlow.length) {
      setCurrentRow(Math.max(0, newFlow.length - 1));
    }
  };

  const handleAddRow = (rowIndex: number) => {
    if (!flowData) return;

    const newFlow = [...flowData.flow];
    const newRow: Action = {
      hp: '',
      prediction: '',
      charge: '',
      guard: '',
      action: '',
      note: '',
    };

    // インデックスが-1の場合は先頭に挿入
    const insertIndex = rowIndex === -1 ? 0 : rowIndex + 1;
    newFlow.splice(insertIndex, 0, newRow);

    setFlowData({
      ...flowData,
      flow: newFlow,
    });

    // 追加した行を選択
    setCurrentRow(insertIndex);
  };

  const handlePasteRows = async (rowIndex: number, rows: Partial<Action>[]) => {
    if (!flowData) return;

    // 現在のフローデータをコピー
    const newFlow = [...flowData.flow];

    // 貼り付けるデータを適用
    rows.forEach((row, i) => {
      const targetIndex = rowIndex + i;

      // 必要な数の空の行を追加
      while (targetIndex >= newFlow.length) {
        newFlow.push({
          hp: '',
          prediction: '',
          charge: '',
          guard: '',
          action: '',
          note: '',
        });
      }

      // 最初の行は上書き、2行目以降は新しい行を挿入
      if (i === 0) {
        // 1行目は指定位置に上書き
        newFlow[targetIndex] = {
          hp: '',
          prediction: '',
          charge: '',
          guard: '',
          action: '',
          note: '',
          ...newFlow[targetIndex],
          ...Object.fromEntries(Object.entries(row).filter(([_, value]) => value !== undefined)),
        };
      } else {
        // 2行目以降は新しい行を挿入
        const newRow = {
          hp: '',
          prediction: '',
          charge: '',
          guard: '',
          action: '',
          note: '',
          ...Object.fromEntries(Object.entries(row).filter(([_, value]) => value !== undefined)),
        };
        newFlow.splice(targetIndex, 0, newRow);
      }
    });

    setFlowData({
      ...flowData,
      flow: newFlow,
    });
  };

  return (
    <ActionTable
      data={data ?? flowData.flow}
      currentRow={currentRow}
      buttonPosition={settings.buttonAlignment === '左' ? 'left' : 'right'}
      onMoveUp={handleMoveUp}
      onMoveDown={handleMoveDown}
      onRowSelect={handleRowSelect}
      isEditMode={isEditMode}
      onCellEdit={handleCellEdit}
      onDeleteRow={handleDeleteRow}
      onAddRow={handleAddRow}
      onPasteRows={handlePasteRows}
    />
  );
};
