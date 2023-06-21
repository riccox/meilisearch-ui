import { MeiliSearch } from 'meilisearch';
import { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import { toast } from '../utils/toast';
import { useCurrentInstance } from './useCurrentInstance';

export const useMeiliClient = () => {
  const currentInstance = useCurrentInstance();

  const [client, setClient] = useState<MeiliSearch>(
    new MeiliSearch({
      ...currentInstance,
    })
  );

  const connect = useCallback(async () => {
    console.debug('useMeilisearchClient', 'start connection');
    if (_.isEmpty(currentInstance?.host)) {
      toast.error('Connection fail, go check your config! 🤥');
      console.debug('useMeilisearchClient', 'connection config lost');
      // do not use useNavigate, because maybe in first render
      window.location.assign(import.meta.env.BASE_URL);
      return;
    }
    const conn = new MeiliSearch({ ...currentInstance });
    try {
      console.info('useMeilisearchClient', 'test connection');
      await conn.getStats();
      setClient(conn);
    } catch (err) {
      console.warn('useMeilisearchClient', 'test conn error', err);
      toast.error('Connection fail, go check your config! 🤥');
      // do not use useNavigate, because maybe in first render
      window.location.assign(import.meta.env.BASE_URL);
    }
  }, [currentInstance]);

  useEffect(() => {
    console.debug('useMeilisearchClient', 'rebuilt meili client');
    connect().then();
  }, [connect, currentInstance]);

  return client;
};
