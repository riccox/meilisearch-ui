import { FC, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Text } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { hiddenRequestLoader, showRequestLoader } from '@/src/utils/loader';
import { showTaskSubmitNotification } from '@/src/utils/text';
import { openConfirmModal } from '@mantine/modals';
import { IndexSettingComponentProps } from '.';

export const DangerZone: FC<
  IndexSettingComponentProps & {
    refreshIndexes: () => void;
  }
> = ({ refreshIndexes, host, client }) => {
  const navigate = useNavigate();

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
        navigate('/index');
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
    openConfirmModal({
      title: 'Please confirm your action',
      children: (
        <Text size="sm">
          You are <strong>deleting index {client.uid}</strong>. <br />
          This action is so important that you are required to confirm it.
          <br />
          Please click one of these buttons to proceed.
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: {
        color: 'red',
      },
      onConfirm: () => delIndexMutation.mutate(),
    });
  }, [delIndexMutation, client.uid]);

  const onClickDeleteAllDocuments = useCallback(async () => {
    openConfirmModal({
      title: 'Please confirm your action',
      children: (
        <Text size="sm">
          You are <strong>deleting all documents</strong> of index <strong>{client.uid}</strong>. <br />
          This action is so important that you are required to confirm it.
          <br />
          Please click one of these buttons to proceed.
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: {
        color: 'red',
      },
      onConfirm: () => delIndexAllDocumentsMutation.mutate(),
    });
  }, [delIndexAllDocumentsMutation, client.uid]);

  return useMemo(
    () => (
      <div className={`bg-danger-300 has-border py-2 px-3 rounded-lg`}>
        <p className={`text-danger-900 text-xl font-bold font-sans py-1`}>Danger Zone</p>
        <div className={`flex flex-col items-start gap-4`}>
          <div className={`flex items-center gap-x-2`}>
            <Button color={'red'} onClick={onClickDeleteAllDocuments}>
              Delete All Documents
            </Button>
            <Button color={'red'} onClick={onClickDeleteIndex}>
              Delete This Index
            </Button>
          </div>
        </div>
      </div>
    ),
    [onClickDeleteAllDocuments, onClickDeleteIndex]
  );
};
