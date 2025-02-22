import { describe, it, expect } from 'vitest';
import { createEmptyRow } from './tableDataUtils';
import type { Action } from '@/types/models';

describe('tableDataUtils', () => {
  describe('createEmptyRow', () => {
    it('空のアクション行を作成すること', () => {
      const emptyRow = createEmptyRow();
      const expectedRow: Action = {
        hp: '',
        prediction: '',
        charge: '',
        guard: '',
        action: '',
        note: '',
      };

      expect(emptyRow).toEqual(expectedRow);
    });

    it('新しいオブジェクトを返すこと', () => {
      const row1 = createEmptyRow();
      const row2 = createEmptyRow();

      expect(row1).not.toBe(row2);
      expect(row1).toEqual(row2);
    });
  });
});