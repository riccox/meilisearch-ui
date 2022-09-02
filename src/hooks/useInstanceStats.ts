import { Stats } from 'meilisearch';
import { useState } from 'react';
import { useAppStore } from '@/src/store';
import { useQuery } from 'react-query';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';

export const useInstanceStats = () => {
  const host = useAppStore((state) => state.currentInstance?.host);
  const client = useMeiliClient();

  const [stats, setStats] = useState<Stats>();

  useQuery(
    ['stats', host],
    async () => {
      return await client.getStats();
    },
    {
      refetchOnMount: 'always',
      onSuccess: (res) => setStats(res),
      onError: (err) => {
        console.warn('get meilisearch stats error', err);
      },
    }
  );

  return stats;
};
