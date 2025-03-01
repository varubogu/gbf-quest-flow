import { describe, it, expect } from 'vitest';
import { createEmptyMember, updateMemberField } from './calculations';
import type { Member } from '@/types/models';

describe('characters/calculations', () => {
  describe('createEmptyMember', () => {
    it('空のメンバーオブジェクトを作成する', () => {
      const emptyMember = createEmptyMember();

      expect(emptyMember).toEqual({
        name: '',
        note: '',
        awaketype: '',
        accessories: '',
        limitBonus: '',
      });
    });
  });

  describe('updateMemberField', () => {
    it('メンバーの特定のフィールドを更新する', () => {
      // 準備
      const initialMembers: Member[] = [
        createEmptyMember(),
        createEmptyMember(),
      ];

      // 実行
      const updatedMembers = updateMemberField(initialMembers, 1, 'name', 'テストキャラクター');

      // 検証
      expect(updatedMembers).not.toBe(initialMembers); // 新しい配列が返されることを確認
      expect(updatedMembers[0]).toEqual(createEmptyMember()); // 更新対象外のメンバーは変更されていないことを確認
      expect(updatedMembers[1]).toEqual({
        ...createEmptyMember(),
        name: 'テストキャラクター',
      });
    });

    it('存在しないインデックスのメンバーを更新しようとした場合、undefinedになる', () => {
      // 準備
      const initialMembers: Member[] = [createEmptyMember()];

      // 実行
      const updatedMembers = updateMemberField(initialMembers, 1, 'name', 'テストキャラクター');

      // 検証
      expect(updatedMembers).not.toBe(initialMembers); // 新しい配列が返されることを確認
      expect(updatedMembers[0]).toEqual(createEmptyMember()); // 更新対象外のメンバーは変更されていないことを確認
      expect(updatedMembers[1]).toEqual({
        ...createEmptyMember(),
        name: 'テストキャラクター',
      });
    });

    it('既存のフィールド値を上書きする', () => {
      // 準備
      const initialMembers: Member[] = [
        {
          ...createEmptyMember(),
          name: '古い名前',
          note: 'メモ',
        },
      ];

      // 実行
      const updatedMembers = updateMemberField(initialMembers, 0, 'name', '新しい名前');

      // 検証
      expect(updatedMembers).not.toBe(initialMembers); // 新しい配列が返されることを確認
      expect(updatedMembers[0]).toEqual({
        ...createEmptyMember(),
        name: '新しい名前',
        note: 'メモ',
      });
    });
  });
});