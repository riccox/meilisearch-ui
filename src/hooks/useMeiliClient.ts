import { MeiliSearch } from 'meilisearch';
import { useCallback, useEffect, useState } from 'react';
import { defaultInstance, useAppStore } from '@/src/store';
import _ from 'lodash';
import { toast } from '../utils/toast';

export const useMeiliClient = () => {
  const currentInstance = useAppStore((state) => state.currentInstance ?? defaultInstance);

  const [client, setClient] = useState<MeiliSearch>(
    new MeiliSearch({
      ...currentInstance,
    })
  );

  const connect = useCallback(async () => {
    console.debug('useMeilisearchClient', 'start connection');
    if (_.isEmpty(currentInstance?.host)) {
      toast('Connection fail, go check your config! 🤥', {
        type: 'warning',
      });
      console.debug('useMeilisearchClient', 'connection config lost');
      // do not use useNavigate, because maybe in first render
      window.location.assign('/');
      return;
    }
    const conn = new MeiliSearch({ ...currentInstance });
    try {
      console.info('useMeilisearchClient', 'test connection');
      await conn.getStats();
      setClient(conn);
    } catch (err) {
      console.warn('useMeilisearchClient', 'test conn error', err);
      toast('Connection fail, go check your config! 🤥', {
        type: 'warning',
      });
      // do not use useNavigate, because maybe in first render
      window.location.assign('/');
    }
  }, [currentInstance]);

  useEffect(() => {
    console.debug('useMeilisearchClient', 'rebuilt meili client');
    connect().then();
  }, [connect, currentInstance]);

  return client;
};
