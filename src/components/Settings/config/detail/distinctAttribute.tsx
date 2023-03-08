import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { DistinctAttribute as TDistinctAttribute } from 'meilisearch';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { IndexSettingConfigComponentProps } from '../..';
import { IconAlertTriangleFilled } from '@tabler/icons-react';
import { Controller, useForm } from 'react-hook-form';
import _ from 'lodash';

export const DistinctAttribute: FC<IndexSettingConfigComponentProps> = ({ client, className, host, toggleLoading }) => {
  const query = useQuery({
    queryKey: ['getDistinctAttribute', host, client.uid],
    refetchInterval: 4500,
    async queryFn(ctx) {
      return await client.getDistinctAttribute();
    },
  });

  const mutation = useMutation({
    mutationKey: ['updateDistinctAttribute', host, client.uid],
    async mutationFn(variables: TDistinctAttribute) {
      console.debug('🚀 ~ file: distinctAttributes.tsx:19 ~ mutationFn ~ variables:', variables);
      if (_.isEmpty(variables)) {
        // empty to reset
        return await client.resetDistinctAttribute();
      }
      return await client.updateDistinctAttribute(variables);
    },
  });

  useEffect(() => {
    const isLoading = query.isLoading || query.isFetching || mutation.isLoading;
    toggleLoading(isLoading);
  }, [mutation.isLoading, query.isFetching, query.isLoading, toggleLoading]);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const form = useForm({ defaultValues: { input: '' } });

  const onCompleteInput = useCallback(() => {
    // close input
    setIsEditing(false);
    form.reset();
  }, [form]);

  const startEdit = useCallback(() => {
    form.setValue('input', query.data || '');
    setIsEditing(true);
  }, [form, query.data]);

  const onSubmit = form.handleSubmit(async ({ input }) => {
    mutation.mutate(input);
    onCompleteInput();
  });

  return useMemo(
    () => (
      <div className={clsx(className)}>
        <h2 className="font-semibold">Distinct Attribute</h2>
        <span className="text-sm flex gap-2">
          <p>The distinct attribute is a field whose value will always be unique in the returned documents.</p>
          <a
            className="link info text-info-800"
            href="https://docs.meilisearch.com/learn/configuration/distinct.html"
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
            Updating distinct attributes will re-index all documents in the index, which can take some time. We
            recommend updating your index settings first and then adding documents as this reduces RAM consumption.
          </p>
        </span>

        <form className={clsx('flex flex-col gap-2')}>
          <Controller
            name="input"
            control={form.control}
            render={({ field: { value, onChange } }) => (
              <span
                className="tooltip secondary bottom"
                data-tooltip="leave empty to reset the distinct attribute of an index to its default value."
              >
                <input
                  className="input outline primary"
                  disabled={!isEditing}
                  {...{ value: (isEditing ? value : query.data) || '', onChange }}
                />
              </span>
            )}
          />
          <div className="flex gap-2 items-center">
            <button
              className={clsx(isEditing && 'hidden', 'flex-1 btn outline sm info')}
              onClick={(e) => {
                e.preventDefault();
                startEdit();
              }}
            >
              Edit
            </button>
            <button
              className={clsx(!isEditing && 'hidden', 'flex-1 btn outline sm success')}
              onClick={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              Save
            </button>
            <button
              className={clsx(!isEditing && 'hidden', 'flex-1 btn outline sm bw')}
              onClick={(e) => {
                e.preventDefault();
                onCompleteInput();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    ),
    [className, form.control, isEditing, onCompleteInput, onSubmit, query.data, startEdit]
  );
};
