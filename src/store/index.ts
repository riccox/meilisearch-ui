import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import produce from 'immer';

export interface Instance {
  name: string;
  host: string;
  apiKey: string;
  addTime: Date;
}

interface State {
  currentInstance?: Instance;
  instances: Instance[];
  setCurrentInstance: (ins: Instance) => void;
  addInstance: (cfg: Omit<Instance, 'addTime'>) => void;
}

export const useAppStore = create<State>()(
  devtools(
    persist(
      (set) => ({
        instances: [],
        setCurrentInstance: (ins) =>
          set(
            produce((state: State) => {
              state.currentInstance = ins;
            })
          ),
        addInstance: (cfg) =>
          set(
            produce((state: State) => {
              state.instances.push({ ...cfg, addTime: new Date() });
            })
          ),
      }),
      {
        name: 'meilisearch-ui-store',
        version: 2,
      }
    )
  )
);
