import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import produce from 'immer';

export interface WarningPageData {
  prompt: string;
}

export interface Instance {
  name: string;
  host: string;
  apiKey?: string;
  updatedTime?: Date;
}

export const defaultInstance: Instance = {
  name: 'default',
  host: 'http://127.0.0.1:7700',
  apiKey: undefined,
};

interface State {
  warningPageData?: WarningPageData;
  currentInstance?: Instance;
  instances: Instance[];
  setWarningPageData: (data?: WarningPageData) => void;
  setCurrentInstance: (ins: Instance) => void;
  addInstance: (cfg: Omit<Instance, 'updatedTime'>) => void;
  editInstance: (name: string, cfg: Omit<Instance, 'updatedTime'>) => void;
  removeInstance: (name: string) => void;
}

export const useAppStore = create<State>()(
  devtools(
    persist(
      (set) => ({
        instances: [],
        setWarningPageData: (data?: WarningPageData) =>
          set(
            produce((state: State) => {
              state.warningPageData = data;
            })
          ),
        setCurrentInstance: (ins) =>
          set(
            produce((state: State) => {
              state.currentInstance = ins;
            })
          ),
        addInstance: (cfg) =>
          set(
            produce((state: State) => {
              state.instances.push({ ...cfg, updatedTime: new Date() });
            })
          ),
        editInstance: (name, cfg) =>
          set(
            produce((state: State) => {
              const index = state.instances.findIndex((i) => i.name === name);
              if (index !== -1) state.instances[index] = { ...cfg, updatedTime: new Date() };
            })
          ),
        removeInstance: (name) =>
          set(
            produce((state: State) => {
              const index = state.instances.findIndex((i) => i.name === name);
              if (index !== -1) state.instances.splice(index, 1);
            })
          ),
      }),
      {
        name: 'meilisearch-ui-store',
        version: 4,
      }
    )
  )
);
