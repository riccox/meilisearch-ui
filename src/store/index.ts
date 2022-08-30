import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import produce from 'immer';
import _ from 'lodash';

interface State {
  config: {
    host: string;
    apiKey: string;
  };
  history: {
    host: string[];
  };
  start: (cfg: { host: string; apiKey: string }) => void;
}

export const useAppStore = create<State>()(
  devtools(
    persist(
      (set) => ({
        config: {
          host: 'http://127.0.0.1:7700',
          apiKey: 'masterKey',
        },
        history: {
          host: ['http://127.0.0.1:7700'],
        },
        start: (cfg) =>
          set(
            produce((state: State) => {
              state.config = cfg;
              state.history.host.push(cfg.host);
              state.history.host = _.uniq(state.history.host);
            })
          ),
      }),
      {
        name: 'meilisearch-ui-store',
      }
    )
  )
);
