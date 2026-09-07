export enum characterAwakeType {
  BALANCE,
  ATTACK,
  DEFENSE,
  CONSECUTIVE, // 連続攻撃
}

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
