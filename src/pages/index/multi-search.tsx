import { DocumentList } from '@/src/components/Document/list';
import { Header } from '@/src/components/Header';
import { useCurrentInstance } from '@/src/hooks/useCurrentInstance';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const MultiIndexSearch = () => {
  const currentInstance = useCurrentInstance();
  const host = currentInstance?.host;
  const client = useMeiliClient();

  const query = useQuery(
    [
      'multiSearchDocuments',
      host,
      // dependencies for the search refresh
      // searchForm.values,
    ],
    async ({ queryKey }) => {
      try {
        const data = await client!.multiSearch();

        return data || [];
      } catch (err) {
        return [];
      }
    },
    {
      enabled: !!client,
      keepPreviousData: true,
    }
  );

  return useMemo(
    () => (
      <div className="bg-mount full-page items-stretch p-5 gap-4">
        <Header client={client} />
        <div
          className={`flex-1 overflow-hidden bg-background-light 
        flex flex-col justify-start items-stretch
        p-6 rounded-3xl gap-y-2`}
        >
          <div className={`flex justify-between items-center gap-x-6`}>
            <div className={`font-extrabold text-xl`}>🌿 Multi Search</div>
          </div>
        </div>
      </div>
    ),
    [client]
  );
};
