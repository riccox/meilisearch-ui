import { useCallback, useMemo, useState } from 'react';
import { DocumentList } from '@/src/components/Document/list';
import { SearchBar } from '@/src/components/Document/searchBar';
import { useForm } from '@mantine/form';
import { useQuery } from '@tanstack/react-query';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { useCurrentInstance } from '@/src/hooks/useCurrentInstance';

const emptySearchResult = {
  hits: [],
  estimatedTotalHits: 0,
  processingTimeMs: 0,
};

type Props = {
  currentIndex: string;
};

export const SearchPage = ({ currentIndex }: Props) => {
  const [searchFormError, setSearchFormError] = useState<string | null>(null);
  const currentInstance = useCurrentInstance();
  const host = currentInstance?.host;
  const client = useMeiliClient();

  const indexClient = useMemo(() => {
    return currentIndex ? client.index(currentIndex) : undefined;
  }, [client, currentIndex]);

  const searchForm = useForm({
    initialValues: {
      q: '',
      offset: 0,
      limit: 20,
      filter: '',
      sort: '',
    },
    validate: {
      limit: (value: number) =>
        value < 500 ? null : 'limit search value allow (<500) in this ui console for performance',
    },
  });

  const indexPrimaryKeyQuery = useQuery(
    ['indexPrimaryKey', host, indexClient?.uid],
    async () => {
      return (await indexClient?.getRawInfo())?.primaryKey;
    },
    {
      enabled: !!currentIndex,
      keepPreviousData: true,
    }
  );

  const searchDocumentsQuery = useQuery(
    [
      'searchDocuments',
      host,
      indexClient?.uid,
      // dependencies for the search refresh
      searchForm.values,
    ],
    async ({ queryKey }) => {
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
        setSearchFormError(null);
        return data || emptySearchResult;
      } catch (err) {
        const msg = (err as Error).message;
        setSearchFormError(null);
        if (msg.match(/filter/i)) {
          searchForm.setFieldError('filter', msg);
        } else if (msg.match(/sort/i)) {
          searchForm.setFieldError('sort', msg);
        } else {
          setSearchFormError(msg);
        }
        return emptySearchResult;
      }
    },
    {
      enabled: !!currentIndex,
      keepPreviousData: true,
    }
  );

  const onSearchSubmit = useCallback(async () => {
    await searchDocumentsQuery.refetch();
  }, [searchDocumentsQuery]);

  return useMemo(
    () => (
      <div className={`h-full flex flex-col p-6 gap-4 overflow-hidden`}>
        {/* Search bar */}
        <SearchBar
          isFetching={searchDocumentsQuery.isFetching}
          searchForm={searchForm}
          searchFormError={searchFormError}
          onFormSubmit={searchForm.onSubmit(onSearchSubmit)}
        />
        <div className={`flex gap-x-4 justify-between items-baseline`}>
          <p className={`font-extrabold text-2xl`}>Results </p>
          <div className={`flex gap-x-2 px-4 font-thin text-xs text-neutral-500`}>
            <p>total {searchDocumentsQuery.data?.estimatedTotalHits} hits</p>
            <p>in {searchDocumentsQuery.data?.processingTimeMs} ms</p>
          </div>
        </div>
        {/* Doc List */}
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
      </div>
    ),
    [
      currentIndex,
      indexPrimaryKeyQuery.data,
      onSearchSubmit,
      searchDocumentsQuery.data?.estimatedTotalHits,
      searchDocumentsQuery.data?.hits,
      searchDocumentsQuery.data?.processingTimeMs,
      searchDocumentsQuery.isFetching,
      searchDocumentsQuery.refetch,
      searchForm,
      searchFormError,
    ]
  );
};
