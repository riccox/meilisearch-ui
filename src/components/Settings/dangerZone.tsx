import { FC, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Text } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { hiddenRequestLoader, showRequestLoader } from '@/src/utils/loader';
import { showTaskSubmitNotification } from '@/src/utils/text';
import { IndexSettingComponentProps } from '.';
import { useCurrentInstance } from '@/src/hooks/useCurrentInstance';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

export const DangerZone: FC<
  IndexSettingComponentProps & {
    refreshIndexes: () => void;
  }
> = ({ refreshIndexes, host, client }) => {
  const { t } = useTranslation('instance');
  const navigate = useNavigate();

  const currentInstance = useCurrentInstance();
  const delIndexMutation = useMutation({
    mutationKey: ['delIndex', host, client.uid],
    mutationFn: async () => {
      showRequestLoader();
      return await client.delete();
    },
    onSuccess: (t) => {
      showTaskSubmitNotification(t);
      refreshIndexes();
      navigate(`/instance/${currentInstance.id}/index`);
    },
    onSettled: () => {
      hiddenRequestLoader();
    },
  });

  const delIndexAllDocumentsMutation = useMutation({
    mutationKey: ['delIndexAllDocuments', host, client.uid],
    mutationFn: async () => {
      showRequestLoader();
      return await client.deleteAllDocuments();
    },
    onSuccess: (t) => {
      showTaskSubmitNotification(t);
      refreshIndexes();
    },
    onSettled: () => {
      hiddenRequestLoader();
    },
  });

  const [isDeleteIndexConfirmModalShow, setIsDeleteIndexConfirmModalShow] = useState(false);
  const [isDeleteAllDocsConfirmModalShow, setIsDeleteAllDocsConfirmModalShow] = useState(false);

  const onClickDeleteIndex = useCallback(() => {
    setIsDeleteIndexConfirmModalShow(true);
  }, []);
  const onClickDeleteAllDocuments = useCallback(() => {
    console.log('onClickDeleteAllDocuments');

    setIsDeleteAllDocsConfirmModalShow(true);
  }, []);

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
            <div>
              <label className="modal-overlay"></label>
              {/* delete index confirm modal */}
              <div className={clsx('modal flex flex-col gap-5', isDeleteIndexConfirmModalShow && 'show')}>
                <h2 className="text-xl">{t('index_delete.dialog.title')}</h2>
                <Text
                  size="sm"
                  dangerouslySetInnerHTML={{ __html: t('index_delete.dialog.content', { uid: client.uid }) }}
                ></Text>

                <div className="flex gap-3">
                  <button
                    className="btn solid danger flex-1"
                    onClick={() => {
                      delIndexMutation.mutate();
                      setIsDeleteIndexConfirmModalShow(false);
                    }}
                  >
                    {t('confirm')}
                  </button>
                  <button
                    className="btn solid bw flex-1"
                    onClick={() => {
                      setIsDeleteIndexConfirmModalShow(false);
                    }}
                  >
                    {t('cancel')}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label className="modal-overlay"></label>
              {/* delete all docs confirm modal */}
              <div className={clsx('modal flex flex-col gap-5', isDeleteAllDocsConfirmModalShow && 'show')}>
                <h2 className="text-xl">{t('all_documents_delete.dialog.title')}</h2>
                <Text
                  size="sm"
                  dangerouslySetInnerHTML={{ __html: t('all_documents_delete.dialog.content', { uid: client.uid }) }}
                ></Text>

                <div className="flex gap-3">
                  <button
                    className="btn solid danger flex-1"
                    onClick={() => {
                      delIndexAllDocumentsMutation.mutate();
                      setIsDeleteAllDocsConfirmModalShow(false);
                    }}
                  >
                    {t('confirm')}
                  </button>
                  <button
                    className="btn solid bw flex-1"
                    onClick={() => {
                      setIsDeleteAllDocsConfirmModalShow(false);
                    }}
                  >
                    {t('cancel')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    [
      t,
      onClickDeleteAllDocuments,
      onClickDeleteIndex,
      isDeleteIndexConfirmModalShow,
      client.uid,
      isDeleteAllDocsConfirmModalShow,
      delIndexMutation,
      delIndexAllDocumentsMutation,
    ]
  );
};
