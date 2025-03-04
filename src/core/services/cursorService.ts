import useCursorStore from '@/core/stores/cursorStore';
import useFlowStore from '@/core/stores/flowStore';

export function setCurrentRow(row: number): void {
  if (row < 0) {
    throw new Error('currentRowは0以上の数値である必要があります');
  }
  const maxRow = useFlowStore.getState().getFlowData()?.flow.length ?? 0;
  if (row > maxRow) {
    throw new Error(`currentRowはフローの行数(${maxRow})以下の数値である必要があります`);
  }
  useCursorStore.setState({ currentRow: row });
}
