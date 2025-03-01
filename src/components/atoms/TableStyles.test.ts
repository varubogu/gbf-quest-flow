import { describe, it, expect } from 'vitest';
import {
  tableBaseStyle,
  tableHeaderRowStyle,
  tableHeaderCellBaseStyle,
  tableCellBaseStyle,
  tableWidthStyles,
} from './TableStyles';

describe('TableStyles', () => {
  describe('テーブルスタイル定数', () => {
    it('tableBaseStyleが正しく定義されていること', () => {
      expect(tableBaseStyle).toBe('min-w-full border border-gray-400');
    });

    it('tableHeaderRowStyleが正しく定義されていること', () => {
      expect(tableHeaderRowStyle).toBe('bg-gray-100');
    });

    it('tableHeaderCellBaseStyleが正しく定義されていること', () => {
      expect(tableHeaderCellBaseStyle).toBe('border border-gray-400 p-2');
    });

    it('tableCellBaseStyleが正しく定義されていること', () => {
      expect(tableCellBaseStyle).toBe('border border-gray-400 p-2');
    });
  });

  describe('テーブル幅スタイル', () => {
    it('tableWidthStylesが正しく定義されていること', () => {
      expect(tableWidthStyles).toEqual({
        xs: 'w-20',
        sm: 'w-24',
        md: 'w-40',
        lg: 'min-w-[200px]',
        xl: 'min-w-[300px]',
        '1/4': 'w-1/4',
        '3/4': 'w-3/4',
      });
    });

    it('tableWidthStyles.xsが正しく定義されていること', () => {
      expect(tableWidthStyles.xs).toBe('w-20');
    });

    it('tableWidthStyles.smが正しく定義されていること', () => {
      expect(tableWidthStyles.sm).toBe('w-24');
    });

    it('tableWidthStyles.mdが正しく定義されていること', () => {
      expect(tableWidthStyles.md).toBe('w-40');
    });

    it('tableWidthStyles.lgが正しく定義されていること', () => {
      expect(tableWidthStyles.lg).toBe('min-w-[200px]');
    });

    it('tableWidthStyles.xlが正しく定義されていること', () => {
      expect(tableWidthStyles.xl).toBe('min-w-[300px]');
    });

    it('tableWidthStyles["1/4"]が正しく定義されていること', () => {
      expect(tableWidthStyles['1/4']).toBe('w-1/4');
    });

    it('tableWidthStyles["3/4"]が正しく定義されていること', () => {
      expect(tableWidthStyles['3/4']).toBe('w-3/4');
    });
  });
});