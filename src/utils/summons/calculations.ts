import type { Summon } from '@/types/models';

export const createEmptySummon = (): Summon => ({
  name: '',
  note: '',
});

export const updateSummonField = (
  summon: Summon,
  field: keyof Summon,
  value: string
): Summon => {
  return {
    ...createEmptySummon(),
    ...summon,
    [field]: value,
  };
};

export const updateSummonArrayField = (
  summons: Summon[],
  index: number,
  field: keyof Summon,
  value: string
): Summon[] => {
  const newSummons = [...summons];
  newSummons[index] = updateSummonField(summons[index], field, value);
  return newSummons;
};