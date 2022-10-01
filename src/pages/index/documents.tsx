import { useSearchParams } from 'react-router-dom';
import { EmptyArea } from '@/src/components/EmptyArea';
import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useAppStore } from '@/src/store';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { useForm } from '@mantine/form';
import { Button, Loader, Modal, NumberInput, TextInput, Tooltip } from '@mantine/core';
import { IconArrowsSort, IconFilter, IconSearch } from '@tabler/icons';
import { showTaskErrorNotification, showTaskSubmitNotification } from '@/src/utils/text';
import ReactJson, { InteractionProps } from 'react-json-view';
import { showNotification } from '@mantine/notifications';
import _ from 'lodash';

export const Documents = () => {
  const host = useAppStore((state) => state.currentInstance?.host);
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
    },
  });

  const addDocumentsForm = useForm<{
    documents: object[];
  }>({
    initialValues: {
      documents: [],
    },
    validate: {
      documents: (value: object[]) => {
        if (value.length > 0) {
          return null;
        } else {
          const msg = 'Added documents should be JSON Array whose length > 0';
          showNotification({
            color: 'yellow',
            message: msg,
          });
          return msg;
        }
      },
    },
  });

  const searchDocumentsQuery = useQuery(
    ['searchDocuments', host, indexClient?.uid, searchForm.values],
    async ({ queryKey }) => {
      const { q, limit, offset, filter, sort } = { ...searchForm.values, ...(queryKey[3] as typeof searchForm.values) };
      return await indexClient!.search(q, {
        limit,
        offset,
        filter,
        sort: sort
          .split(',')
          .filter((v) => v.trim().length > 0)
          .map((v) => v.trim()),
      });
    },
    {
      enabled: !!currentIndex,
      keepPreviousData: true,
      refetchOnMount: 'always',
      refetchInterval: 5000,
      onSuccess: () => {},
      onSettled: () => {},
    }
  );
  const [isAddDocumentsModalOpen, setIsAddDocumentsModalOpen] = useState(false);

  const addDocumentsMutation = useMutation(
    ['addDocuments', host, indexClient?.uid],
    async (variables: object[]) => {
      return await indexClient!.addDocuments(variables);
    },
    {
      onSuccess: (t) => {
        showTaskSubmitNotification(t);
        setIsAddDocumentsModalOpen(false);
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

  const onAddDocumentsClick = useCallback(async () => {
    setIsAddDocumentsModalOpen(true);
    // read clipboard and set default val if clipboard value match rules
    const [firstContent] = await navigator.clipboard.read();
    if (firstContent.types.includes('text/plain')) {
      const json = JSON.parse(await (await firstContent.getType('text/plain')).text());
      const arr = _.isArray(json) ? json : _.isObject(json) ? [json] : [];
      console.debug('onAddDocumentsClick paste clipboard', arr, json);
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

  const onAddDocumentsJsonEditorUpdate = useCallback(
    (e: InteractionProps) => addDocumentsForm.setFieldValue('documents', e.updated_src as object[]),
    [addDocumentsForm]
  );

  const docList = useMemo(() => {
    return searchDocumentsQuery.data?.hits.map((d, i) => {
      return (
        <div className={`border rounded-xl p-4 bg-brand-1 odd:bg-opacity-10 even:bg-opacity-20`} key={i}>
          <ReactJson src={d} collapsed={3} collapseStringsAfterLength={50} />
        </div>
      );
    });
  }, [searchDocumentsQuery.data?.hits]);

  return useMemo(
    () => (
      <>
        {currentIndex ? (
          <div className={`h-full flex flex-col p-6 gap-5 overflow-hidden`}>
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
                      <Button color={'info'} onClick={onAddDocumentsClick}>
                        Add Documents
                      </Button>
                      <Button
                        type={'submit'}
                        variant={'gradient'}
                        gradient={{ from: '#c84e89', to: '#F15F79', deg: 165 }}
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            {/* Doc List */}
            <div className={`flex-1 flex flex-col gap-4 overflow-scroll`}>{docList}</div>
          </div>
        ) : (
          <EmptyArea text={'Select or Create a index on the left to start'} />
        )}
        <Modal
          opened={isAddDocumentsModalOpen}
          onClose={() => {
            setIsAddDocumentsModalOpen(false);
            addDocumentsForm.reset();
          }}
          centered
          lockScroll
          radius="lg"
          shadow="xl"
          overlayOpacity={0.3}
          padding="xl"
          withCloseButton={true}
          overflow={'inside'}
          title={<p className={`font-bold text-lg`}>Add New Documents</p>}
        >
          <form className={`flex flex-col gap-y-4 w-full `} onSubmit={addDocumentsForm.onSubmit(onAddDocumentsSubmit)}>
            <div className={`border rounded-xl p-4`}>
              <ReactJson
                src={addDocumentsForm.values.documents}
                onAdd={onAddDocumentsJsonEditorUpdate}
                onEdit={onAddDocumentsJsonEditorUpdate}
                onDelete={onAddDocumentsJsonEditorUpdate}
              />
            </div>
            <Button type="submit" radius={'xl'} size={'lg'} variant="light">
              Submit
            </Button>
          </form>
        </Modal>
      </>
    ),
    [
      addDocumentsForm,
      currentIndex,
      docList,
      isAddDocumentsModalOpen,
      onAddDocumentsClick,
      onAddDocumentsJsonEditorUpdate,
      onAddDocumentsSubmit,
      onSearchSubmit,
      searchDocumentsQuery.isFetching,
      searchForm,
    ]
  );
};
