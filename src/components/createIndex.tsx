import { useCallback, useState } from 'react';
import { useForm } from '@mantine/form';
import _ from 'lodash';
import { useMeiliClient } from '@/hooks/useMeiliClient';
import { showTaskSubmitNotification } from '@/utils/text';
import { toast } from '@/utils/toast';
import { useTranslation } from 'react-i18next';
import { Input, Modal, Tooltip } from '@douyinfe/semi-ui';
import { Button } from '@nextui-org/react';

type Props = {
  afterMutation: () => void;
};

export const CreateIndexButton = ({ afterMutation }: Props) => {
  const { t } = useTranslation('instance');
  const client = useMeiliClient();
  const form = useForm({
    initialValues: {
      uid: '',
      primaryKey: undefined,
    },
    validate: {
      uid: (value: string) => (/[\da-zA-Z-_]+/.test(value) ? null : t('create_index.form.uid.validation_error')),
    },
  });

  const [visible, setVisible] = useState(false);

  const showDialog = () => {
    setVisible(true);
  };
  const closeDialog = () => {
    setVisible(false);
    form.reset();
  };

  const onCreateSubmit = useCallback(
    async (values: typeof form.values) => {
      let task;
      try {
        task = await client.createIndex(values.uid, { primaryKey: values.primaryKey });
        console.info(task);
        if (!_.isEmpty(task)) {
          showTaskSubmitNotification(task);
          afterMutation();
        }
      } catch (e) {
        console.warn(e);
        toast.error(t('toast.fail', { msg: e as string }));
      }
    },
    [afterMutation, client, form, t]
  );

  return (
    <>
      <Button
        size="sm"
        color="primary"
        onClick={() => {
          showDialog();
        }}
      >
        {t('common:create')}
      </Button>
      <Modal
        centered
        footerFill
        visible={visible}
        title={t('create_index.label')}
        okText={t('create_index.label')}
        cancelText={t('common:cancel')}
        afterClose={() => {
          closeDialog();
        }}
        onOk={async () => {
          await onCreateSubmit(form.values);
          closeDialog();
        }}
        onCancel={closeDialog}
      >
        <form className={`pt-3 space-y-3`}>
          <Tooltip position={'bottomLeft'} content={t('create_index.form.uid.tip')}>
            <Input
              autoFocus
              addonBefore="UID"
              placeholder={t('create_index.form.uid.placeholder')}
              required
              {...form.getInputProps('uid')}
            />
          </Tooltip>
          <Tooltip position={'bottomLeft'} content={t('create_index.form.primaryKey.tip')}>
            <Input
              addonBefore={t('create_index.form.primaryKey.label')}
              placeholder={t('create_index.form.primaryKey.placeholder')}
              {...form.getInputProps('primaryKey')}
            />
          </Tooltip>
        </form>
      </Modal>
    </>
  );
};
