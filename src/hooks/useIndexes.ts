import { Index, MeiliSearch } from 'meilisearch';
import { useState } from 'react';
import { useAppStore } from '@/src/store';
import { useQuery, UseQueryResult } from 'react-query';

export const useIndexes = (client: MeiliSearch): [Index[], UseQueryResult] => {
  const host = useAppStore((state) => state.currentInstance?.host);

  const [indexes, setIndexes] = useState<Index[]>([]);

  const query = useQuery(
    ['indexes', host],
    async () => {
      return (await client.getIndexes()).results;
    },
    { refetchOnMount: 'always', onSuccess: (res) => setIndexes(res) }
  );

  return [indexes, query];
};
