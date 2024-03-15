import { MeiliSearch } from 'meilisearch';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCurrentInstance } from './useCurrentInstance';

export const useInstanceHealth = (client: MeiliSearch) => {
  const currentInstance = useCurrentInstance();

  const [health, setHealth] = useState<boolean>(true);

  const queryHealth = useQuery({
    queryKey: ['health', currentInstance?.host],
    queryFn: async () => {
      return (await client.health()).status === 'available';
    },
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (queryHealth.isSuccess) {
      setHealth(queryHealth.data);
    }
  }, [queryHealth.data, queryHealth.isSuccess]);

  return health;
};
