import './index.css';
import { useCallback, useMemo } from 'react';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { useQuery } from 'react-query';
import { useAppStore } from '@/src/store';
import { hiddenRequestLoader, showRequestLoader } from '@/src/utils/loader';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { stringifyJsonPretty } from '@/src/utils/text';

function Settings() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const client = useMeiliClient();
  const host = useAppStore((state) => state.currentInstance?.host);

  const settingsQuery = useQuery(
    ['settings', host, searchParams.get('index')],
    async () => {
      showRequestLoader();
      if (searchParams.get('index')) {
        return await client.index(searchParams.get('index') ?? '').getSettings();
      } else {
        navigate('/index');
      }
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

  return useMemo(
    () => (
      <div
        className={`fill overflow-hidden bg-background-light 
        flex flex-col items-stretch
        p-6 rounded-3xl gap-y-4`}
      >
        <div className={`flex justify-between items-center gap-x-6`}>
          <div className={`font-extrabold text-3xl`}>🛠️ Settings</div>
        </div>
        <div className={`flex-1 flex justify-center items-center`}>
          <div className={`grid grid-cols-12 options-grid gap-y-4 overflow-scroll`}>
            <div>Displayed Attributes</div>
            <div>{settingsQuery.data?.displayedAttributes}</div>
            <div>Searchable Attributes</div>
            <div>{settingsQuery.data?.searchableAttributes}</div>
            <div>Filterable Attributes</div>
            <div>{settingsQuery.data?.filterableAttributes}</div>
            <div>Sortable Attributes</div>
            <div>{settingsQuery.data?.sortableAttributes}</div>
            <div>Ranking Rules</div>
            <div>{settingsQuery.data?.rankingRules}</div>
            <div>Stop Words</div>
            <div>{settingsQuery.data?.stopWords}</div>
            <div>Synonyms</div>
            <div>{stringifyJsonPretty(settingsQuery.data?.synonyms)}</div>
            <div>Distinct Attribute</div>
            <div>{settingsQuery.data?.distinctAttribute}</div>
            <div>Typo Tolerance - Enabled</div>
            <div>{settingsQuery.data?.typoTolerance?.enabled}</div>
            <div>Typo Tolerance - Disable On Attributes</div>
            <div>{settingsQuery.data?.typoTolerance?.disableOnAttributes}</div>
            <div>Typo Tolerance - Disable On Words</div>
            <div>{settingsQuery.data?.typoTolerance?.disableOnWords}</div>
            <div>Typo Tolerance - Min Word Size For Typos</div>
            <div>{stringifyJsonPretty(settingsQuery.data?.typoTolerance?.minWordSizeForTypos)}</div>
            <div>Faceting - Max Values PerFacet</div>
            <div>{settingsQuery.data?.faceting?.maxValuesPerFacet}</div>
            <div>Pagination - Max Total Hits</div>
            <div>{settingsQuery.data?.pagination?.maxTotalHits}</div>
          </div>
        </div>
      </div>
    ),
    [settingsQuery.data]
  );
}

export default Settings;
