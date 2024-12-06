import { LoaderPage } from '@/components/loader';
import { useCurrentIndex } from '@/hooks/useCurrentIndex';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DocumentList, ListType } from '@/components/Document/list';
import { useForm } from '@mantine/form';
import { useQuery } from '@tanstack/react-query';
import { useMeiliClient } from '@/hooks/useMeiliClient';
import { useCurrentInstance } from '@/hooks/useCurrentInstance';
import { useTranslation } from 'react-i18next';
import useDebounce from 'ahooks/lib/useDebounce';
import { Loader } from '@/components/loader';
import { SearchForm } from '@/components/Document/searchForm';
import { Button, Radio, RadioGroup } from '@douyinfe/semi-ui';
import { exportToJSON } from '@/utils/file';
import { z } from 'zod';
import { EmptyArea } from '@/components/EmptyArea';
import _ from 'lodash';
import { cn } from '@/lib/cn';

const emptySearchResult = {
  hits: [],
  estimatedTotalHits: 0,
  processingTimeMs: 0,
};

const searchSchema = z
  .object({
    q: z.string().optional().default(''),
    limit: z.number().positive().optional().default(20),
    offset: z.number().nonnegative().optional().default(0),
    filter: z.string().optional().default(''),
    sort: z.string().optional().default(''),
    listType: z.enum(['json', 'table', 'grid']).optional().default('json'),
    showRankingScore: z.coerce.boolean().optional().default(false),
  })
  .optional();

export const Page = () => {
  const navigate = useNavigate({ from: Route.fullPath });
  const searchParams = Route.useSearch();
  const { t } = useTranslation('document');
  const [listType, setListType] = useState<ListType>(searchParams?.listType || 'json');
  const [searchAutoRefresh, setSearchAutoRefresh] = useState<boolean>(false);
  const [searchFormError, setSearchFormError] = useState<string | null>(null);
  const client = useMeiliClient();
  const currentIndex = useCurrentIndex(client);
  const currentInstance = useCurrentInstance();
  const host = currentInstance?.host;

  const indexClient = useMemo(() => {
    return currentIndex ? client.index(currentIndex.index.uid) : undefined;
  }, [client, currentIndex]);

  const searchForm = useForm({
    initialValues: {
      ..._.omit(searchParams, ['listType']),
    },
    validate: {
      limit: (value: number) => (value < 500 ? null : t('search.form.limit.validation_error')),
    },
  });

  useEffect(() => {
    // update search params when form values changed
    navigate({
      search: () => ({
        ...searchForm.values,
        listType,
      }),
    });
  }, [navigate, searchForm.values, listType]);

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
        showRankingScore,
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
          showRankingScore,
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
        <div className={`flex gap-4 items-center`}>
          <p className={`font-extrabold text-2xl`}>{t('search.results.label')}</p>
          <RadioGroup
            type="button"
            buttonSize="middle"
            defaultValue={listType}
            onChange={(e) => setListType(e.target.value)}
          >
            <Radio value={'json'}>JSON</Radio>
            <Radio value={'table'}>{t('search.results.type.table')}</Radio>
            <Radio value={'grid'}>{t('search.results.type.grid')}</Radio>
          </RadioGroup>
          <div className={`ml-auto flex items-center gap-3 px-4 font-light text-xs text-neutral-500`}>
            <Button
              type="secondary"
              size="small"
              onClick={() => exportToJSON(searchDocumentsQuery.data?.hits || emptySearchResult.hits, 'search-results')}
            >
              {t('search.results.download')} {`(${searchDocumentsQuery.data?.hits.length || 0})`}
            </Button>
            <p>
              {t('search.results.total_hits', { estimatedTotalHits: searchDocumentsQuery.data?.estimatedTotalHits })}
            </p>
            <p>
              {t('search.results.processing_time', { processingTimeMs: searchDocumentsQuery.data?.processingTimeMs })}
            </p>
          </div>
        </div>
        {/* Doc List */}
        <div className={cn(`flex flex-col gap-4`, listType === 'table' ? 'overflow-y-scroll' : 'overflow-scroll')}>
          {searchDocumentsQuery.isFetching ? (
            <div className={`flex-1 flex justify-center items-center`}>
              <Loader />
            </div>
          ) : (searchDocumentsQuery.data?.hits.length || 0) > 0 ? (
            <DocumentList
              currentIndex={currentIndex.index}
              type={listType}
              docs={searchDocumentsQuery.data?.hits.map((i) => ({
                indexId: currentIndex.index.uid,
                content: i,
                primaryKey: indexPrimaryKeyQuery.data!,
              }))}
              refetchDocs={searchDocumentsQuery.refetch}
            />
          ) : (
            <div className="scale-75">
              <EmptyArea />
            </div>
          )}
        </div>
      </div>
    ),
    [
      searchDocumentsQuery.isFetching,
      searchDocumentsQuery.data?.estimatedTotalHits,
      searchDocumentsQuery.data?.processingTimeMs,
      searchDocumentsQuery.data?.hits,
      searchDocumentsQuery.refetch,
      searchForm,
      searchFormError,
      onSearchSubmit,
      t,
      listType,
      currentIndex,
      indexPrimaryKeyQuery.data,
    ]
  );
};

export const Route = createFileRoute('/ins/$insID/_layout/index/$indexUID/_layout/documents/')({
  component: Page,
  pendingComponent: LoaderPage,
  validateSearch: searchSchema,
});
