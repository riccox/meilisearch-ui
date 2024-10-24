import { FC, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { hiddenRequestLoader, showRequestLoader } from '@/utils/loader';
import { showTaskSubmitNotification } from '@/utils/text';
import { useCurrentInstance } from '@/hooks/useCurrentInstance';
import { useTranslation } from 'react-i18next';
import { useMeiliClient } from '@/hooks/useMeiliClient';
import { useCurrentIndex } from '@/hooks/useCurrentIndex';
import { Modal } from '@douyinfe/semi-ui';
import { Button } from '@nextui-org/react';

export const DangerZone: FC<{
  afterMutation: () => void;
}> = ({ afterMutation }) => {
  const { t } = useTranslation('index');
  const navigate = useNavigate();
  const currentInstance = useCurrentInstance();
  const client = useMeiliClient();
  const currentIndex = useCurrentIndex(client);

  const delIndexMutation = useMutation({
    mutationFn: async () => {
      showRequestLoader();
      return await currentIndex.index.delete();
    },
    onSuccess: (t) => {
      showTaskSubmitNotification(t);
      afterMutation();
      navigate({ to: `/ins/${currentInstance.id}` });
    },
    onSettled: () => {
      hiddenRequestLoader();
    },
  });

  const delIndexAllDocumentsMutation = useMutation({
    mutationFn: async () => {
      showRequestLoader();
      return await currentIndex.index.deleteAllDocuments();
    },
    onSuccess: (t) => {
      showTaskSubmitNotification(t);
      afterMutation();
    },
    onSettled: () => {
      hiddenRequestLoader();
    },
  });

  return useMemo(
    () => (
      <div className={`bg-rose-200 p-3 rounded-lg space-y-2`}>
        <p className={`text-rose-900 text-lg font-bold`}>{t('setting.index.danger_zone')}</p>
        <div className={`flex flex-col items-start gap-4`}>
          <div className={`flex items-center gap-x-2`}>
            <Button
              variant="solid"
              color="danger"
              size="sm"
              onClick={() => {
                Modal.confirm({
                  title: t('index_delete.dialog.title'),
                  centered: true,
                  content: (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: t('index_delete.dialog.content', { uid: currentIndex.index.uid }),
                      }}
                    ></span>
                  ),
                  onOk: async () => {
                    return delIndexMutation.mutate();
                  },
                  okText: t('confirm'),
                  cancelText: t('cancel'),
                });
              }}
            >
              {t('index_delete.label')}
            </Button>
            <Button
              variant="solid"
              color="danger"
              size="sm"
              onClick={() => {
                return Modal.confirm({
                  title: t('all_documents_delete.dialog.title'),
                  centered: true,
                  content: (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: t('all_documents_delete.dialog.content', { uid: currentIndex.index.uid }),
                      }}
                    ></span>
                  ),
                  onOk: async () => {
                    return delIndexAllDocumentsMutation.mutate();
                  },
                  okText: t('confirm'),
                  cancelText: t('cancel'),
                });
              }}
            >
              {t('all_documents_delete.label')}
            </Button>
          </div>
        </div>
      </div>
    ),
    [t, currentIndex.index.uid, delIndexMutation, delIndexAllDocumentsMutation]
  );
};
