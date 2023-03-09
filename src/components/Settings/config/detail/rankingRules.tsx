import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { RankingRules as TRankingRules } from 'meilisearch';
import { FC, useEffect, useMemo } from 'react';
import { IndexSettingConfigComponentProps } from '../..';
import { ArrayInput } from './arrayInput';
import _ from 'lodash';

export const RankingRules: FC<IndexSettingConfigComponentProps> = ({ client, className, host, toggleLoading }) => {
  const query = useQuery({
    queryKey: ['getRankingRules', host, client.uid],
    refetchInterval: 4500,
    async queryFn(ctx) {
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
    const isLoading = query.isLoading || query.isFetching || mutation.isLoading;
    toggleLoading(isLoading);
  }, [mutation.isLoading, query.isFetching, query.isLoading, toggleLoading]);

  return useMemo(
    () => (
      <div className={clsx(className)}>
        <h2 className="font-semibold">Ranking Rules</h2>
        <span className="text-sm flex gap-2">
          <p>
            Ranking rules are built-in rules that rank search results according to certain criteria. They are applied in
            the same order in which they appear in the rankingRules array.
          </p>
          <a
            className="link info text-info-800"
            href="https://docs.meilisearch.com/learn/core_concepts/relevancy.html"
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
          moveable
        />
      </div>
    ),
    [className, mutation, query.data]
  );
};
