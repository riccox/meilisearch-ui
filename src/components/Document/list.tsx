import { useMeiliClient } from '@/hooks/useMeiliClient';
import { showTaskErrorNotification, showTaskSubmitNotification } from '@/utils/text';
import { toast } from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import ReactJson from 'react-json-view';
import MonacoEditor from '@monaco-editor/react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Button } from '@arco-design/web-react';
import { Modal } from '@douyinfe/semi-ui';

type Doc = { indexId: string; content: object; primaryKey: string };

interface Props {
  docs?: Doc[];
  showIndex?: boolean;
  refetchDocs: () => void;
}

export const DocumentList = ({ docs = [], showIndex = false, refetchDocs }: Props) => {
  const { t } = useTranslation('document');
  const client = useMeiliClient();
  const [editingDocument, setEditingDocument] = useState<Doc>();

  const editDocumentMutation = useMutation({
    mutationFn: async ({ indexId, docs }: { indexId: string; docs: object[] }) => {
      return await client.index(indexId).updateDocuments(docs);
    },

    onSuccess: (t) => {
      showTaskSubmitNotification(t);
      refetchDocs();
    },
    onError: (error) => {
      console.error(error);
      showTaskErrorNotification(error);
    },
  });

  const removeDocumentsMutation = useMutation({
    mutationFn: async ({ indexId, docId }: { indexId: string; docId: string[] | number[] }) => {
      return await client.index(indexId).deleteDocuments(docId);
    },

    onSuccess: (t) => {
      showTaskSubmitNotification(t);
      refetchDocs();
    },
    onError: (error: Error) => {
      console.error(error);
      showTaskErrorNotification(error);
    },
  });

  const onClickDocumentDel = useCallback(
    (doc: Doc) => {
      const pk = doc.primaryKey;
      console.debug('onClickDocumentDel', 'pk', pk);
      if (pk) {
        Modal.confirm({
          title: t('delete_document'),
          centered: true,
          content: (
            <p
              dangerouslySetInnerHTML={{
                __html: t('delete.tip', {
                  indexId: doc.indexId,
                  // @ts-ignore
                  primaryKey: doc.content[pk],
                }),
              }}
            ></p>
          ),
          okText: t('confirm'),
          cancelText: t('cancel'),
          onOk: () => {
            // @ts-ignore
            removeDocumentsMutation.mutate({ indexId: doc.indexId, docId: [doc.content[pk]] });
          },
        });
      } else {
        toast.error(t('delete.require_primaryKey', { indexId: doc.indexId }));
      }
    },
    [removeDocumentsMutation, t]
  );

  const onEditDocumentJsonEditorUpdate = useCallback(
    (value: string = '[]') => setEditingDocument((prev) => ({ ...prev!, content: JSON.parse(value) })),
    []
  );

  const onClickDocumentUpdate = useCallback(
    (doc: Doc) => {
      const pk = doc.primaryKey;
      console.debug('onClickDocumentUpdate', 'pk', pk);
      if (pk) {
        Modal.confirm({
          title: t('edit_document'),
          centered: true,
          size: 'large',
          content: (
            <div className={`border rounded-xl p-2`}>
              <MonacoEditor
                language="json"
                className="h-80"
                defaultValue={JSON.stringify(doc?.content ?? {}, null, 2)}
                options={{
                  automaticLayout: true,
                  lineDecorationsWidth: 1,
                }}
                onChange={onEditDocumentJsonEditorUpdate}
              ></MonacoEditor>
            </div>
          ),
          okText: t('submit'),
          cancelText: t('cancel'),
          onOk: () => {
            if (editingDocument) {
              editDocumentMutation.mutate({ indexId: editingDocument.indexId, docs: [editingDocument.content] });
            }
          },
        });
      }
    },
    [editDocumentMutation, editingDocument, onEditDocumentJsonEditorUpdate, t]
  );

  const list = useMemo(() => {
    return docs.map((d, i) => {
      return (
        <div
          className={`text-xs rounded-xl p-4 bg-primary-100 odd:bg-opacity-20 even:bg-opacity-10 group relative`}
          key={i}
        >
          <div
            className={clsx(`absolute right-3 top-3 opacity-95 badge outline sm bw cornered`, !showIndex && 'hidden')}
          >
            {d.indexId}
          </div>
          <ReactJson
            name={false}
            displayDataTypes={false}
            displayObjectSize={false}
            src={d.content}
            collapsed={3}
            collapseStringsAfterLength={50}
          />
          <div
            className={`absolute right-0 bottom-0 opacity-95 invisible group-hover:visible p-2 flex items-center gap-2`}
          >
            <Button type="secondary" size="mini" status="warning" onClick={() => onClickDocumentUpdate(d)}>
              {t('common:update')}
            </Button>
            <Button type="secondary" size="mini" status="danger" onClick={() => onClickDocumentDel(d)}>
              {t('common:delete')}
            </Button>
          </div>
        </div>
      );
    });
  }, [docs, showIndex, onClickDocumentUpdate, onClickDocumentDel, t]);

  return useMemo(() => <>{list}</>, [list]);
};
