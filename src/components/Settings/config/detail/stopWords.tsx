import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { StopWords as TStopWords } from 'meilisearch';
import { FC, useEffect, useMemo } from 'react';
import { IndexSettingConfigComponentProps } from '../..';
import { ArrayInput } from './arrayInput';
import _ from 'lodash';
import { IconAlertTriangleFilled, IconInfoCircleFilled } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export const StopWords: FC<IndexSettingConfigComponentProps> = ({ client, className, host, toggleLoading }) => {
  const { t } = useTranslation('instance');

  const query = useQuery({
    queryKey: ['getStopWords', host, client.uid],

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
    const isLoading = query.isLoading || query.isFetching || mutation.isPending;
    toggleLoading(isLoading);
  }, [mutation.isPending, query.isFetching, query.isLoading, toggleLoading]);

  return useMemo(
    () => (
      <div className={clsx(className)}>
        <h2 className="font-semibold">Stop Words</h2>
        <span className="text-sm flex gap-2">
          <p>{t('setting.index.config.stopWords.description')}</p>
        </span>
        <span className="prompt justify-start warn sm">
          <span className="icon">
            <IconAlertTriangleFilled />
          </span>
          <p className="content">{t('setting.index.config.re_index_tip', { attribute: 'stop words' })}</p>
        </span>
        <span className="prompt info sm">
          <span className="icon">
            <IconInfoCircleFilled />
          </span>
          <p className="content">{t('setting.index.config.stopWords.tip')}</p>
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
