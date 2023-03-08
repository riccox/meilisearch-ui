import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { DisplayedAttributes as TDisplayedAttributes } from 'meilisearch';
import { FC, useEffect, useMemo } from 'react';
import { IndexSettingConfigComponentProps } from '../..';
import { ArrayInput } from './arrayInput';
import _ from 'lodash';

export const DisplayedAttributes: FC<IndexSettingConfigComponentProps> = ({
  client,
  className,
  host,
  toggleLoading,
}) => {
  const query = useQuery({
    queryKey: ['getDisplayedAttributes', host, client.uid],
    refetchInterval: 4500,
    async queryFn(ctx) {
      return await client.getDisplayedAttributes();
    },
  });

  const mutation = useMutation({
    mutationKey: ['updateDisplayedAttributes', host, client.uid],
    async mutationFn(variables: TDisplayedAttributes) {
      console.debug('🚀 ~ file: displayedAttributes.tsx:19 ~ mutationFn ~ variables:', variables);
      if (_.isEmpty(variables)) {
        // empty to reset
        return await client.resetDisplayedAttributes();
      }
      return await client.updateDisplayedAttributes(variables);
    },
  });

  useEffect(() => {
    const isLoading = query.isLoading || query.isFetching || mutation.isLoading;
    toggleLoading(isLoading);
  }, [mutation.isLoading, query.isFetching, query.isLoading, toggleLoading]);

  return useMemo(
    () => (
      <div className={clsx(className)}>
        <h2 className="font-semibold">Displayed Attributes</h2>
        <span className="text-sm flex gap-2">
          <p>
            The attributes added to the displayedAttributes list appear in search results. displayedAttributes only
            affects the search endpoints. It has no impact on the GET documents endpoint.
            <br />
            By default, the displayedAttributes array is equal to all fields in your dataset. This behavior is
            represented by the value ["*"].
          </p>
          <a
            className="link info text-info-800"
            href="https://docs.meilisearch.com/learn/configuration/displayed_searchable_attributes.html#displayed-fields"
            target={'_blank'}
            rel="noreferrer"
          >
            Learn more
          </a>
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
