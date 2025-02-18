import type { Action } from '@/types/models';

/**
 * タブ区切りテキストを解析する関数
 */
export const parseTabSeparatedText = (text: string): string[][] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  // 1文字ずつ処理
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // エスケープされた引用符
        currentCell += '"';
        i++;
      } else {
        // 引用符の開始または終了
        inQuotes = !inQuotes;
      }
    } else if (char === '\t' && !inQuotes) {
      // タブ区切り（引用符の外）
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // 引用符の外での改行は新しい行を意味する
      if (char === '\r' && nextChar === '\n') {
        i++; // \r\n を1つの改行として扱う
      }
      currentRow.push(currentCell.trim());
      rows.push([...currentRow]); // 現在の行を配列にコピー
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  // 最後のセルと行を処理
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
  }

  // 空の行を除外し、各行のセル数を揃える
  const result = rows
    .filter((row) => row.some((cell) => cell.length > 0))
    .map((row) => {
      // 引用符を適切に処理
      return row.map((cell) => {
        cell = cell.trim();
        // 引用符で囲まれているセルの処理
        if (cell.startsWith('"') && cell.endsWith('"')) {
          // 引用符を除去し、エスケープされた引用符を単一の引用符に変換
          return cell.slice(1, -1).replace(/""/g, '"');
        }
        return cell;
      });
    });

  return result;
};

/**
 * 解析したデータをActionオブジェクトに変換する関数
 */
export const convertToActions = (rows: string[][], startField: keyof Action): Partial<Action>[] => {
  // フィールドの順序を定義
  const fieldOrder: (keyof Action)[] = ['hp', 'prediction', 'charge', 'guard', 'action', 'note'];

  // 貼り付け開始位置のインデックスを取得
  const startIndex = fieldOrder.indexOf(startField);

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
      throw new Error('貼り付ける列数が多すぎます');
    }
  }

  return rows.map((row) => {
    const action: Partial<Action> = {};

    // 貼り付け開始位置から順にデータを割り当て
    row.forEach((value, index) => {
      const fieldIndex = adjustedStartIndex + index;
      if (fieldIndex < fieldOrder.length) {
        const field = fieldOrder[fieldIndex];
        if (field) {
          action[field] = value.trim();
        }
      }
    });

    return action;
  });
};