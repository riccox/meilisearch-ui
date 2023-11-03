import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { SearchableAttributes as TSearchableAttributes } from 'meilisearch';
import { FC, useEffect, useMemo } from 'react';
import { IndexSettingConfigComponentProps } from '../..';
import { ArrayInput } from './arrayInput';
import { IconAlertTriangleFilled } from '@tabler/icons-react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

export const SearchableAttributes: FC<IndexSettingConfigComponentProps> = ({
  client,
  className,
  host,
  toggleLoading,
}) => {
  const { t } = useTranslation('instance');

  const query = useQuery({
    queryKey: ['getSearchableAttributes', host, client.uid],

    async queryFn(ctx) {
      return await client.getSearchableAttributes();
    },
  });

  const mutation = useMutation({
    mutationKey: ['updateSearchableAttributes', host, client.uid],
    async mutationFn(variables: TSearchableAttributes) {
      console.debug('🚀 ~ file: searchableAttributes.tsx:19 ~ mutationFn ~ variables:', variables);
      if (_.isEmpty(variables)) {
        // empty to reset
        return await client.resetSearchableAttributes();
      }
      return await client.updateSearchableAttributes(variables);
    },
  });

  useEffect(() => {
    const isLoading = query.isLoading || query.isFetching || mutation.isPending;
    toggleLoading(isLoading);
  }, [mutation.isPending, query.isFetching, query.isLoading, toggleLoading]);

  return useMemo(
    () => (
      <div className={clsx(className)}>
        <h2 className="font-semibold">Searchable Attributes</h2>
        <span className="text-sm flex gap-2">
          <p>{t('setting.index.config.searchableAttributes.description')}</p>
          <a
            className="link info text-info-800"
            href="https://docs.meilisearch.com/learn/configuration/displayed_searchable_attributes.html#searchable-fields"
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
          <p className="content">{t('setting.index.config.re_index_tip', { attribute: 'searchable attributes' })}</p>
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
    [t, className, mutation, query.data]
  );
};
