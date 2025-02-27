import type { Action } from '@/types/models';

/**
 * 空のアクション行を作成する
 * @returns 初期値が設定された新しいAction
 */
export const createEmptyRow = (): Action => {
  return {
    hp: '',
    prediction: '',
    charge: '',
    guard: '',
    action: '',
    note: '',
  };
};

/**
 * 解析したデータを指定されたフィールドを持つオブジェクトに変換する関数
 */
export const convertToItems = <T extends Record<string, unknown>>(
  rows: string[][],
  startField: string,
  fieldOrder: string[]
): Partial<T>[] => {
  // 貼り付け開始位置のインデックスを取得
  const startIndex = fieldOrder.indexOf(startField);
  if (startIndex === -1) {
    throw new Error(`Field ${startField} not found in fieldOrder`);
  }

  // 各行のデータ列数を取得（空の列も含める）
  const dataColumnCount = Math.max(...rows.map((row) => row.length));

  // 残りの列数を計算
  const remainingColumns = fieldOrder.length - startIndex;

  // データがはみ出す場合の調整
  let adjustedStartIndex = startIndex;
  if (dataColumnCount > remainingColumns) {
    // 左にずらす必要がある分を計算
    const shiftLeft = dataColumnCount - remainingColumns;
    adjustedStartIndex = startIndex - shiftLeft;

    // 先頭列よりも左にはみ出す場合はエラー
    if (adjustedStartIndex < 0) {
      // エラーメッセージのキーを例外で送出
      throw new Error('tooManyColumns');
    }
  }

  return rows.map((row) => {
    const item: Partial<T> = {};

    // 貼り付け開始位置から順にデータを割り当て
    row.forEach((value, index) => {
      const fieldIndex = adjustedStartIndex + index;
      if (fieldIndex < fieldOrder.length) {
        const field = fieldOrder[fieldIndex];
        if (field) {
          (item as unknown as Record<string, unknown>)[field] = value.trim();
        }
      }
    });

    return item;
  });
};