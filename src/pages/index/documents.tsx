import { useParams } from 'react-router-dom';
import { EmptyArea } from '@/src/components/EmptyArea';
import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { useForm } from '@mantine/form';
import { Button, Loader, Modal, NumberInput, TextInput, Tooltip } from '@mantine/core';
import { IconArrowsSort, IconFilter, IconSearch } from '@tabler/icons-react';
import { showTaskErrorNotification, showTaskSubmitNotification } from '@/src/utils/text';
import ReactJson from 'react-json-view';
import { Hit } from 'meilisearch';
import { openConfirmModal } from '@mantine/modals';
import { toast } from '@/src/utils/toast';
import MonacoEditor from '@monaco-editor/react';
import { useCurrentInstance } from '@/src/hooks/useCurrentInstance';
import clsx from 'clsx';

const emptySearchResult = {
  hits: [],
  estimatedTotalHits: 0,
  processingTimeMs: 0,
};

export const Documents = () => {
  const [searchFormError, setSearchFormError] = useState<string | null>(null);
  const currentInstance = useCurrentInstance();
  const host = currentInstance?.host;
  const { indexId } = useParams();
  const client = useMeiliClient();
  const currentIndex = useMemo(() => indexId?.trim(), [indexId]);
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
      try {
        const data = await indexClient!.search(q, {
          limit,
          offset,
          filter,
          sort: sort
            .split(',')
            .filter((v) => v.trim().length > 0)
            .map((v) => v.trim()),
        });
        // clear error message if results are running normally
        setSearchFormError(null);
        return data || emptySearchResult;
      } catch (err) {
        const msg = (err as Error).message;
        setSearchFormError(null);
        if (msg.match(/filter/i)) {
          searchForm.setFieldError('filter', msg);
        } else if (msg.match(/sort/i)) {
          searchForm.setFieldError('sort', msg);
        } else {
          setSearchFormError(msg);
        }
        return emptySearchResult;
      }
    },
    {
      enabled: !!currentIndex,
      keepPreviousData: true,
    }
  );
  const [isEditDocumentsModalOpen, setIsEditDocumentsModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<object>();

  const onSearchSubmit = useCallback(async () => {
    await searchDocumentsQuery.refetch();
  }, [searchDocumentsQuery]);

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
        toast.error(`Document deletion require the valid primaryKey in index ${indexClient?.uid}`);
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
                  <div className={clsx('prompt danger ghost xs', !searchFormError && 'hidden')}>
                    <div className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-alert-triangle"
                        width={18}
                        height={18}
                        viewBox="0 0 24 24"
                        stroke-width={2}
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M10.24 3.957l-8.422 14.06a1.989 1.989 0 0 0 1.7 2.983h16.845a1.989 1.989 0 0 0 1.7 -2.983l-8.423 -14.06a1.989 1.989 0 0 0 -3.4 0z"></path>
                        <path d="M12 9v4"></path>
                        <path d="M12 17h.01"></path>
                      </svg>
                    </div>
                    <div className="content">
                      <p>{searchFormError}</p>
                    </div>
                  </div>
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

                    {/* right btn group */}
                    <div className={`ml-auto mt-auto flex gap-x-4 items-center`}>
                      {searchDocumentsQuery.isFetching && <Loader color="gray" size="sm" />}

                      {/* search btn */}
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
      </>
    ),
    [
      searchFormError,
      currentIndex,
      searchDocumentsQuery.isFetching,
      searchDocumentsQuery.data?.estimatedTotalHits,
      searchDocumentsQuery.data?.processingTimeMs,
      searchForm,
      onSearchSubmit,
      docList,
      isEditDocumentsModalOpen,
      editingDocument,
      onEditDocumentJsonEditorUpdate,
      onSubmitDocumentUpdate,
    ]
  );
};
