import { DragEventHandler, useCallback, useMemo, useRef, useState } from 'react';
import { useCurrentInstance } from '@/hooks/useCurrentInstance';
import { toast } from '@/utils/toast';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { EnqueuedTask } from 'meilisearch';
import _ from 'lodash';
import { showTaskErrorNotification, showTaskSubmitNotification } from '@/utils/text';
import MonacoEditor from '@monaco-editor/react';
import { IconCopy } from '@tabler/icons-react';
import { hiddenRequestLoader, showRequestLoader } from '@/utils/loader';
import { useTranslation } from 'react-i18next';
import { useMeiliClient } from '@/hooks/useMeiliClient';
import { useCurrentIndex } from '@/hooks/useCurrentIndex';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderPage } from '@/components/loader';
import { Tag } from '@douyinfe/semi-ui';
import { Tooltip } from '@arco-design/web-react';
import { Button } from '@nextui-org/react';
import { cn } from '@/lib/cn';

const UploadDoc = () => {
  const { t } = useTranslation('upload');

  const [dragAreaState, setDragAreaState] = useState<'leave' | 'over' | 'uploading'>('leave');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  const currentInstance = useCurrentInstance();
  const client = useMeiliClient();
  const currentIndex = useCurrentIndex(client);

  const host = currentInstance?.host;
  const apiKey = currentInstance?.apiKey;

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
          const msg = t('documents_json_array_requirement');
          toast.error(msg);
          return msg;
        }
      },
    },
  });

  const addDocumentsMutation = useMutation({
    mutationFn: async (variables: object[] | File) => {
      const url = new URL(`/indexes/${currentIndex.index.uid}/documents`, host);
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
        className={`overflow-hidden fill 
        flex flex-col items-stretch rounded-3xl gap-4`}
      >
        <div className={`flex-1 flex gap-4 p-4 overflow-hidden`}>
          <div className={`flex-1 flex flex-col gap-4`}>
            <div className="flex items-center gap-2">
              <span>{t('input_by_editor')}</span>
              <Tag size="small">{t('manually_type_in')}</Tag>
              <Tooltip content={t('click_to_paste_clipboard_content_if_it_is_valid_json')} position="bottom">
                <IconCopy className="cursor-pointer" size={'1em'} onClick={() => pasteClipboardJSON()} />
              </Tooltip>
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
              <Button type="submit" color="success">
                {t('submit')}
              </Button>
            </form>
          </div>
          <div className="flex-1 flex flex-col gap-y-4">
            <div className={'only-one-line flex items-center'}>
              <span className="pr-2">{t('import_json_file')}</span>
              <Tag size="small">{t('for_large_documents')}</Tag>
            </div>
            <div
              className={cn(
                'flex-1 flex flex-col justify-center items-center gap-4',
                'rounded-2xl !border-4 border-dashed  border-neutral-500',
                'transition-colors duration-500',
                'drag-json-file-area',
                dragAreaState !== 'uploading' ? 'cursor-pointer' : 'cursor-not-allowed',
                {
                  ['border-green-600']: dragAreaState === 'over',
                  ['border-rose-600']: dragAreaState === 'uploading',
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
              <Button
                variant="bordered"
                color={dragAreaState === 'over' ? 'success' : dragAreaState === 'uploading' ? 'danger' : 'default'}
                disabled={dragAreaState === 'uploading'}
              >
                {t('browse_file')}
              </Button>
              <input
                type="file"
                id="documents-json-file-selector"
                accept=".json"
                className="hidden"
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
      onAddDocumentsJsonEditorUpdate,
      onAddDocumentsSubmit,
      onImportAreaClick,
      onImportAreaDrop,
      pasteClipboardJSON,
      t,
    ]
  );
};

export const Route = createFileRoute('/ins/$insID/_layout/index/$indexUID/_layout/documents/upload')({
  component: UploadDoc,
  pendingComponent: LoaderPage,
});
