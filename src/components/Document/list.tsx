import { openConfirmModal } from '@mantine/modals';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { showTaskErrorNotification, showTaskSubmitNotification } from '@/src/utils/text';
import { toast } from '@/src/utils/toast';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import ReactJson from 'react-json-view';
import { Button, Modal } from '@mantine/core';
import MonacoEditor from '@monaco-editor/react';
import clsx from 'clsx';

type Doc = { indexId: string; content: object; primaryKey: string };

interface Props {
  docs?: Doc[];
  showIndex?: boolean;
  refetchDocs: () => void;
}

export const DocumentList = ({ docs = [], showIndex = false, refetchDocs }: Props) => {
  const client = useMeiliClient();
  const [isEditDocumentsModalOpen, setIsEditDocumentsModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Doc>();

  const editDocumentMutation = useMutation(
    ['editDocument'],
    async ({ indexId, docs }: { indexId: string; docs: object[] }) => {
      return await client.index(indexId).updateDocuments(docs);
    },
    {
      onSuccess: (t) => {
        setIsEditDocumentsModalOpen(false);
        showTaskSubmitNotification(t);
        refetchDocs();
      },
      onError: (error) => {
        console.error(error);
        showTaskErrorNotification(error);
      },
    }
  );

  const removeDocumentsMutation = useMutation(
    ['removeDocuments'],
    async ({ indexId, docId }: { indexId: string; docId: string[] | number[] }) => {
      return await client.index(indexId).deleteDocuments(docId);
    },
    {
      onSuccess: (t) => {
        showTaskSubmitNotification(t);
        refetchDocs();
      },
      onError: (error: Error) => {
        console.error(error);
        showTaskErrorNotification(error);
      },
    }
  );

  const onClickDocumentDel = useCallback(
    (doc: Doc) => {
      const pk = doc.primaryKey;
      console.debug('onClickDocumentDel', 'pk', pk);
      if (pk) {
        openConfirmModal({
          title: 'Delete a document',
          centered: true,
          children: (
            <p>
              Are you sure you want to delete this{' '}
              <strong>
                {/* @ts-ignore */}
                document ({pk}: {doc.content[pk]}) in index {doc.indexId}
              </strong>
              ?
            </p>
          ),
          labels: { confirm: 'Confirm', cancel: 'Cancel' },
          onConfirm: () => {
            // @ts-ignore
            removeDocumentsMutation.mutate({ indexId: doc.indexId, docId: [doc.content[pk]] });
          },
        });
      } else {
        toast.error(`Document deletion require the valid primaryKey in index ${doc.indexId}`);
      }
    },
    [removeDocumentsMutation]
  );

  const onClickDocumentUpdate = useCallback((doc: Doc) => {
    setIsEditDocumentsModalOpen(true);
    setEditingDocument(doc);
  }, []);

  const onEditDocumentJsonEditorUpdate = useCallback(
    (value: string = '[]') => setEditingDocument((prev) => ({ ...prev!, content: JSON.parse(value) })),
    []
  );

  const list = useMemo(() => {
    return docs.map((d, i) => {
      return (
        <div className={` rounded-xl p-4 bg-brand-1 odd:bg-opacity-20 even:bg-opacity-10 group relative`} key={i}>
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
            <button className={'btn xs font-normal outline info'} onClick={() => onClickDocumentUpdate(d)}>
              Update
            </button>
            <button className={'btn xs font-normal outline danger'} onClick={() => onClickDocumentDel(d)}>
              Delete
            </button>
          </div>
        </div>
      );
    });
  }, [docs, showIndex, onClickDocumentUpdate, onClickDocumentDel]);

  const onSubmitDocumentUpdate = useCallback(() => {
    editingDocument &&
      editDocumentMutation.mutate({ indexId: editingDocument.indexId, docs: [editingDocument.content] });
  }, [editDocumentMutation, editingDocument]);

  return useMemo(
    () => (
      <>
        {list}
        <Modal
          opened={isEditDocumentsModalOpen}
          onClose={() => {
            setIsEditDocumentsModalOpen(false);
            setEditingDocument(undefined);
          }}
          centered
          lockScroll
          radius="lg"
          shadow="xl"
          padding="xl"
          size="xl"
          withCloseButton={true}
          title={<p className={`font-bold text-lg`}>Edit Document</p>}
        >
          <div className={`flex flex-col gap-y-4 w-full`}>
            <div className={`border rounded-xl p-2`}>
              <MonacoEditor
                language="json"
                className="h-80"
                defaultValue={JSON.stringify(editingDocument?.content ?? {}, null, 2)}
                options={{
                  automaticLayout: true,
                  lineDecorationsWidth: 1,
                }}
                onChange={onEditDocumentJsonEditorUpdate}
              ></MonacoEditor>
            </div>
            <Button onClick={onSubmitDocumentUpdate} radius={'xl'} size={'lg'} variant="light">
              Submit
            </Button>
          </div>
        </Modal>
      </>
    ),
    [editingDocument, isEditDocumentsModalOpen, list, onEditDocumentJsonEditorUpdate, onSubmitDocumentUpdate]
  );
};
