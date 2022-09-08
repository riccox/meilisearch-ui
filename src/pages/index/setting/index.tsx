import { useCallback } from 'react';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { Index } from 'meilisearch';
import { useQuery } from 'react-query';
import { useAppStore } from '@/src/store';
import { hiddenRequestLoader, showRequestLoader } from '@/src/utils/loader';
import { useOutletContext } from 'react-router-dom';

function Settings() {
  const context = useOutletContext<{
    currentIndex?: Index;
  }>();
  const client = useMeiliClient();
  const host = useAppStore((state) => state.currentInstance?.host);

  const settingsQuery = useQuery(
    ['settings', host, context.currentIndex?.uid],
    async () => {
      showRequestLoader();
      return await client.index(context.currentIndex?.uid ?? '').getSettings();
    },
    {
      keepPreviousData: true,
      refetchOnMount: 'always',
      onError: (err) => {
        console.warn('get meilisearch settings error', err);
      },
      onSettled: () => {
        hiddenRequestLoader();
      },
    }
  );

  const refreshSettings = useCallback(() => {
    // wait for create key task complete
    setTimeout(() => {
      settingsQuery.refetch().then();
    }, 1000);
  }, [settingsQuery]);

  return (
    <div className="flex-1 gap-4">
      <div
        className={`flex-1 overflow-hidden bg-background-light 
        flex flex-col justify-start items-stretch
        p-6 rounded-3xl gap-y-2`}
      >
        <div className={`flex justify-between items-center gap-x-6`}>
          <div className={`font-extrabold text-3xl`}>🛠️ Settings</div>
        </div>
        <div className={``}></div>
      </div>
    </div>
  );
}

export default Settings;
