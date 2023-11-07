import { Button, TextInput, Tooltip } from '@mantine/core';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from '@mantine/form';
import _ from 'lodash';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { showTaskSubmitNotification } from '@/src/utils/text';
import { useOutletContext } from 'react-router-dom';
import { toast } from '@/src/utils/toast';
import { useTranslation } from 'react-i18next';

export const CreateIndex = () => {
  const { t } = useTranslation('instance');
  const outletContext = useOutletContext<{ refreshIndexes: () => void }>();
  const client = useMeiliClient();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const form = useForm({
    initialValues: {
      uid: '',
      primaryKey: undefined,
    },
    validate: {
      uid: (value: string) => (/[\da-zA-Z-_]+/.test(value) ? null : t('create_index.form.uid.validation_error')),
    },
  });

  const onCreateSubmit = useCallback(
    async (values: typeof form.values) => {
      // button loading
      setIsSubmitLoading(true);
      let task;
      try {
        console.info('>>> ' + values.primaryKey + values.uid);
        task = await client.createIndex(values.uid, { primaryKey: values.primaryKey });
        console.info(task);
      } catch (e) {
        console.warn(e);
        toast.error(t('toast.fail', { msg: e as string }));
      }
      // button stop loading
      setIsSubmitLoading(false);
      if (!_.isEmpty(task)) {
        outletContext.refreshIndexes();
        showTaskSubmitNotification(task);
      }
    },
    [client, form, outletContext, t]
  );

  return useMemo(
    () => (
      <div className={`fill flex justify-center`}>
        <div className={` w-1/2 flex flex-col gap-4 justify-center items-center`}>
          <p className={`text-center font-semibold text-3xl`}>{t('create_index.label')}</p>
          <form className={`flex flex-col gap-y-6 w-full `} onSubmit={form.onSubmit(onCreateSubmit)}>
            <Tooltip position={'bottom-start'} label={t('create_index.form.uid.tip')}>
              <TextInput
                autoFocus
                radius="md"
                size={'lg'}
                label="UID"
                placeholder={t('create_index.form.uid.placeholder')}
                required
                {...form.getInputProps('uid')}
              />
            </Tooltip>

            <Tooltip position={'bottom-start'} label={t('create_index.form.primaryKey.tip')}>
              <TextInput
                label={t('create_index.form.primaryKey.label')}
                placeholder={t('create_index.form.primaryKey.placeholder')}
                radius="md"
                size={'lg'}
                {...form.getInputProps('primaryKey')}
              />
            </Tooltip>
            <Button type="submit" radius={'xl'} size={'lg'} variant="light" loading={isSubmitLoading}>
              {t('create_index.label')}
            </Button>
          </form>
        </div>
      </div>
    ),
    [form, isSubmitLoading, onCreateSubmit, t]
  );
};
