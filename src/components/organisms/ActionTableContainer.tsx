import * as React from "react";
import { ActionTable } from "./ActionTable";
import type { Action } from "@/types/models";
import useFlowStore from "@/stores/flowStore";

interface ActionTableContainerProps {
  buttonPosition: "left" | "right";
  isEditMode?: boolean;
}

export const ActionTableContainer: React.FC<ActionTableContainerProps> = ({
  buttonPosition,
  isEditMode = false,
}) => {
  const { currentRow, setCurrentRow } = useFlowStore();
  const { flowData, setFlowData } = useFlowStore();

  // flowDataが存在しない場合は何も表示しない
  if (!flowData) {
    return null;
  }

  const handleRowSelect = (index: number) => {
    setCurrentRow(index);
  };

  // onMoveUp/onMoveDown はコンポーネント内部で利用する場合の参考実装です。
  const handleMoveUp = () => {
    if (currentRow > 0) setCurrentRow(currentRow - 1);
  };

  const handleMoveDown = () => {
    if (currentRow < flowData.flow.length - 1) setCurrentRow(currentRow + 1);
  };

  const handleCellEdit = (rowIndex: number, field: keyof Action, value: string) => {
    if (!flowData) return;

    console.log('=== Cell Edit Debug ===');
    console.log('Updating:', { rowIndex, field, value });
    console.log('Current flowData:', flowData);

    // 新しいflowデータを作成
    const newFlow = [...flowData.flow];
    newFlow[rowIndex] = {
      ...newFlow[rowIndex],
      [field]: value,
    };

    // 完全な新しいflowDataオブジェクトを作成して更新
    const newFlowData = {
      ...flowData,
      flow: newFlow,
    };

    console.log('New flowData:', newFlowData);
    setFlowData(newFlowData);
  };

  const handlePasteRows = async (rowIndex: number, rows: Partial<Action>[]) => {
    if (!flowData) return;

    console.log('=== Paste Rows Debug ===');
    console.log('Starting paste operation at row:', rowIndex);
    console.log('Current flowData:', flowData);
    console.log('Rows to paste:', rows);

    // 現在のフローデータをコピー
    const newFlow = [...flowData.flow];

    // 貼り付けるデータを適用
    rows.forEach((row, i) => {
      const targetIndex = rowIndex + i;
      // 必要に応じて新しい行を作成
      while (targetIndex >= newFlow.length) {
        newFlow.push({
          hp: "",
          prediction: "",
          charge: "",
          guard: "",
          action: "",
          note: "",
        });
      }

      // 既存の行データを保持しつつ、新しいデータで上書き
      newFlow[targetIndex] = {
        hp: row.hp ?? newFlow[targetIndex].hp ?? "",
        prediction: row.prediction ?? newFlow[targetIndex].prediction ?? "",
        charge: row.charge ?? newFlow[targetIndex].charge ?? "",
        guard: row.guard ?? newFlow[targetIndex].guard ?? "",
        action: row.action ?? newFlow[targetIndex].action ?? "",
        note: row.note ?? newFlow[targetIndex].note ?? "",
      };
    });

    // 新しいflowDataオブジェクトを作成して一度に更新
    const newFlowData = {
      ...flowData,
      flow: newFlow,
    };

    console.log('New flowData after paste:', newFlowData);
    setFlowData(newFlowData);
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
      hp: "",
      prediction: "",
      charge: "",
      guard: "",
      action: "",
      note: "",
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

  return (
    <ActionTable
      data={flowData.flow}
      currentRow={currentRow}
      buttonPosition={buttonPosition}
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