import * as React from "react";
import { ActionTable } from "./ActionTable";
import type { Action } from "@/types/models";
import useFlowStore from "@/stores/flowStore";

interface ActionTableContainerProps {
  data: Action[];
  buttonPosition: "left" | "right";
  isEditMode?: boolean;
}

export const ActionTableContainer: React.FC<ActionTableContainerProps> = ({
  data,
  buttonPosition,
  isEditMode = false,
}) => {
  const { currentRow, setCurrentRow } = useFlowStore();
  const { flowData, setFlowData } = useFlowStore();

  const handleRowSelect = (index: number) => {
    setCurrentRow(index);
  };

  // onMoveUp/onMoveDown はコンポーネント内部で利用する場合の参考実装です。
  const handleMoveUp = () => {
    if (currentRow > 0) setCurrentRow(currentRow - 1);
  };

  const handleMoveDown = () => {
    if (currentRow < data.length - 1) setCurrentRow(currentRow + 1);
  };

  const handleCellEdit = (rowIndex: number, field: keyof Action, value: string) => {
    if (!flowData) return;

    const newFlow = [...flowData.flow];
    newFlow[rowIndex] = {
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
      data={data}
      currentRow={currentRow}
      buttonPosition={buttonPosition}
      onMoveUp={handleMoveUp}
      onMoveDown={handleMoveDown}
      onRowSelect={handleRowSelect}
      isEditMode={isEditMode}
      onCellEdit={handleCellEdit}
      onDeleteRow={handleDeleteRow}
      onAddRow={handleAddRow}
    />
  );
};