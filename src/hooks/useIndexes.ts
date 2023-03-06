import { Index, MeiliSearch } from 'meilisearch';
import { useState } from 'react';
import { useAppStore } from '@/src/store';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { IndexesQuery } from 'meilisearch/src/types';

export const useIndexes = (client: MeiliSearch, params?: IndexesQuery): [Index[], UseQueryResult] => {
  const host = useAppStore((state) => state.currentInstance?.host);

  const [indexes, setIndexes] = useState<Index[]>([]);

  const query = useQuery(
    ['indexes', host],
    async () => {
      return (await client.getIndexes(params)).results;
    },
    { refetchOnMount: 'always', refetchInterval: 10000, onSuccess: (res) => setIndexes(res) }
  );

  return [indexes, query];
};
