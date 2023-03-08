import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { SearchableAttributes as TSearchableAttributes } from 'meilisearch';
import { FC, useEffect, useMemo } from 'react';
import { IndexSettingConfigComponentProps } from '../..';
import { ArrayInput } from './arrayInput';
import { IconAlertTriangleFilled } from '@tabler/icons-react';
import _ from 'lodash';

export const SearchableAttributes: FC<IndexSettingConfigComponentProps> = ({
  client,
  className,
  host,
  toggleLoading,
}) => {
  const query = useQuery({
    queryKey: ['getSearchableAttributes', host, client.uid],
    refetchInterval: 4500,
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
    const isLoading = query.isLoading || query.isFetching || mutation.isLoading;
    toggleLoading(isLoading);
  }, [mutation.isLoading, query.isFetching, query.isLoading, toggleLoading]);

  return useMemo(
    () => (
      <div className={clsx(className)}>
        <h2 className="font-semibold">Searchable Attributes</h2>
        <span className="text-sm flex gap-2">
          <p>
            The values associated with attributes in the searchableAttributes list are searched for matching query
            words. The order of the list also determines the attribute ranking order. <br /> By default, the
            searchableAttributes array is equal to all fields in your dataset. This behavior is represented by the value
            ["*"].
          </p>
          <a
            className="link info text-info-800"
            href="https://docs.meilisearch.com/learn/configuration/displayed_searchable_attributes.html#searchable-fields"
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
            Updating searchable attributes will re-index all documents in the index, which can take some time. We
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
