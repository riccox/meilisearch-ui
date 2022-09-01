import { MeiliSearch } from 'meilisearch';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/src/store';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';

export const useMeiliClient = () => {
  const navigate = useNavigate();
  const store = useAppStore();

  const [client, setClient] = useState<MeiliSearch>(new MeiliSearch({ ...store.config }));

  useEffect(() => {
    if (_.isEmpty(store.config.host) || _.isEmpty(store.config.apiKey)) {
      showNotification({
        color: 'warning',
        title: 'Reconnection Required',
        message: 'Connection fail, go check your config! 🤥',
      });
      navigate('/start');
    }
    const conn = new MeiliSearch({ ...store.config });
    conn
      .getStats()
      .then(() => {
        setClient(conn);
      })
      .catch((err) => {
        showNotification({
          color: 'warning',
          title: 'Connection Fail',
          message: 'Go check your config! 🤥',
        });
        navigate('/start');
      });
  }, []);

  return client;
};
