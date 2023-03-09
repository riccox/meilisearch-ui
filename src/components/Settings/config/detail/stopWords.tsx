import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { StopWords as TStopWords } from 'meilisearch';
import { FC, useEffect, useMemo } from 'react';
import { IndexSettingConfigComponentProps } from '../..';
import { ArrayInput } from './arrayInput';
import _ from 'lodash';
import { IconAlertTriangleFilled, IconInfoCircleFilled } from '@tabler/icons-react';

export const StopWords: FC<IndexSettingConfigComponentProps> = ({ client, className, host, toggleLoading }) => {
  const query = useQuery({
    queryKey: ['getStopWords', host, client.uid],
    refetchInterval: 4500,
    async queryFn(ctx) {
      return await client.getStopWords();
    },
  });

  const mutation = useMutation({
    mutationKey: ['updateStopWords', host, client.uid],
    async mutationFn(variables: TStopWords) {
      console.debug('🚀 ~ file: stopWords.tsx:19 ~ mutationFn ~ variables:', variables);
      if (_.isEmpty(variables)) {
        // empty to reset
        return await client.resetStopWords();
      }
      return await client.updateStopWords(variables);
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
          <p>Words added to the stopWords list are ignored in future search queries.</p>
        </span>
        <span className="prompt justify-start warn sm">
          <span className="icon">
            <IconAlertTriangleFilled />
          </span>
          <p className="content">
            Updating stop words will re-index all documents in the index, which can take some time. We recommend
            updating your index settings first and then adding documents as this reduces RAM consumption.
          </p>
        </span>
        <span className="prompt info sm">
          <span className="icon">
            <IconInfoCircleFilled />
          </span>
          <p className="content">
            Stop words are strongly related to the language used in your dataset. For example, most datasets containing
            English documents will have countless occurrences of 'the' and 'of'. Italian datasets, instead, will benefit
            from ignoring words like 'a', 'la', or 'il'.
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
