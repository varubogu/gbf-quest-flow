import type { Action } from '@/types/models';

/**
 * 空のアクション行を作成する
 * @returns 初期値が設定された新しいAction
 */
export const createEmptyRow = (): Action => {
  return {
    hp: '',
    prediction: '',
    charge: '',
    guard: '',
    action: '',
    note: '',
  };
};