import { Index, MeiliSearch } from 'meilisearch';
import { useState } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { IndexesQuery } from 'meilisearch/src/types';
import { useCurrentInstance } from './useCurrentInstance';

export const useIndexes = (client: MeiliSearch, params?: IndexesQuery): [Index[], UseQueryResult] => {
  const currentInstance = useCurrentInstance();
  const host = currentInstance?.host;

  const [indexes, setIndexes] = useState<Index[]>([]);

  const query = useQuery(
    ['indexes', host],
    async () => {
      return (await client.getIndexes(params)).results;
    },
    { onSuccess: (res) => setIndexes(res) }
  );

  return [indexes, query];
};
