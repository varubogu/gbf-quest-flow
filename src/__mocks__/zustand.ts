import { act } from '@testing-library/react';
import type * as ZustandExportedTypes from 'zustand';
import { afterEach } from 'vitest';
import * as zustand from 'zustand';
export * from 'zustand';

const actualCreate = zustand.create;

// すべてのストアのリセット関数を保持する変数
export const storeResetFns = new Set<() => void>();

const createUncurried = <T>(stateCreator: ZustandExportedTypes.StateCreator<T>): ZustandExportedTypes.StoreApi<T> => {
  const store = actualCreate(stateCreator);
  const initialState = store.getState();
  storeResetFns.add(() => {
    store.setState(initialState, true);
  });
  return store;
};

// ストア作成時に初期状態を取得し、リセット関数を作成してセットに追加
export const create = (<T>(stateCreator: ZustandExportedTypes.StateCreator<T>) => {
  console.log('zustand create mock');

  // createの巻き上げバージョンをサポート
  return typeof stateCreator === 'function' ? createUncurried(stateCreator) : createUncurried;
}) as typeof ZustandExportedTypes.create;

// 各テスト後にすべてのストアをリセット
afterEach(() => {
  act(() => {
    storeResetFns.forEach((resetFn) => {
      resetFn();
    });
  });
});
