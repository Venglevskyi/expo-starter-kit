import type { StateCreator } from 'zustand';
import { create as actualCreate } from 'zustand';

const storeResetFns = new Set<() => void>();

export const create = (<T>() => {
  return (stateCreator: StateCreator<T>) => {
    const store = actualCreate(stateCreator);
    const initialState = store.getInitialState();
    storeResetFns.add(() => {
      store.setState(initialState, true);
    });
    return store;
  };
}) as typeof actualCreate;

export const resetAllStores = () => {
  storeResetFns.forEach((resetFn) => {
    resetFn();
  });
};

type PersistMigration<TState> = (state: any) => TState;

export const createPersistMigrator = <TState>(migrations: PersistMigration<TState>[]) => ({
  version: migrations.length,
  migrate: (state: unknown, fromVersion: number): TState => {
    let nextState = state as TState;
    for (let migrationIndex = fromVersion; migrationIndex < migrations.length; migrationIndex++) {
      nextState = migrations[migrationIndex](nextState);
    }
    return nextState;
  },
});
