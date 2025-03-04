import { type JSX } from 'react';
import { Table } from './Table';
import type { Action } from '@/types/types';
import useFlowStore from '@/core/stores/flowStore';
import useCursorStore from '@/core/stores/cursorStore';
import type { SettingsStore } from '@/core/stores/settingsStore';
import { setCurrentRow } from '@/core/facades/cursorStoreFacade';
import useSettingsStoreFacade from '@/core/facades/settingsStoreFacade';
import type { CursorStore, FlowStore } from '@/types/flowStore.types';

interface TableContainerProps {
  isEditMode?: boolean;
  data?: Action[];
}

export function TableContainer({
  isEditMode = false,
  data,
}: TableContainerProps): JSX.Element | null {
  const currentRow = useCursorStore((state: CursorStore) => state.currentRow);
  const flowData = useFlowStore((state: FlowStore) => state.flowData);
  const setFlowData = useFlowStore((state: FlowStore) => state.setFlowData);
  const settings = useSettingsStoreFacade((state: SettingsStore) => state.settings);

  // flowDataが存在しない場合は何も表示しない
  if (!flowData) {
    return null;
  }

  const handleRowSelect = (index: number): void => {
    setCurrentRow(index);
  };

  const handleMoveUp = (): void => {
    setCurrentRow(currentRow - 1);
  };

  const handleMoveDown = (): void => {
    setCurrentRow(currentRow + 1);
  };

  const handleCellEdit = (rowIndex: number, field: keyof Action, value: string): void => {
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

  const handleDeleteRow = (rowIndex: number): void => {
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

  const handleAddRow = (rowIndex: number): void => {
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

  const handlePasteRows = async (rowIndex: number, rows: Partial<Action>[]): Promise<void> => {
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
    <Table
      data={data ?? flowData.flow}
      currentRow={currentRow}
      buttonPosition={settings.buttonAlignment === 'left' ? 'left' : 'right'}
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
}
