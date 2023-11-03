import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { PaginationSettings as TPagination } from 'meilisearch';
import { FC, useEffect, useMemo } from 'react';
import { IndexSettingConfigComponentProps } from '../..';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

export const Pagination: FC<IndexSettingConfigComponentProps> = ({ client, className, host, toggleLoading }) => {
  const { t } = useTranslation('instance');

  const query = useQuery({
    queryKey: ['getPagination', host, client.uid],
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
    const isLoading = query.isLoading || query.isFetching || mutation.isPending;
    toggleLoading(isLoading);
  }, [mutation.isPending, query.isFetching, query.isLoading, toggleLoading]);

  return useMemo(
    () => (
      <div className={clsx(className)}>
        <h2 className="font-semibold">Pagination</h2>
        <span className="text-sm flex flex-wrap gap-2">
          <p>{t('setting.index.config.pagination.description')}</p>
          <a
            className="link info text-info-800"
            href="https://docs.meilisearch.com/learn/advanced/pagination.html"
            target={'_blank'}
            rel="noreferrer"
          >
            {t('learn_more')}
          </a>
        </span>

        <h3>{t('setting.index.config.pagination.max_total_hits')}</h3>
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
    [className, mutation, t, query.data]
  );
};
