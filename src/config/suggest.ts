export const characterAwakeType = {
  BALANCE: 0,
  ATTACK: 1,
  DEFENSE: 2,
  CONSECUTIVE: 3, // 連続攻撃
} as const;

export const characterAwakeTypeSuggest = [
  {
    id: 'none',
    translationKey: 'none',
  },
  {
    id: characterAwakeType.BALANCE,
    translationKey: 'balance',
  },
  {
    id: characterAwakeType.ATTACK,
    translationKey: 'attack',
  },
  {
    id: characterAwakeType.DEFENSE,
    translationKey: 'defense',
  },
  {
    id: characterAwakeType.CONSECUTIVE,
    translationKey: 'consecutive',
  },
];

export const chargeAttackSelect = ['〇', '✖'];

export const guardSelect = ['〇', '✖'];
