import type { Member } from '@/types/models';

export const createEmptyMember = (): Member => ({
  name: '',
  note: '',
  awaketype: '',
  accessories: '',
  limitBonus: '',
});

export const updateMemberField = (
  members: Member[],
  index: number,
  field: keyof Member,
  value: string
): Member[] => {
  const newMembers = [...members];
  newMembers[index] = {
    ...createEmptyMember(),
    ...newMembers[index],
    [field]: value,
  };
  return newMembers;
};