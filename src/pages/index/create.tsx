import { Button, TextInput, Tooltip } from '@mantine/core';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from '@mantine/form';
import _ from 'lodash';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { showTaskSubmitNotification } from '@/src/utils/text';
import { useOutletContext } from 'react-router-dom';
import { toast } from '@/src/utils/toast';

export const CreateIndex = () => {
  const outletContext = useOutletContext<{ refreshIndexes: () => void }>();
  const client = useMeiliClient();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const form = useForm({
    initialValues: {
      uid: '',
      primaryKey: undefined,
    },
    validate: {
      uid: (value: string) =>
        /[\da-zA-Z-_]+/.test(value)
          ? null
          : 'The uid is the unique identifier of an index. It is set when creating the index and must be an integer or string containing only alphanumeric characters a-z A-Z 0-9, hyphens - and underscores _.',
    },
  });

  const onCreateSubmit = useCallback(
    async (values: typeof form.values) => {
      // button loading
      setIsSubmitLoading(true);
      let task;
      try {
        task = await client.createIndex(values.uid, { primaryKey: values.primaryKey });
        console.info(task);
      } catch (e) {
        console.warn(e);
        toast(`Fail, ${e as string}`, {
          type: 'warning',
        });
      }
      // button stop loading
      setIsSubmitLoading(false);
      if (!_.isEmpty(task)) {
        outletContext.refreshIndexes();
        showTaskSubmitNotification(task);
      }
    },
    [client, form, outletContext]
  );

  return useMemo(
    () => (
      <div className={`fill flex justify-center`}>
        <div className={` w-1/2 flex flex-col gap-4 justify-center items-center`}>
          <p className={`text-center font-semibold text-3xl`}>Create New Index</p>
          <form className={`flex flex-col gap-y-6 w-full `} onSubmit={form.onSubmit(onCreateSubmit)}>
            <Tooltip
              position={'bottom-start'}
              label={`[DOCS] Once defined, the uid cannot be changed,
           and you cannot create another index with the same uid.`}
            >
              <TextInput
                autoFocus
                radius="md"
                size={'lg'}
                label="UID"
                placeholder="uid of the requested index"
                required
                {...form.getInputProps('uid')}
              />
            </Tooltip>

            <Tooltip
              position={'bottom-start'}
              label={`[DOCS] It uniquely identifies each document in an index, 
            ensuring that it is impossible to have two exactly identical documents present in the same index.`}
            >
              <TextInput
                label="Primary Key"
                placeholder="Primary key of the requested index"
                radius="md"
                size={'lg'}
                {...form.getInputProps('apiKey')}
              />
            </Tooltip>
            <Button type="submit" radius={'xl'} size={'lg'} variant="light" loading={isSubmitLoading}>
              Create this index
            </Button>
          </form>
        </div>
      </div>
    ),
    [form, isSubmitLoading, onCreateSubmit]
  );
};
