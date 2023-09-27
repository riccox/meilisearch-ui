import { hiddenConnectionTestLoader, showConnectionTestLoader } from '@/src/utils/loader';
import { Config, MeiliSearch } from 'meilisearch';
import _ from 'lodash';
import { WarningPageData } from '@/src/store';
import { toast } from './toast';
import i18n from './i18n';

const t = i18n.t;

export const testConnection = async (cfg: Config) => {
  showConnectionTestLoader();
  const client = new MeiliSearch({ ...cfg });
  let stats;
  try {
    stats = await client.getStats();
    console.debug('[meilisearch connection test]', stats);
  } catch (e) {
    console.warn('[meilisearch connection test error]', e);
    toast.error(t('instance:connection_failed'));
    // stop loading when error.
    hiddenConnectionTestLoader();
    throw e;
  }
  // stop loading
  hiddenConnectionTestLoader();
  if (_.isEmpty(stats)) {
    const msg = t('instance:connection_failed');
    toast.error(msg);
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
      prompt: t('instance:no_master_key_error'),
    };
  } else {
    return null;
  }
};
