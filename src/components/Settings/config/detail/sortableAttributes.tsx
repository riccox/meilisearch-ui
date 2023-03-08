import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { SortableAttributes as TSortableAttributes } from 'meilisearch';
import { FC, useEffect, useMemo } from 'react';
import { IndexSettingConfigComponentProps } from '../..';
import { ArrayInput } from './arrayInput';
import { IconAlertTriangleFilled } from '@tabler/icons-react';
import _ from 'lodash';

export const SortableAttributes: FC<IndexSettingConfigComponentProps> = ({
  client,
  className,
  host,
  toggleLoading,
}) => {
  const query = useQuery({
    queryKey: ['getSortableAttributes', host, client.uid],
    refetchInterval: 4500,
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
    const isLoading = query.isLoading || query.isFetching || mutation.isLoading;
    toggleLoading(isLoading);
  }, [mutation.isLoading, query.isFetching, query.isLoading, toggleLoading]);

  return useMemo(
    () => (
      <div className={clsx(className)}>
        <h2 className="font-semibold">Sortable Attributes</h2>
        <span className="text-sm flex gap-2">
          <p>Attributes that can be used when sorting search results using the sort search parameter.</p>
          <a
            className="link info text-info-800"
            href="https://docs.meilisearch.com/learn/advanced/sorting.html"
            target={'_blank'}
            rel="noreferrer"
          >
            Learn more
          </a>
        </span>
        <span className="prompt warn sm">
          <span className="icon">
            <IconAlertTriangleFilled />
          </span>
          <p className="content">
            Updating sortable attributes will re-index all documents in the index, which can take some time. We
            recommend updating your index settings first and then adding documents as this reduces RAM consumption.
          </p>
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
    [className, mutation, query.data]
  );
};
