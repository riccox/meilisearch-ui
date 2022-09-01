import { Stats } from 'meilisearch';
import { useState } from 'react';
import { useAppStore } from '@/src/store';
import { useQuery } from 'react-query';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';

export const useInstanceStats = () => {
  const store = useAppStore();
  const client = useMeiliClient();

  const [stats, setStats] = useState<Stats>();

  useQuery(
    ['stats', store.config.host],
    async () => {
      return await client.getStats();
    },
    { refetchOnMount: 'always', onSuccess: (res) => setStats(res) }
  );

  return stats;
};
