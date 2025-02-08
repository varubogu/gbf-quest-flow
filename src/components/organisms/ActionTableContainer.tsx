import * as React from "react";
import { ActionTable } from "./ActionTable";

interface RowData {
  hp: string;
  prediction: string;
  ougi: string;
  guard: string;
  action: string;
  note: string;
}

interface ActionTableContainerProps {
  data: RowData[];
  buttonPosition: "left" | "right";
}

export const ActionTableContainer: React.FC<ActionTableContainerProps> = ({
  data,
  buttonPosition,
}) => {
  const [currentRow, setCurrentRow] = React.useState(0);

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

  return (
    <ActionTable
      data={data}
      currentRow={currentRow}
      buttonPosition={buttonPosition}
      onMoveUp={handleMoveUp}
      onMoveDown={handleMoveDown}
      onRowSelect={handleRowSelect}
    />
  );
};