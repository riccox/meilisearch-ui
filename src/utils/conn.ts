import { hiddenConnectionTestLoader, showConnectionTestLoader } from '@/src/utils/loader';
import { Config, MeiliSearch } from 'meilisearch';
import _ from 'lodash';
import { showNotification } from '@mantine/notifications';

export const testConnection = async (cfg: Config) => {
  showConnectionTestLoader();
  const client = new MeiliSearch({ ...cfg });
  let stats;
  try {
    stats = await client.getStats();
    console.debug('[meilisearch connection test]', stats);
  } catch (e) {
    console.warn('[meilisearch connection test]', e);
    showNotification({
      color: 'yellow',
      title: 'Fail',
      message: 'Connection fail, go check your config! 🤥',
    });
    throw e;
  }
  // stop loading
  hiddenConnectionTestLoader();
  if (_.isEmpty(stats)) {
    showNotification({
      color: 'yellow',
      title: 'Fail',
      message: 'Connection fail, go check your config! 🤥',
    });
    throw new Error(stats);
  }
};
