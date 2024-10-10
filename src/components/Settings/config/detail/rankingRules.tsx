import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { RankingRules as TRankingRules } from 'meilisearch';
import { FC, useEffect, useMemo } from 'react';
import { IndexSettingConfigComponentProps } from '../..';
import { ArrayInput } from './arrayInput';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

export const RankingRules: FC<IndexSettingConfigComponentProps> = ({ client, className, host, toggleLoading }) => {
  const { t } = useTranslation('instance');

  const query = useQuery({
    queryKey: ['getRankingRules', host, client.uid],

    async queryFn() {
      return await client.getRankingRules();
    },
  });

  const mutation = useMutation({
    mutationKey: ['updateRankingRules', host, client.uid],
    async mutationFn(variables: TRankingRules) {
      console.debug('🚀 ~ file: rankingRules.tsx:19 ~ mutationFn ~ variables:', variables);
      if (_.isEmpty(variables)) {
        // empty to reset
        return await client.resetRankingRules();
      }
      return await client.updateRankingRules(variables);
    },
  });

  useEffect(() => {
    const isLoading = query.isLoading || query.isFetching || mutation.isPending;
    toggleLoading(isLoading);
  }, [mutation.isPending, query.isFetching, query.isLoading, toggleLoading]);

  return useMemo(
    () => (
      <div className={clsx(className)}>
        <h2 className="font-semibold">Ranking Rules</h2>
        <span className="text-sm flex gap-2">
          <p>{t('setting.index.config.rankingRules.description')}</p>
          <a
            className="link info text-info-800"
            href="https://docs.meilisearch.com/learn/core_concepts/relevancy.html"
            target={'_blank'}
            rel="noreferrer"
          >
            {t('learn_more')}
          </a>
        </span>
        <ArrayInput
          className="py-2"
          defaultValue={query.data || []}
          onMutation={(value) => {
            mutation.mutate(value);
          }}
          moveable
        />
      </div>
    ),
    [t, className, mutation, query.data]
  );
};
