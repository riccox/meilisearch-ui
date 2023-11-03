import { MeiliSearch, Stats } from 'meilisearch';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCurrentInstance } from './useCurrentInstance';

export const useInstanceStats = (client: MeiliSearch) => {
  const currentInstance = useCurrentInstance();
  const host = currentInstance?.host;
  const [stats, setStats] = useState<Stats>();

  const query = useQuery({
    queryKey: ['stats', host],
    queryFn: async () => {
      return await client.getStats();
    },
  });

  useEffect(() => {
    if (query.isSuccess) {
      setStats(query.data);
    }
    if (query.isError) {
      console.warn('get meilisearch stats error', query.error);
    }
  }, [query.data, query.error, query.isError, query.isSuccess]);

  return stats;
};
