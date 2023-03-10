import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { TypoTolerance as TTypoTolerance } from 'meilisearch';
import { FC, useEffect, useMemo } from 'react';
import { IndexSettingConfigComponentProps } from '../..';
import { ArrayInput } from './arrayInput';
import _ from 'lodash';

export const TypoTolerance: FC<IndexSettingConfigComponentProps> = ({ client, className, host, toggleLoading }) => {
  const query = useQuery({
    queryKey: ['getTypoTolerance', host, client.uid],
    refetchInterval: 4500,
    async queryFn(ctx) {
      return (await client.getTypoTolerance()) as TTypoTolerance;
    },
  });

  const mutation = useMutation({
    mutationKey: ['updateTypoTolerance', host, client.uid],
    async mutationFn(variables: TTypoTolerance) {
      console.debug('🚀 ~ file: typoTolerance.tsx:19 ~ mutationFn ~ variables:', variables);
      if (_.isEmpty(variables)) {
        // empty to reset
        return await client.resetTypoTolerance();
      }
      return await client.updateTypoTolerance(variables);
    },
  });

  useEffect(() => {
    const isLoading = query.isLoading || query.isFetching || mutation.isLoading;
    toggleLoading(isLoading);
  }, [mutation.isLoading, query.isFetching, query.isLoading, toggleLoading]);

  return useMemo(
    () => (
      <div className={clsx(className)}>
        <h2 className="font-semibold">Typo Tolerance</h2>
        <span className="text-sm flex flex-wrap gap-2">
          <p>
            Typo tolerance helps users find relevant results even when their search queries contain spelling mistakes or
            typos. This setting allows you to configure the minimum word size for typos and disable typo tolerance for
            specific words or attributes.
          </p>
          <a
            className="link info text-info-800"
            href="https://docs.meilisearch.com/learn/configuration/typo_tolerance.html"
            target={'_blank'}
            rel="noreferrer"
          >
            Learn more
          </a>
        </span>

        <h3>Enabled</h3>
        <input
          defaultChecked={query.data?.enabled || false}
          className="switch success"
          type="checkbox"
          onChange={(ev) => {
            mutation.mutate({ ...query.data, enabled: ev.currentTarget.checked });
          }}
        />

        <h3>Disable on attributes</h3>
        <ArrayInput
          className="py-2"
          defaultValue={query.data?.disableOnAttributes || []}
          onMutation={(value) => {
            mutation.mutate({ ...query.data, disableOnAttributes: value });
          }}
        />

        <h3>Disable on words</h3>
        <ArrayInput
          className="py-2"
          defaultValue={query.data?.disableOnWords || []}
          onMutation={(value) => {
            mutation.mutate({ ...query.data, disableOnWords: value });
          }}
        />

        <h3>Min word size for typos</h3>
        <div className="w-fit grid grid-cols-2 items-center gap-4">
          <h4>One typos</h4>
          <input
            defaultValue={query.data?.minWordSizeForTypos?.oneTypo || 0}
            className="input outline primary"
            type="number"
            onChange={(ev) => {
              mutation.mutate({
                ...query.data,
                minWordSizeForTypos: {
                  ...query.data?.minWordSizeForTypos,
                  oneTypo: parseInt(ev.currentTarget.value),
                },
              });
            }}
          />
          <h4>Two typos</h4>
          <input
            defaultValue={query.data?.minWordSizeForTypos?.twoTypos || 0}
            className="input outline primary"
            type="number"
            onChange={(ev) => {
              mutation.mutate({
                ...query.data,
                minWordSizeForTypos: {
                  ...query.data?.minWordSizeForTypos,
                  twoTypos: parseInt(ev.currentTarget.value),
                },
              });
            }}
          />
        </div>
      </div>
    ),
    [className, mutation, query.data]
  );
};
