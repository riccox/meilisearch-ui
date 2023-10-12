import { FC, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Text } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { hiddenRequestLoader, showRequestLoader } from '@/src/utils/loader';
import { showTaskSubmitNotification } from '@/src/utils/text';
import { modals } from '@mantine/modals';
import { IndexSettingComponentProps } from '.';
import { useCurrentInstance } from '@/src/hooks/useCurrentInstance';
import { useTranslation } from 'react-i18next';

export const DangerZone: FC<
  IndexSettingComponentProps & {
    refreshIndexes: () => void;
  }
> = ({ refreshIndexes, host, client }) => {
  const { t } = useTranslation('instance');
  const navigate = useNavigate();

  const currentInstance = useCurrentInstance();
  const delIndexMutation = useMutation(
    ['delIndex', host, client.uid],
    async () => {
      showRequestLoader();
      return await client.delete();
    },
    {
      onSuccess: (t) => {
        showTaskSubmitNotification(t);
        refreshIndexes();
        navigate(`/ins/${currentInstance.id}/index`);
      },
      onSettled: () => {
        hiddenRequestLoader();
      },
    }
  );

  const delIndexAllDocumentsMutation = useMutation(
    ['delIndexAllDocuments', host, client.uid],
    async () => {
      showRequestLoader();
      return await client.deleteAllDocuments();
    },
    {
      onSuccess: (t) => {
        showTaskSubmitNotification(t);
        refreshIndexes();
      },
      onSettled: () => {
        hiddenRequestLoader();
      },
    }
  );

  const onClickDeleteIndex = useCallback(async () => {
    modals.openConfirmModal({
      title: t('index_delete.dialog.title'),
      children: (
        <Text
          size="sm"
          dangerouslySetInnerHTML={{ __html: t('index_delete.dialog.content', { uid: client.uid }) }}
        ></Text>
      ),
      labels: { confirm: t('confirm'), cancel: t('cancel') },
      confirmProps: {
        color: 'red',
      },
      onConfirm: () => delIndexMutation.mutate(),
    });
  }, [delIndexMutation, client.uid, t]);

  const onClickDeleteAllDocuments = useCallback(async () => {
    modals.openConfirmModal({
      title: t('all_documents_delete.dialog.title'),
      children: (
        <Text
          size="sm"
          dangerouslySetInnerHTML={{ __html: t('all_documents_delete.dialog.content', { uid: client.uid }) }}
        ></Text>
      ),
      labels: { confirm: t('confirm'), cancel: t('cancel') },
      confirmProps: {
        color: 'red',
      },
      onConfirm: () => delIndexAllDocumentsMutation.mutate(),
    });
  }, [delIndexAllDocumentsMutation, t, client.uid]);

  return useMemo(
    () => (
      <div className={`bg-danger-300 has-border py-2 px-3 rounded-lg`}>
        <p className={`text-danger-900 text-xl font-bold font-sans py-1`}>{t('setting.index.danger_zone')}</p>
        <div className={`flex flex-col items-start gap-4`}>
          <div className={`flex items-center gap-x-2`}>
            <button className={'danger btn solid sm'} onClick={onClickDeleteAllDocuments}>
              {t('all_documents_delete.label')}
            </button>
            <button className={'danger btn solid sm'} onClick={onClickDeleteIndex}>
              {t('index_delete.label')}
            </button>
          </div>
        </div>
      </div>
    ),
    [onClickDeleteAllDocuments, t, onClickDeleteIndex]
  );
};
