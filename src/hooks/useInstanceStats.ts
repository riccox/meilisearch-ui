import { MeiliSearch, Stats } from 'meilisearch';
import { useState } from 'react';
import { useAppStore } from '@/src/store';
import { useQuery } from '@tanstack/react-query';

export const useInstanceStats = (client: MeiliSearch) => {
  const host = useAppStore((state) => state.currentInstance?.host);

  const [stats, setStats] = useState<Stats>();

  useQuery(
    ['stats', host],
    async () => {
      return await client.getStats();
    },
    {
      refetchOnMount: 'always',
      refetchInterval: 10000,
      onSuccess: (res) => setStats(res),
      onError: (err) => {
        console.warn('get meilisearch stats error', err);
      },
    }
  );

  return stats;
};
