import { hiddenConnectionTestLoader, showConnectionTestLoader } from '@/src/utils/loader';
import { Config, MeiliSearch } from 'meilisearch';
import _ from 'lodash';
import { WarningPageData } from '@/src/store';
import { toast } from './toast';

export const testConnection = async (cfg: Config) => {
  showConnectionTestLoader();
  const client = new MeiliSearch({ ...cfg });
  let stats;
  try {
    stats = await client.getStats();
    console.debug('[meilisearch connection test]', stats);
  } catch (e) {
    console.warn('[meilisearch connection test error]', e);
    toast('Connection fail, go check your config! 🤥', {
      type: 'warning',
    });
    throw e;
  }
  // stop loading
  hiddenConnectionTestLoader();
  if (_.isEmpty(stats)) {
    const msg = 'Connection fail, go check your config! 🤥';
    toast(msg, {
      type: 'warning',
    });
    console.error(msg, stats);
    throw new Error('msg');
  }
};

/**
 * check before keys page (no masterKey will cause error)
 */
export const validateKeysRouteAvailable = (apiKey?: string): null | WarningPageData => {
  if (_.isEmpty(apiKey)) {
    return {
      prompt:
        'Meilisearch is running without a master key.\nTo access this API endpoint, you must have set a master key at launch.',
    };
  } else {
    return null;
  }
};
