import { useCallback, useEffect, useMemo, useState } from 'react';
import { DocumentList } from '@/components/Document/list';
import { useForm } from '@mantine/form';
import { useQuery } from '@tanstack/react-query';
import { useMeiliClient } from '@/hooks/useMeiliClient';
import { useCurrentInstance } from '@/hooks/useCurrentInstance';
import { useTranslation } from 'react-i18next';
import useDebounce from 'ahooks/lib/useDebounce';
import { Loader } from '../loader';
import { SearchForm } from './searchForm';

const emptySearchResult = {
  hits: [],
  estimatedTotalHits: 0,
  processingTimeMs: 0,
};

type Props = {
  currentIndex: string;
};

export const DocSearchPage = ({ currentIndex }: Props) => {
  const { t } = useTranslation('document');
  const [searchAutoRefresh, setSearchAutoRefresh] = useState<boolean>(false);
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
    refetchInterval: searchAutoRefresh ? 7000 : false,
    refetchOnMount: searchAutoRefresh,
    refetchOnWindowFocus: searchAutoRefresh,
    refetchOnReconnect: searchAutoRefresh,
    queryFn: async () => {
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
    searchAutoRefresh && searchDocumentsQuery.refetch();
    // prevent infinite recursion rerender.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchFormValue]);

  return useMemo(
    () => (
      <div className={`h-full flex flex-col p-4 gap-4 overflow-hidden`}>
        {/* Search bar */}
        <div className={`rounded-lg ${searchDocumentsQuery.isFetching ? 'rainbow-ring-rotate' : ''}`}>
          <div className={`rounded-lg p-4 border`}>
            <SearchForm
              onAutoRefreshChange={(v) => setSearchAutoRefresh(v)}
              isFetching={searchDocumentsQuery.isFetching}
              searchForm={searchForm}
              searchFormError={searchFormError}
              onFormSubmit={searchForm.onSubmit(onSearchSubmit)}
              submitBtnText={t('common:search')}
            />
          </div>
        </div>
        <div className="h-px w-full bg-neutral-200 scale-x-150"></div>
        <div className={`flex gap-x-4 justify-between items-baseline`}>
          <p className={`font-extrabold text-2xl`}>{t('search.results.label')} </p>
          <div className={`flex gap-2 px-4 font-light text-xs text-neutral-500`}>
            <p>
              {t('search.results.total_hits', { estimatedTotalHits: searchDocumentsQuery.data?.estimatedTotalHits })}
            </p>
            <p>
              {t('search.results.processing_time', { processingTimeMs: searchDocumentsQuery.data?.processingTimeMs })}
            </p>
          </div>
        </div>
        {/* Doc List */}
        <div className={`flex flex-col gap-4 overflow-scroll`}>
          {searchDocumentsQuery.isFetching ? (
            <div className={`flex-1 flex justify-center items-center`}>
              <Loader />
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
