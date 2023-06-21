import { MeiliSearch, Stats } from 'meilisearch';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCurrentInstance } from './useCurrentInstance';

export const useInstanceStats = (client: MeiliSearch) => {
  const currentInstance = useCurrentInstance();
  const host = currentInstance?.host;
  const [stats, setStats] = useState<Stats>();

  useQuery(
    ['stats', host],
    async () => {
      return await client.getStats();
    },
    {
      onSuccess: (res) => setStats(res),
      onError: (err) => {
        console.warn('get meilisearch stats error', err);
      },
    }
  );

  return stats;
};
