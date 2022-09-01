import { Index } from 'meilisearch';
import { useState } from 'react';
import { useAppStore } from '@/src/store';
import { useQuery } from 'react-query';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';

export const useIndexes = () => {
  const store = useAppStore();
  const client = useMeiliClient();

  const [indexes, setIndexes] = useState<Index[]>();

  useQuery(
    ['indexes', store.config.host],
    async () => {
      return (await client.getIndexes()).results;
    },
    { refetchOnMount: 'always', onSuccess: (res) => setIndexes(res) }
  );

  return indexes;
};
