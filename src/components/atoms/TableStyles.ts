const borderColor = 'border-gray-400';
const cellPadding = 'p-2';

// テーブル全体のスタイル
export const tableBaseStyle = `min-w-full border ${borderColor}`;

// ヘッダー行のスタイル
export const tableHeaderRowStyle = 'bg-gray-100';

// ヘッダーセルのスタイル
export const tableHeaderCellBaseStyle = `border ${borderColor} ${cellPadding}`;

// 通常セルのスタイル
export const tableCellBaseStyle = `border ${borderColor} ${cellPadding}`;

// 幅のバリエーション
export const tableWidthStyles = {
  xs: 'w-20',
  sm: 'w-24',
  md: 'w-40',
  lg: 'min-w-[200px]',
  xl: 'min-w-[300px]',
  '1/4': 'w-1/4',
  '3/4': 'w-3/4',
} as const;
