import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Faceting as TFaceting } from 'meilisearch';
import { FC, useEffect, useMemo } from 'react';
import { IndexSettingConfigComponentProps } from '../..';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

export const Faceting: FC<IndexSettingConfigComponentProps> = ({ client, className, host, toggleLoading }) => {
  const { t } = useTranslation('instance');

  const query = useQuery({
    queryKey: ['getFaceting', host, client.uid],
    async queryFn(ctx) {
      return (await client.getFaceting()) as TFaceting;
    },
  });

  const mutation = useMutation({
    mutationKey: ['updateFaceting', host, client.uid],
    async mutationFn(variables: TFaceting) {
      console.debug('🚀 ~ file: faceting.tsx:19 ~ mutationFn ~ variables:', variables);
      if (_.isEmpty(variables)) {
        // empty to reset
        return await client.resetFaceting();
      }
      return await client.updateFaceting(variables);
    },
  });

  useEffect(() => {
    const isLoading = query.isLoading || query.isFetching || mutation.isPending;
    toggleLoading(isLoading);
  }, [mutation.isPending, query.isFetching, query.isLoading, toggleLoading]);

  return useMemo(
    () => (
      <div className={clsx(className)}>
        <h2 className="font-semibold">Faceting</h2>
        <span className="text-sm flex flex-wrap gap-2">
          <p>{t('setting.index.config.faceting.description')}</p>
          <a
            className="link info text-info-800"
            href="https://docs.meilisearch.com/learn/advanced/filtering_and_faceted_search.html"
            target={'_blank'}
            rel="noreferrer"
          >
            {t('learn_more')}
          </a>
        </span>

        <h3>{t('setting.index.config.faceting.max_values_per_facet')}</h3>
        <input
          defaultValue={query.data?.maxValuesPerFacet || 0}
          className="input outline primary"
          type="number"
          onChange={(ev) => {
            mutation.mutate({
              ...query.data,
              maxValuesPerFacet: parseInt(ev.currentTarget.value),
            });
          }}
        />
      </div>
    ),
    [className, mutation, query.data, t]
  );
};
