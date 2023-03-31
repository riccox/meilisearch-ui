import { useSearchParams } from 'react-router-dom';
import { EmptyArea } from '@/src/components/EmptyArea';
import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/src/store';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { useForm } from '@mantine/form';
import { Button, Loader, Modal, NumberInput, TextInput, Tooltip } from '@mantine/core';
import { IconArrowsSort, IconFilter, IconSearch } from '@tabler/icons-react';
import { showTaskErrorNotification, showTaskSubmitNotification } from '@/src/utils/text';
import ReactJson from 'react-json-view';
import _ from 'lodash';
import { EnqueuedTask, Hit } from 'meilisearch';
import { openConfirmModal } from '@mantine/modals';
import { toast } from '@/src/utils/toast';
import MonacoEditor from '@monaco-editor/react';

const emptySearchResult = {
  hits: [],
  estimatedTotalHits: 0,
  processingTimeMs: 0,
};

export const Documents = () => {
  const host = useAppStore((state) => state.currentInstance?.host);
  const apiKey = useAppStore((state) => state.currentInstance?.apiKey);
  const [searchParams] = useSearchParams();
  const client = useMeiliClient();
  const currentIndex = useMemo(() => searchParams.get('index')?.trim(), [searchParams]);
  const indexClient = useMemo(() => {
    return currentIndex ? client.index(currentIndex) : undefined;
  }, [client, currentIndex]);

  const searchForm = useForm({
    initialValues: {
      q: '',
      offset: 0,
      limit: 20,
      filter: '',
      sort: '',
    },
    validate: {
      limit: (value: number) =>
        value < 500 ? null : 'limit search value allow (<500) in this ui console for performance',
      filter: (value: string) =>
        value.length === 0 ||
        /\s(=|!=|>=|>|<|<=|(IN)|(NOT IN)|(TO)|(EXISTS)|(NOT EXISTS))\s|^_geoRadius\([\s\d,.]+\)$/g.test(value.trim())
          ? null
          : 'filter string invalid',
      sort: (value: string) => {
        const sorts = value
          .split(',')
          .filter((v) => v.trim().length > 0)
          .map((v) => v.trim());
        return sorts.length === 0 ||
          sorts.every((v) => /^([a-zA-Z]\w+|_geoRadius\([\s\d,.]+\)):(asc|desc)$/g.test(v.trim()))
          ? null
          : 'sort string invalid';
      },
    },
  });

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
          toast(msg, {
            type: 'warning',
          });
          return msg;
        }
      },
    },
  });

  const indexPrimaryKeyQuery = useQuery(
    ['indexPrimaryKey', host, indexClient?.uid],
    async () => {
      return (await indexClient?.getRawInfo())?.primaryKey;
    },
    {
      enabled: !!currentIndex,
      keepPreviousData: true,
      refetchOnMount: 'always',
      refetchInterval: 30000,
    }
  );

  const searchDocumentsQuery = useQuery(
    [
      'searchDocuments',
      host,
      indexClient?.uid,
      // dependencies for the search refresh
      searchForm.values,
    ],
    async ({ queryKey }) => {
      const { q, limit, offset, filter, sort } = { ...searchForm.values, ...(queryKey[3] as typeof searchForm.values) };
      // prevent app error from request param invalid
      if (searchForm.validate().hasErrors) return emptySearchResult;
      const data = await indexClient!.search(q, {
        limit,
        offset,
        filter,
        sort: sort
          .split(',')
          .filter((v) => v.trim().length > 0)
          .map((v) => v.trim()),
      });
      return data || emptySearchResult;
    },
    {
      enabled: !!currentIndex,
      keepPreviousData: true,
      refetchOnMount: 'always',
      refetchInterval: 5000,
    }
  );
  const [isAddDocumentsByEditorModalOpen, setIsAddDocumentsByEditorModalOpen] = useState(false);
  const [isEditDocumentsModalOpen, setIsEditDocumentsModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<object>();

  const addDocumentsMutation = useMutation(
    ['addDocuments', host, indexClient?.uid],
    async (variables: object[] | File) => {
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
    {
      onSuccess: (t) => {
        showTaskSubmitNotification(t);
        setIsAddDocumentsByEditorModalOpen(false);
        addDocumentsForm.reset();
      },
      onError: (error) => {
        console.error(error);
        showTaskErrorNotification(error);
      },
    }
  );

  const onSearchSubmit = useCallback(async () => {
    await searchDocumentsQuery.refetch();
  }, [searchDocumentsQuery]);

  const onAddDocumentsByEditorClick = useCallback(async () => {
    setIsAddDocumentsByEditorModalOpen(true);
    // read clipboard and set default val if clipboard value match rules
    const [firstContent] = await navigator.clipboard.read();
    if (firstContent.types.includes('text/plain')) {
      const json = JSON.parse(await (await firstContent.getType('text/plain')).text());
      const arr = _.isArray(json) ? json : _.isObject(json) ? [json] : [];
      console.debug('onAddDocumentsByEditorClick paste clipboard', arr, json);
      if (arr.length > 0) {
        await addDocumentsForm.setFieldValue('documents', arr);
      }
    }
  }, [addDocumentsForm]);

  const onAddDocumentsSubmit = useCallback(
    async (val: typeof addDocumentsForm.values) => {
      await addDocumentsMutation.mutate(val.documents);
    },
    [addDocumentsForm, addDocumentsMutation]
  );

  const onAddDocumentsByImportClick = useCallback(async () => {
    const fileElem = document.getElementById('documents-json-file-selector');
    if (fileElem) {
      fileElem.click();

      await fileElem.addEventListener(
        'change',
        async (ev) => {
          // @ts-ignore
          const jsonFile = ev.target!.files[0] as File;
          console.debug('onAddDocumentsByImportClick', 'file-change', jsonFile);
          await onAddDocumentsSubmit({ documents: jsonFile });
        },
        false
      );
    }
  }, [onAddDocumentsSubmit]);

  const onAddDocumentsJsonEditorUpdate = useCallback(
    (value: string = '[]') => addDocumentsForm.setFieldValue('documents', JSON.parse(value)),
    [addDocumentsForm]
  );

  const onEditDocumentJsonEditorUpdate = useCallback(
    (value: string = '[]') => setEditingDocument(JSON.parse(value)),
    []
  );

  const removeDocumentsMutation = useMutation(
    ['removeDocuments', host, indexClient?.uid],
    async (docId: string[] | number[]) => {
      return await indexClient!.deleteDocuments(docId);
    },
    {
      onSuccess: (t) => {
        showTaskSubmitNotification(t);
        searchDocumentsQuery.refetch().then();
      },
      onError: (error) => {
        console.error(error);
        showTaskErrorNotification(error);
      },
    }
  );

  const editDocumentMutation = useMutation(
    ['editDocument', host, indexClient?.uid],
    async (docs: object[]) => {
      return await indexClient!.updateDocuments(docs);
    },
    {
      onSuccess: (t) => {
        setIsEditDocumentsModalOpen(false);
        showTaskSubmitNotification(t);
        searchDocumentsQuery.refetch().then();
      },
      onError: (error) => {
        console.error(error);
        showTaskErrorNotification(error);
      },
    }
  );

  const onClickDocumentDel = useCallback(
    (doc: Hit) => {
      const pk = indexPrimaryKeyQuery.data;
      console.debug('onClickDocumentDel', 'pk', pk);
      if (pk) {
        openConfirmModal({
          title: 'Delete a document',
          centered: true,
          children: (
            <p>
              Are you sure you want to delete this{' '}
              <strong>
                document ({pk}: {doc[pk]}) in index {currentIndex}
              </strong>
              ?
            </p>
          ),
          labels: { confirm: 'Confirm', cancel: 'Cancel' },
          onConfirm: () => {
            removeDocumentsMutation.mutate([doc[pk]]);
          },
        });
      } else {
        toast(`Document deletion require the valid primaryKey in index ${indexClient?.uid}`, {
          type: 'error',
        });
      }
    },
    [currentIndex, indexClient?.uid, indexPrimaryKeyQuery.data, removeDocumentsMutation]
  );

  const onClickDocumentUpdate = useCallback((doc: Hit) => {
    setIsEditDocumentsModalOpen(true);
    setEditingDocument(doc);
  }, []);

  const onSubmitDocumentUpdate = useCallback(() => {
    editingDocument && editDocumentMutation.mutate([editingDocument]);
  }, [editDocumentMutation, editingDocument]);

  const docList = useMemo(() => {
    return searchDocumentsQuery.data?.hits.map((d, i) => {
      return (
        <div className={` rounded-xl p-4 bg-brand-1 odd:bg-opacity-20 even:bg-opacity-10 group relative`} key={i}>
          <ReactJson
            name={false}
            displayDataTypes={false}
            displayObjectSize={false}
            src={d}
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
  }, [onClickDocumentDel, onClickDocumentUpdate, searchDocumentsQuery.data?.hits]);

  return useMemo(
    () => (
      <>
        {currentIndex ? (
          <div className={`h-full flex flex-col p-6 gap-4 overflow-hidden`}>
            {/* Search bar */}
            <div className={`rounded-lg ${searchDocumentsQuery.isFetching ? 'rainbow-ring-rotate' : ''}`}>
              <div className={`rounded-lg p-4 border`}>
                <form className={`flex flex-col gap-2 `} onSubmit={searchForm.onSubmit(onSearchSubmit)}>
                  <TextInput
                    icon={<IconSearch size={16} />}
                    autoFocus
                    radius="md"
                    placeholder="type some search query..."
                    {...searchForm.getInputProps('q')}
                  />
                  <div className={`flex items-center gap-4`}>
                    <TextInput
                      className={`flex-1`}
                      label="Filter"
                      icon={<IconFilter size={16} />}
                      radius="md"
                      {...searchForm.getInputProps('filter')}
                    />
                    <Tooltip
                      position={'bottom-start'}
                      label="use half-width comma(',') to separate multi sort expression and order"
                    >
                      <TextInput
                        className={`flex-1`}
                        label="Sort"
                        icon={<IconArrowsSort size={16} />}
                        radius="md"
                        {...searchForm.getInputProps('sort')}
                      />
                    </Tooltip>
                  </div>
                  <div className={`flex items-stretch gap-4`}>
                    <NumberInput radius="md" label="Limit" {...searchForm.getInputProps('limit')} />
                    <NumberInput radius="md" label="Offset" {...searchForm.getInputProps('offset')} />
                    <div className={`ml-auto mt-auto flex gap-x-4 items-center`}>
                      {searchDocumentsQuery.isFetching && <Loader color="gray" size="sm" />}
                      <div className="dropdown info">
                        <label className={`btn solid info`} tabIndex={0}>
                          Add Documents
                        </label>
                        <div className="menu left-top w-max font-medium">
                          <div
                            className={'item only-one-line flex-nowrap !flex-row'}
                            onClick={onAddDocumentsByEditorClick}
                          >
                            <span className="pr-2"> Input by editor</span>
                            <span className={`badge sm light`}>Manually type in</span>
                          </div>
                          <div
                            className={'item only-one-line flex-nowrap !flex-row'}
                            onClick={onAddDocumentsByImportClick}
                          >
                            <span className="pr-2">Import json file</span>
                            <span className={`badge sm light`}>For large documents</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type={'submit'}
                        className={`btn solid primary bg-gradient-to-br from-[#c84e89] to-[#F15F79]`}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className={`flex gap-x-4 justify-between items-baseline`}>
              <p className={`font-extrabold text-2xl`}>Results </p>
              <div className={`flex gap-x-2 px-4 font-thin text-xs text-neutral-500`}>
                <p>total {searchDocumentsQuery.data?.estimatedTotalHits} hits</p>
                <p>in {searchDocumentsQuery.data?.processingTimeMs} ms</p>
              </div>
            </div>
            {/* Doc List */}
            <div className={`flex-1 flex flex-col gap-4 overflow-scroll`}>{docList}</div>
          </div>
        ) : (
          <EmptyArea text={'Select or Create a index on the left to start'} />
        )}
        <Modal
          opened={isAddDocumentsByEditorModalOpen}
          onClose={() => {
            setIsAddDocumentsByEditorModalOpen(false);
            addDocumentsForm.reset();
          }}
          centered
          lockScroll
          radius="lg"
          shadow="xl"
          padding="xl"
          size="xl"
          withCloseButton={true}
          title={<p className={`font-bold text-lg`}>Add New Documents</p>}
        >
          <form className={`flex flex-col gap-y-4 w-full`} onSubmit={addDocumentsForm.onSubmit(onAddDocumentsSubmit)}>
            <div className={`border rounded-xl p-2`}>
              <MonacoEditor
                language="json"
                className="h-80"
                defaultValue={JSON.stringify(addDocumentsForm.values.documents, null, 2)}
                options={{
                  automaticLayout: true,
                  lineDecorationsWidth: 1,
                }}
                onChange={onAddDocumentsJsonEditorUpdate}
              ></MonacoEditor>
            </div>
            <Button type="submit" radius={'xl'} size={'lg'} variant="light">
              Submit
            </Button>
          </form>
        </Modal>
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
                defaultValue={JSON.stringify(editingDocument ?? {}, null, 2)}
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
        <input type="file" id="documents-json-file-selector" accept=".json" hidden multiple={false} min={1} max={1} />
      </>
    ),
    [
      currentIndex,
      searchDocumentsQuery.isFetching,
      searchDocumentsQuery.data?.estimatedTotalHits,
      searchDocumentsQuery.data?.processingTimeMs,
      searchForm,
      onSearchSubmit,
      onAddDocumentsByEditorClick,
      onAddDocumentsByImportClick,
      docList,
      isAddDocumentsByEditorModalOpen,
      addDocumentsForm,
      onAddDocumentsSubmit,
      onAddDocumentsJsonEditorUpdate,
      isEditDocumentsModalOpen,
      editingDocument,
      onEditDocumentJsonEditorUpdate,
      onSubmitDocumentUpdate,
    ]
  );
};
