/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */

export enum characterAwakeType {
  BALANCE,
  ATTACK,
  DEFENSE,
  CONSECUTIVE, // 連続攻撃
}

/* eslint-enable @typescript-eslint/no-unused-vars, no-unused-vars */

export const characterAwakeTypeSuggest = [
  {
    id: characterAwakeType.BALANCE,
    translationKey: 'balance'
  },
  {
    id: characterAwakeType.ATTACK,
    translationKey: 'attack'
  },
  {
    id: characterAwakeType.DEFENSE,
    translationKey: 'defense'
  },
  {
    id: characterAwakeType.CONSECUTIVE,
    translationKey: 'consecutive'
  }
]

export const chargeAttackSelect = [
  '〇',
  '✖'
]

export const guardSelect = [
  '〇',
  '✖'
]

