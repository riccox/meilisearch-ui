import { useCurrentInstance } from '@/hooks/useCurrentInstance';
import { useMeiliClient } from '@/hooks/useMeiliClient';
import { Button } from '@nextui-org/react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { showTaskSubmitNotification } from '@/utils/text';
import { Modal } from '@douyinfe/semi-ui';

export const DumpButton = () => {
  const { t } = useTranslation('instance');
  const currentInstance = useCurrentInstance();
  const client = useMeiliClient();

  const onClickDump = useCallback(() => {
    Modal.confirm({
      title: t('instance:dump.dialog.title'),
      centered: true,
      content: <p>{t('instance:dump.dialog.tip', { name: currentInstance.name })}</p>,
      onOk: async () => {
        showTaskSubmitNotification(await client.createDump());
      },
      okText: t('confirm'),
      cancelText: t('cancel'),
    });
  }, [client, currentInstance.name, t]);

  return (
    <Button onClick={onClickDump} color="default" variant="light" size="sm">
      <div className="i-lucide:archive-restore w-1em h-1em"></div>
      Dump
    </Button>
  );
};
