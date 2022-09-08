import { MeiliSearch } from 'meilisearch';
import { useCallback, useEffect, useState } from 'react';
import { useAppStore } from '@/src/store';
import _ from 'lodash';
import { showNotification } from '@mantine/notifications';

export const useMeiliClient = () => {
  const currentInstance = useAppStore(
    (state) =>
      state.currentInstance ?? {
        host: '',
        apiKey: '',
      }
  );

  const [client, setClient] = useState<MeiliSearch>(
    new MeiliSearch({
      ...currentInstance,
    })
  );

  const connect = useCallback(async () => {
    console.debug('useMeilisearchClient', 'start connection');
    if (_.isEmpty(currentInstance?.host) || _.isEmpty(currentInstance?.apiKey)) {
      showNotification({
        color: 'warning',
        title: 'Reconnection Required',
        message: 'Connection fail, go check your config! 🤥',
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
      showNotification({
        color: 'warning',
        title: 'Connection Fail',
        message: 'Go check your config! 🤥',
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
