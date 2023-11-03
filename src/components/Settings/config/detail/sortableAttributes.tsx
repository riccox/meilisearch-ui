import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { SortableAttributes as TSortableAttributes } from 'meilisearch';
import { FC, useEffect, useMemo } from 'react';
import { IndexSettingConfigComponentProps } from '../..';
import { ArrayInput } from './arrayInput';
import { IconAlertTriangleFilled } from '@tabler/icons-react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

export const SortableAttributes: FC<IndexSettingConfigComponentProps> = ({
  client,
  className,
  host,
  toggleLoading,
}) => {
  const { t } = useTranslation('instance');
  const query = useQuery({
    queryKey: ['getSortableAttributes', host, client.uid],

    async queryFn(ctx) {
      return await client.getSortableAttributes();
    },
  });

  const mutation = useMutation({
    mutationKey: ['updateSortableAttributes', host, client.uid],
    async mutationFn(variables: TSortableAttributes) {
      console.debug('🚀 ~ file: sortableAttributes.tsx:19 ~ mutationFn ~ variables:', variables);
      if (_.isEmpty(variables)) {
        // empty to reset
        return await client.resetSortableAttributes();
      }
      return await client.updateSortableAttributes(variables);
    },
  });

  useEffect(() => {
    const isLoading = query.isLoading || query.isFetching || mutation.isPending;
    toggleLoading(isLoading);
  }, [mutation.isPending, query.isFetching, query.isLoading, toggleLoading]);

  return useMemo(
    () => (
      <div className={clsx(className)}>
        <h2 className="font-semibold">Sortable Attributes</h2>
        <span className="text-sm flex gap-2">
          <p>{t('setting.index.config.sortableAttributes.description')}</p>
          <a
            className="link info text-info-800"
            href="https://docs.meilisearch.com/learn/advanced/sorting.html"
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
          <p className="content">{t('setting.index.config.re_index_tip', { attribute: 'sortable attributes' })}</p>
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
    [className, mutation, t, query.data]
  );
};
