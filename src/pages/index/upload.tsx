import { DragEventHandler, useCallback, useMemo, useRef, useState } from 'react';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { useCurrentInstance } from '@/src/hooks/useCurrentInstance';
import { toast } from '@/src/utils/toast';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { EnqueuedTask } from 'meilisearch';
import _ from 'lodash';
import { showTaskErrorNotification, showTaskSubmitNotification } from '@/src/utils/text';
import MonacoEditor from '@monaco-editor/react';
import clsx from 'clsx';
import { IconCopy } from '@tabler/icons-react';
import { hiddenRequestLoader, showRequestLoader } from '@/src/utils/loader';
import { useTranslation } from 'react-i18next';

export const UploadDoc = () => {
  const { t } = useTranslation('upload');
  const outletContext = useOutletContext<{ refreshIndexes: () => void }>();

  const [dragAreaState, setDragAreaState] = useState<'leave' | 'over' | 'uploading'>('leave');
  const editorRef = useRef<any>(null);
  const currentInstance = useCurrentInstance();
  const apiKey = currentInstance?.apiKey;
  const { indexId } = useParams();

  const currentIndex = useMemo(() => indexId?.trim(), [indexId]);
  const navigate = useNavigate();
  const client = useMeiliClient();

  if (!indexId) {
    navigate(`/instance/${currentInstance.id}/index`);
  }

  const indexClient = useMemo(() => {
    return client.index(indexId ?? '');
  }, [client, indexId]);

  const host = currentInstance?.host;

  const addDocumentsForm = useForm<{
    documents: object[] | File;
  }>({
    initialValues: {
      documents: [],
    },
    validate: {
      documents: (value: object[] | File) => {
        if (value instanceof File ? value.size > 0 : value.length > 0) {
          return null;
        } else {
          const msg = 'Added documents should be JSON Array whose length > 0';
          toast.error(msg);
          return msg;
        }
      },
    },
  });

  const addDocumentsMutation = useMutation({
    mutationKey: ['addDocuments', host, indexClient?.uid],
    mutationFn: async (variables: object[] | File) => {
      const url = new URL(`/indexes/${currentIndex}/documents`, host);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: apiKey ? `Bearer ${apiKey}` : '',
        },
        body: variables instanceof File ? (variables as File) : JSON.stringify(variables),
      });
      const task = (await response.json()) as EnqueuedTask;
      console.debug('addDocumentsMutation', 'response', task);
      return task;
    },

    onSuccess: (t) => {
      showTaskSubmitNotification(t);
      addDocumentsForm.reset();
      // refresh the document counter
      outletContext.refreshIndexes();
    },
    onError: (error) => {
      console.error(error);
      showTaskErrorNotification(error);
    },
    onMutate() {
      if (dragAreaState !== 'uploading') {
        setDragAreaState('uploading');
        showRequestLoader();
      }
    },
    onSettled() {
      if (dragAreaState === 'uploading') {
        setDragAreaState('leave');
      }
      hiddenRequestLoader();
    },
  });

  // only read at first render time, so we don't need to use "useCallback"
  const pasteClipboardJSON = useCallback(async () => {
    // read clipboard and set default val if clipboard value match rules
    const [firstContent] = await navigator.clipboard.read();
    if (firstContent.types.includes('text/plain')) {
      const json = JSON.parse(await (await firstContent.getType('text/plain')).text());
      const arr = _.isArray(json) ? json : _.isObject(json) ? [json] : [];
      console.debug('onAddDocumentsByEditorClick paste clipboard', arr, json);
      if (arr.length > 0) {
        if (editorRef) {
          editorRef.current.setValue(JSON.stringify(arr, null, 2));
          toast.success(t('clipboard_json_pasted'));
        }
      }
    }
  }, [t]);

  const onAddDocumentsSubmit = useCallback(
    async (val: typeof addDocumentsForm.values) => {
      await addDocumentsMutation.mutate(val.documents);
    },
    [addDocumentsForm, addDocumentsMutation]
  );

  const onImportAreaClick = useCallback(async () => {
    if (dragAreaState === 'uploading') return;
    const fileElem = document.getElementById('documents-json-file-selector');
    if (fileElem) {
      fileElem.click();
      await fileElem.addEventListener(
        'change',
        async (ev) => {
          // @ts-ignore
          const jsonFile = ev.target!.files[0] as File;
          console.debug('onImportAreaClick', 'file-change', jsonFile);
          await onAddDocumentsSubmit({ documents: jsonFile });
        },
        false
      );
    }
  }, [dragAreaState, onAddDocumentsSubmit]);

  const onImportAreaDrop: DragEventHandler<HTMLDivElement> = useCallback(
    async (ev) => {
      ev.preventDefault();
      if (dragAreaState === 'uploading') return;
      const jsonFile = ev.dataTransfer.files[0] as File;
      console.debug('onImportAreaDrop', 'drop', jsonFile);
      await onAddDocumentsSubmit({ documents: jsonFile });
    },
    [dragAreaState, onAddDocumentsSubmit]
  );

  const onAddDocumentsJsonEditorUpdate = useCallback(
    (value: string = '[]') => addDocumentsForm.setFieldValue('documents', JSON.parse(value)),
    [addDocumentsForm]
  );

  return useMemo(
    () => (
      <div
        className={`overflow-hidden fill bg-background-light 
        flex flex-col items-stretch
        p-6 rounded-3xl gap-y-4`}
      >
        <div className={`flex justify-between items-center gap-x-6`}>
          <div className={`font-extrabold text-3xl`}>
            💽 {t('title')}({indexId})
          </div>
        </div>
        <div className={`flex-1 flex gap-2 p-4 overflow-hidden`}>
          <div className={`flex-1 flex flex-col gap-y-4`}>
            <div className="flex justify-between items-center">
              <div className={'only-one-line'}>
                <span className="pr-2">{t('input_by_editor')}</span>
                <span className={`badge sm light info`}>{t('manually_type_in')}</span>
              </div>
              <span
                data-tooltip={t('click_to_paste_clipboard_content_if_it_is_valid_json')}
                className="tooltip bw left"
              >
                <IconCopy
                  className="cursor-pointer"
                  style={{ transform: 'scale(-1, 1)' }}
                  onClick={() => pasteClipboardJSON()}
                />
              </span>
            </div>
            <form
              className={`flex-1 flex flex-col gap-y-4 overflow-hidden`}
              onSubmit={addDocumentsForm.onSubmit(onAddDocumentsSubmit)}
            >
              <div className={`border rounded-xl p-2 overflow-scroll`}>
                <MonacoEditor
                  language="json"
                  className="h-[32rem]"
                  defaultValue={JSON.stringify(addDocumentsForm.values.documents, null, 2)}
                  options={{
                    automaticLayout: true,
                    lineDecorationsWidth: 1,
                  }}
                  onChange={onAddDocumentsJsonEditorUpdate}
                  onMount={(editor) => {
                    console.debug('editorDidMount', editor, editor.getValue(), editor.getModel());
                    editorRef.current = editor;
                  }}
                ></MonacoEditor>
              </div>
              <button type="submit" className="btn light solid success w-full">
                {t('submit')}
              </button>
            </form>
          </div>
          <div className="divider vertical"></div>
          <div className="flex-1 flex flex-col gap-y-4">
            <div className={'only-one-line'}>
              <span className="pr-2">{t('import_json_file')}</span>
              <span className={`badge sm light info`}>{t('for_large_documents')}</span>
            </div>
            <div
              className={clsx(
                'flex-1 flex flex-col justify-center items-center gap-4',
                'rounded-2xl !border-4 border-dashed  border-info-700',
                'transition-colors duration-500',
                'drag-json-file-area',
                dragAreaState !== 'uploading' ? 'cursor-pointer' : 'cursor-not-allowed',
                {
                  ['border-success-700']: dragAreaState === 'over',
                  ['border-danger-700']: dragAreaState === 'uploading',
                }
              )}
              onClick={() => onImportAreaClick()}
              onDrop={onImportAreaDrop}
              onDragOver={(ev) => {
                ev.preventDefault();
                setDragAreaState('over');
              }}
              onDragLeave={(ev) => {
                ev.preventDefault();
                setDragAreaState('leave');
              }}
            >
              <h6 className="text-2xl">
                {dragAreaState === 'over' ? (
                  <>{t('release_to_upload_documents')}</>
                ) : dragAreaState === 'uploading' ? (
                  <>{t('uploading')}...</>
                ) : (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t('drag_and_drop_a_file_here', { type: '<strong class="underline">JSON</strong>' }),
                    }}
                  ></span>
                )}
              </h6>
              <span>{t('or')}</span>
              <button
                className={clsx('btn outline info', {
                  ['!success']: dragAreaState === 'over',
                  ['!danger']: dragAreaState === 'uploading',
                })}
                disabled={dragAreaState === 'uploading'}
              >
                {t('browse_file')}
              </button>
              <input
                type="file"
                id="documents-json-file-selector"
                accept=".json"
                hidden
                multiple={false}
                min={1}
                max={1}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    [
      addDocumentsForm,
      dragAreaState,
      indexId,
      onAddDocumentsJsonEditorUpdate,
      onAddDocumentsSubmit,
      onImportAreaClick,
      onImportAreaDrop,
      pasteClipboardJSON,
      t,
    ]
  );
};
