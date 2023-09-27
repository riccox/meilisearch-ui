import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { FilterableAttributes as TFilterableAttributes } from 'meilisearch';
import { FC, useEffect, useMemo } from 'react';
import { IndexSettingConfigComponentProps } from '../..';
import { ArrayInput } from './arrayInput';
import { IconAlertTriangleFilled } from '@tabler/icons-react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

export const FilterableAttributes: FC<IndexSettingConfigComponentProps> = ({
  client,
  className,
  host,
  toggleLoading,
}) => {
  const { t } = useTranslation('instance');

  const query = useQuery({
    queryKey: ['getFilterableAttributes', host, client.uid],
    async queryFn(ctx) {
      return await client.getFilterableAttributes();
    },
  });

  const mutation = useMutation({
    mutationKey: ['updateFilterableAttributes', host, client.uid],
    async mutationFn(variables: TFilterableAttributes) {
      console.debug('🚀 ~ file: filterableAttributes.tsx:19 ~ mutationFn ~ variables:', variables);
      if (_.isEmpty(variables)) {
        // empty to reset
        return await client.resetFilterableAttributes();
      }
      return await client.updateFilterableAttributes(variables);
    },
  });

  useEffect(() => {
    const isLoading = query.isLoading || query.isFetching || mutation.isLoading;
    toggleLoading(isLoading);
  }, [mutation.isLoading, query.isFetching, query.isLoading, toggleLoading]);

  return useMemo(
    () => (
      <div className={clsx(className)}>
        <h2 className="font-semibold">Filterable Attributes</h2>
        <span className="text-sm flex gap-2">
          <p>{t('setting.index.config.filterableAttributes.description')}</p>
          <a
            className="link info text-info-800"
            href="https://docs.meilisearch.com/learn/advanced/filtering_and_faceted_search.html"
            target={'_blank'}
            rel="noreferrer"
          >
            {t('learn_more')}
          </a>
        </span>
        <span className="prompt warn sm">
          <span className="icon">
            <IconAlertTriangleFilled />
          </span>
          <p className="content">{t('setting.index.config.re_index_tip', { attribute: 'filterable attribute' })}</p>
        </span>
        <ArrayInput
          className="py-2"
          defaultValue={query.data || []}
          onMutation={(value) => {
            mutation.mutate(value);
          }}
        />
      </div>
    ),
    [className, mutation, query.data, t]
  );
};
