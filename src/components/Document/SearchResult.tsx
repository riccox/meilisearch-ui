import { DocumentList } from '@/src/components/Document/list';
import { useCurrentInstance } from '@/src/hooks/useCurrentInstance';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { UseFormReturnType } from '@mantine/form';
import { IconCaretUpDown } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  currentIndex: string;
  searchForm: UseFormReturnType<{
    q: string;
    offset: number;
    limit: number;
    filter: string;
    sort: string;
  }>;
  setError: (error: string | null) => void;
  toggleSearchBar: () => void;
};

const emptySearchResult = {
  hits: [],
  estimatedTotalHits: 0,
  processingTimeMs: 0,
};

export default function SearchResult({ currentIndex, searchForm, setError, toggleSearchBar }: Props) {
  const { t } = useTranslation('document');
  const currentInstance = useCurrentInstance();
  const host = currentInstance?.host;
  const client = useMeiliClient();

  const indexClient = useMemo(() => {
    return currentIndex ? client.index(currentIndex) : undefined;
  }, [client, currentIndex]);

  const indexPrimaryKeyQuery = useQuery({
    queryKey: ['indexPrimaryKey', host, indexClient?.uid],
    queryFn: async () => {
      return (await indexClient?.getRawInfo())?.primaryKey;
    },
    enabled: !!currentIndex,
  });

  const searchDocumentsQuery = useQuery({
    queryKey: [
      'searchDocuments',
      host,
      indexClient?.uid,
      // dependencies for the search refresh
      searchForm.values,
    ],
    queryFn: async ({ queryKey }) => {
      const { q, limit, offset, filter, sort } = { ...searchForm.values, ...(queryKey[3] as typeof searchForm.values) };
      // prevent app error from request param invalid
      if (searchForm.validate().hasErrors) return emptySearchResult;
      try {
        const data = await indexClient!.search(q, {
          limit,
          offset,
          filter,
          sort: sort
            .split(',')
            .filter((v) => v.trim().length > 0)
            .map((v) => v.trim()),
        });
        // clear error message if results are running normally
        setError(null);
        return data || emptySearchResult;
      } catch (err) {
        const msg = (err as Error).message;
        setError(null);
        if (msg.match(/filter/i)) {
          searchForm.setFieldError('filter', msg);
        } else if (msg.match(/sort/i)) {
          searchForm.setFieldError('sort', msg);
        } else {
          setError(msg);
        }
        return emptySearchResult;
      }
    },
    enabled: !!currentIndex,
  });

  return (
    <>
      <div className={`flex gap-x-4 justify-between items-baseline`}>
        <p className={`font-extrabold text-2xl`}>{t('search.results.label')} </p>
        <div className={`flex gap-x-2 px-4 font-thin text-lg text-neutral-500`}>
          <p>{t('search.results.total_hits', { estimatedTotalHits: searchDocumentsQuery.data?.estimatedTotalHits })}</p>
          <p>
            {t('search.results.processing_time', { processingTimeMs: searchDocumentsQuery.data?.processingTimeMs })}
          </p>
          <button type="button" className="font-bold text-black p-1 rounded-md" onClick={toggleSearchBar}>
            <IconCaretUpDown size={26} />
          </button>
        </div>
      </div>
      <div className={`flex-1 flex flex-col gap-4 overflow-scroll`}>
        <DocumentList
          docs={searchDocumentsQuery.data?.hits.map((i) => ({
            indexId: currentIndex,
            content: i,
            primaryKey: indexPrimaryKeyQuery.data!,
          }))}
          refetchDocs={searchDocumentsQuery.refetch}
        />
      </div>
    </>
  );
}
