import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { PaginationSettings as TPagination } from 'meilisearch';
import { FC, useEffect, useMemo } from 'react';
import { IndexSettingConfigComponentProps } from '../..';
import _ from 'lodash';

export const Pagination: FC<IndexSettingConfigComponentProps> = ({ client, className, host, toggleLoading }) => {
  const query = useQuery({
    queryKey: ['getPagination', host, client.uid],
    refetchInterval: 4500,
    async queryFn(ctx) {
      return (await client.getPagination()) as TPagination;
    },
  });

  const mutation = useMutation({
    mutationKey: ['updatePagination', host, client.uid],
    async mutationFn(variables: TPagination) {
      console.debug('🚀 ~ file: pagination.tsx:19 ~ mutationFn ~ variables:', variables);
      if (_.isEmpty(variables)) {
        // empty to reset
        return await client.resetPagination();
      }
      return await client.updatePagination(variables);
    },
  });

  useEffect(() => {
    const isLoading = query.isLoading || query.isFetching || mutation.isLoading;
    toggleLoading(isLoading);
  }, [mutation.isLoading, query.isFetching, query.isLoading, toggleLoading]);

  return useMemo(
    () => (
      <div className={clsx(className)}>
        <h2 className="font-semibold">Pagination</h2>
        <span className="text-sm flex flex-wrap gap-2">
          <p>
            To protect your database from malicious scraping, Meilisearch has a default limit of 1000 results per
            search. This setting allows you to configure the maximum number of results returned per search.
            <br />
            'maxTotalHits' takes priority over search parameters such as limit, offset, hitsPerPage, and page.
            <br />
            For example, if you set maxTotalHits to 100, you will not be able to access search results beyond 100 no
            matter the value configured for offset.
          </p>
          <a
            className="link info text-info-800"
            href="https://docs.meilisearch.com/learn/advanced/pagination.html"
            target={'_blank'}
            rel="noreferrer"
          >
            Learn more
          </a>
        </span>

        <h3>Max total hits</h3>
        <input
          defaultValue={query.data?.maxTotalHits || 0}
          className="input outline primary"
          type="number"
          onChange={(ev) => {
            mutation.mutate({
              ...query.data,
              maxTotalHits: parseInt(ev.currentTarget.value),
            });
          }}
        />
      </div>
    ),
    [className, mutation, query.data]
  );
};
