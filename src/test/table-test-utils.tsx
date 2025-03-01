import { render } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';

/**
 * テーブル要素（td, th）を適切な親要素（table, tr）でラップしてレンダリングするヘルパー関数
 * HTMLの構造エラーを回避するために使用します
 */
export const renderTableCell = (ui: ReactElement): RenderResult => {
  return render(
    <table>
      <tbody>
        <tr>{ui}</tr>
      </tbody>
    </table>
  );
};

/**
 * テーブル行（tr）を適切な親要素（table, tbody）でラップしてレンダリングするヘルパー関数
 * HTMLの構造エラーを回避するために使用します
 */
export const renderTableRow = (ui: ReactElement): RenderResult => {
  return render(
    <table>
      <tbody>{ui}</tbody>
    </table>
  );
};

/**
 * テーブルヘッダーセル（th）を適切な親要素（table, thead, tr）でラップしてレンダリングするヘルパー関数
 * HTMLの構造エラーを回避するために使用します
 */
export const renderTableHeaderCell = (ui: ReactElement): RenderResult => {
  return render(
    <table>
      <thead>
        <tr>{ui}</tr>
      </thead>
    </table>
  );
};