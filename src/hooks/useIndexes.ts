import { Index, MeiliSearch } from 'meilisearch';
import { useEffect, useState } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { IndexesQuery } from 'meilisearch/src/types';
import { useCurrentInstance } from './useCurrentInstance';

export const useIndexes = (client: MeiliSearch, params?: IndexesQuery): [Index[], UseQueryResult] => {
  const currentInstance = useCurrentInstance();
  const host = currentInstance?.host;

  const [indexes, setIndexes] = useState<Index[]>([]);

  const query = useQuery({
    queryKey: ['indexes', host],
    queryFn: async () => {
      return (await client.getIndexes(params)).results;
    },
  });

  useEffect(() => {
    if (query.isSuccess) {
      setIndexes(query.data);
    }
  }, [query.data, query.isSuccess]);

  return [indexes, query];
};
