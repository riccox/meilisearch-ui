import { useCallback, useEffect, useMemo, useState } from 'react';
import { DocumentList } from '@/src/components/Document/list';
import { SearchBar } from '@/src/components/Document/searchBar';
import { useForm } from '@mantine/form';
import { useQuery } from '@tanstack/react-query';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { useCurrentInstance } from '@/src/hooks/useCurrentInstance';
import { useTranslation } from 'react-i18next';
import useDebounce from 'ahooks/lib/useDebounce';
import { Loader } from '../Loader';

const emptySearchResult = {
  hits: [],
  estimatedTotalHits: 0,
  processingTimeMs: 0,
};

type Props = {
  currentIndex: string;
};

export const SearchPage = ({ currentIndex }: Props) => {
  const { t } = useTranslation('document');
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
      limit: (value: number) => (value < 500 ? null : t('search.form.limit.validation_error')),
    },
  });

  const indexPrimaryKeyQuery = useQuery({
    queryKey: ['indexPrimaryKey', host, indexClient?.uid],
    queryFn: async () => {
      return (await indexClient?.getRawInfo())?.primaryKey;
    },

    enabled: !!currentIndex,
  });

  // use debounced values as dependencies for the search refresh
  const debouncedSearchFormValue = useDebounce(searchForm.values, { wait: 450 });

  const searchDocumentsQuery = useQuery({
    queryKey: ['searchDocuments', host, indexClient?.uid],
    refetchInterval: false,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    queryFn: async ({ queryKey }) => {
      const {
        q,
        limit,
        offset,
        filter,
        sort = '',
      } = { ...searchForm.values, ...(debouncedSearchFormValue as typeof searchForm.values) };
      // prevent app error from request param invalid
      if (searchForm.validate().hasErrors) return emptySearchResult;

      // search sorting expression
      const sortExpressions: string[] =
        (sort.match(/(([\w\.]+)|(_geoPoint\([\d\.,\s]+\))){1}\:((asc)|(desc))/g) as string[]) || [];

      console.debug('search sorting expression', sort, sortExpressions);

      try {
        const data = await indexClient!.search(q, {
          limit,
          offset,
          filter,
          sort: sortExpressions.map((v) => v.trim()),
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

    enabled: !!currentIndex,
  });

  const onSearchSubmit = useCallback(async () => {
    await searchDocumentsQuery.refetch();
  }, [searchDocumentsQuery]);

  // use this to refresh search when typing, DO NOT use useQuery dependencies (will cause unknown rerender error).
  useEffect(() => {
    searchDocumentsQuery.refetch();
    // prevent infinite recursion rerender.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchFormValue]);

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
          <p className={`font-extrabold text-2xl`}>{t('search.results.label')} </p>
          <div className={`flex gap-x-2 px-4 font-thin text-xs text-neutral-500`}>
            <p>
              {t('search.results.total_hits', { estimatedTotalHits: searchDocumentsQuery.data?.estimatedTotalHits })}
            </p>
            <p>
              {t('search.results.processing_time', { processingTimeMs: searchDocumentsQuery.data?.processingTimeMs })}
            </p>
          </div>
        </div>
        {/* Doc List */}
        <div className={`flex-1 flex flex-col gap-4 overflow-scroll`}>
          {searchDocumentsQuery.isFetching ? (
            <div className={`flex-1 flex justify-center items-center`}>
              <Loader size={'md'} />
            </div>
          ) : (
            <DocumentList
              docs={searchDocumentsQuery.data?.hits.map((i) => ({
                indexId: currentIndex,
                content: i,
                primaryKey: indexPrimaryKeyQuery.data!,
              }))}
              refetchDocs={searchDocumentsQuery.refetch}
            />
          )}
        </div>
      </div>
    ),
    [
      currentIndex,
      t,
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
