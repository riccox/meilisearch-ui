import './index.css';
import { useCallback, useMemo, useState } from 'react';
import { ActionIcon, CopyButton, Modal, MultiSelect, Table, TextInput, Tooltip } from '@mantine/core';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { Key } from 'meilisearch';
import { EmptyArea } from '@/src/components/EmptyArea';
import { useInfiniteQuery } from '@tanstack/react-query';
import Fuse from 'fuse.js';
import { useAppStore } from '@/src/store';
import { Header } from '@/src/components/Header';
import { getTimeText } from '@/src/utils/text';
import _ from 'lodash';
import { useDebounceFn } from 'ahooks';
import { hiddenRequestLoader, showRequestLoader } from '@/src/utils/loader';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { Footer } from '@/src/components/Footer';
import { useForm } from '@mantine/form';
import { useIndexes } from '@/src/hooks/useIndexes';
import { openConfirmModal } from '@mantine/modals';
import { toast } from '@/src/utils/toast';

function Keys() {
  const client = useMeiliClient();
  // list as many as possible
  const [indexes] = useIndexes(client, { limit: 1000 });
  const host = useAppStore((state) => state.currentInstance?.host);
  const [isCreateKeyModalOpen, setIsCreateKeyModalOpen] = useState<boolean>(false);
  const [fuse] = useState<Fuse<Key>>(
    new Fuse([], {
      keys: ['uid', 'description', 'name', 'actions', 'indexes', 'createAt', 'updateAt', 'expiresAt'],
    })
  );
  const [filter, setFilter] = useState<{ query: string; actions?: string[] }>({ query: '' });

  const keysQuery = useInfiniteQuery(
    ['keys', host],
    async ({ pageParam }) => {
      showRequestLoader();
      return await client.getKeys(pageParam);
    },
    {
      keepPreviousData: true,
      refetchOnMount: 'always',
      getNextPageParam: (lastPage) => {
        const limit = lastPage.limit ?? 20;
        const offset = lastPage.offset ?? 0;
        return {
          limit,
          offset: offset + limit > lastPage.total ? 0 : offset + limit,
        };
      },
      onError: (err) => {
        console.warn('get meilisearch keys error', err);
      },
      onSettled: () => {
        hiddenRequestLoader();
      },
    }
  );

  const filteredKeys = useMemo(() => {
    const keys: Key[] = [];
    keysQuery.data?.pages.forEach((page) => {
      keys.push(...page.results);
    });

    if (keys.length > 0) {
      console.debug('[filteredKeys keys exists]', keys.length);
      fuse.setCollection(keys);
      let res: Key[] = keys;
      if (!_.isEmpty(filter.query)) {
        res = fuse.search(filter.query).map((e) => e.item);
        console.debug('[filteredKeys exec search]', res.length);
      }

      return _.unionBy(res, 'uid');
    } else {
      return keys ?? [];
    }
  }, [keysQuery.data?.pages, fuse, filter.query]);

  const onClickCreate = useCallback(() => {
    setIsCreateKeyModalOpen(true);
  }, []);

  const refreshKeys = useCallback(() => {
    // wait for create key task complete
    setTimeout(() => {
      keysQuery.refetch().then();
    }, 1000);
  }, [keysQuery]);

  const onClickDelKey = useCallback(
    (key: Key) => {
      openConfirmModal({
        title: 'Delete this key',
        centered: true,
        children: <p>Are you sure you want to delete this key?</p>,
        labels: { confirm: 'Delete key', cancel: "No don't delete it" },
        confirmProps: { color: 'red' },
        onConfirm: () => {
          client.deleteKey(key.uid).finally(() => {
            refreshKeys();
          });
        },
      });
    },
    [client, refreshKeys]
  );

  const keyList = useMemo(() => {
    return filteredKeys.map((t) => {
      return (
        <tr key={t.uid}>
          <td>{t.uid}</td>
          <td>{t.name || '-'}</td>
          <td>{t.description || '-'}</td>
          <td>
            <div className={`flex items-center`}>
              {/* desensitization */}
              <p>{t.key.replace(/^(.{8})(?:\S+)(.{6})$/, '$1******$2')}</p>
              <CopyButton value={t.key} timeout={200}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                    <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                      {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </div>
          </td>
          <td>
            <div className={`flex gap-1 flex-wrap`}>
              {t.indexes.map((index) => (
                <span className="badge secondary light" key={index}>
                  {index}
                </span>
              ))}
            </div>
          </td>
          <td>
            <div className={`flex gap-1 flex-wrap`}>
              {t.actions.map((action) => (
                <span className="badge secondary light" key={action}>
                  {action}
                </span>
              ))}
            </div>
          </td>
          <td>{getTimeText(t.createdAt)}</td>
          <td>{getTimeText(t.updateAt)}</td>
          <td>{getTimeText(t.expiresAt, { defaultText: 'Forever' })}</td>
          <td>
            <div className={`flex gap-1`}>
              <button className={'btn sm solid danger'} onClick={() => onClickDelKey(t)}>
                Delete
              </button>
            </div>
          </td>
        </tr>
      );
    });
  }, [filteredKeys, onClickDelKey]);

  const { run: onScrollEnd } = useDebounceFn(
    () => {
      console.debug('[onScrollEnd]');
      keysQuery.fetchNextPage().then();
    },
    {
      wait: 500,
      leading: true,
      trailing: false,
    }
  );

  const [isCreateLoading, setIsCreateLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: undefined,
      description: undefined,
      indexes: [],
      actions: [],
      expiresAt: null,
    },
    validate: {
      expiresAt: (value: string | null) =>
        value ? (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(value) ? null : 'Invalid Expire Time') : null,
    },
  });

  const onCreation = useCallback(
    async ({ name, description, indexes, actions, expiresAt }: typeof form.values) => {
      // button loading
      setIsCreateLoading(true);
      let res;
      try {
        res = await client.createKey({
          name,
          description,
          indexes: _.isEmpty(indexes) ? ['*'] : indexes,
          actions: _.isEmpty(actions) ? ['*'] : actions,
          // ignore type error for legacy version compatible
          // @ts-ignore
          expiresAt: _.isEmpty(expiresAt) ? null : getTimeText(expiresAt, { format: 'YYYY-MM-DD HH:mm:ss+00:00' }),
        });
        console.info(res);
      } catch (e) {
        console.warn(e);
      }
      // button stop loading
      setIsCreateLoading(false);
      if (_.isEmpty(res)) {
        toast(`Creation fail, go check tasks! 🤥`, {
          type: 'warning',
        });
        return;
      } else {
        setIsCreateKeyModalOpen(false);
        refreshKeys();
      }
    },
    [client, form, refreshKeys]
  );

  return useMemo(
    () => (
      <div className="bg-mount full-page items-stretch p-5 gap-4">
        <Header client={client} />
        <div
          className={`flex-1 overflow-hidden bg-background-light 
        flex flex-col justify-start items-stretch
        p-6 rounded-3xl gap-y-2`}
        >
          <div className={`flex justify-between items-center gap-x-6`}>
            <div className={`font-extrabold text-3xl`}>🗝️ Keys</div>
            <TextInput
              className={` flex-1`}
              placeholder={'Search keys'}
              radius={'lg'}
              onChange={({ target: { value } }) => setFilter((filter) => ({ ...filter, query: value }))}
            ></TextInput>
            <button className={'btn solid info sm'} onClick={() => onClickCreate()}>
              Create
            </button>
          </div>
          <div
            className={`flex-1 p-2 w-full overflow-scroll`}
            onScroll={(element) => {
              if (
                //  fix unknown uncalled problem
                Math.abs(
                  element.currentTarget.scrollHeight -
                    element.currentTarget.scrollTop -
                    element.currentTarget.clientHeight
                ) <= 3.0
              ) {
                onScrollEnd();
              }
            }}
          >
            {filteredKeys.length > 0 ? (
              <Table
                className={`w-full min-h-fit flex-1`}
                horizontalSpacing="xl"
                verticalSpacing="sm"
                striped
                highlightOnHover
              >
                <thead>
                  <tr>
                    <th>UID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Key</th>
                    <th>Indexes</th>
                    <th>Actions</th>
                    <th>CreateAt</th>
                    <th>UpdateAt</th>
                    <th>ExpiresAt</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className={`py-1`}>{keyList}</tbody>
              </Table>
            ) : (
              <div className={`fill`}>
                <EmptyArea />
              </div>
            )}
          </div>
        </div>
        <Modal
          centered
          lockScroll
          size="lg"
          radius="lg"
          shadow="xl"
          padding="xl"
          opened={isCreateKeyModalOpen}
          onClose={() => setIsCreateKeyModalOpen(false)}
        >
          <p className={`text-center font-semibold text-lg`}>Add New Key</p>
          <form className={`flex flex-col gap-y-6 w-full `} onSubmit={form.onSubmit(onCreation)}>
            <TextInput
              autoFocus
              radius="md"
              size={'lg'}
              label={<p className={'text-brand-5 pb-2 text-lg'}>Name</p>}
              placeholder="just name your key"
              {...form.getInputProps('name')}
            />
            <TextInput
              autoFocus
              radius="md"
              size={'lg'}
              label={<p className={'text-brand-5 pb-2 text-lg'}>Description</p>}
              placeholder="just describe your key"
              {...form.getInputProps('description')}
            />{' '}
            <Tooltip position={'bottom-start'} label="Leave this option empty means all indexes permitted">
              <MultiSelect
                radius="md"
                size={'lg'}
                label={<p className={'text-brand-5 pb-2 text-lg'}>Indexes</p>}
                placeholder="select permitted indexes"
                creatable
                clearable
                searchable
                withinPortal
                data={indexes.map((i) => i.uid)}
                {...form.getInputProps('indexes')}
              />
            </Tooltip>
            <Tooltip position={'bottom-start'} label="Leave this option empty means all indexes permitted">
              <MultiSelect
                radius="md"
                size={'lg'}
                label={<p className={'text-brand-5 pb-2 text-lg'}>Actions</p>}
                placeholder="select permitted actions"
                creatable
                clearable
                searchable
                withinPortal
                data={[
                  { value: 'search', label: 'Search' },
                  { value: 'documents.add', label: 'Add/Update documents' },
                  { value: 'documents.get', label: 'Get document(s)' },
                  { value: 'documents.delete', label: 'Delete document(s)' },
                  { value: 'indexes.create', label: 'Create index' },
                  { value: 'indexes.get', label: 'Get index(es) (without Non-authorized indexes)' },
                  { value: 'indexes.update', label: 'Update index(es)' },
                  { value: 'indexes.delete', label: 'Delete index(es)' },
                  { value: 'tasks.get', label: 'Get task(s) (without Non-authorized indexes)' },
                  { value: 'settings.get', label: 'Get settings' },
                  { value: 'settings.update', label: 'Update/Reset settings' },
                  { value: 'stats.get', label: 'Get stats (without Non-authorized indexes)' },
                  { value: 'dumps.create', label: 'Create dumps (with Non-authorized indexes)' },
                  { value: 'version', label: 'Get instance version' },
                  { value: 'keys.get', label: 'Get keys' },
                  { value: 'keys.create', label: 'Create keys' },
                  { value: 'keys.update', label: 'Update keys' },
                  { value: 'keys.delete', label: 'Delete keys' },
                ]}
                {...form.getInputProps('actions')}
              />
            </Tooltip>
            <Tooltip position={'bottom-start'} label="Leave this option empty means this key never expires">
              <TextInput
                placeholder="!!UTC!! time and format must be YYYY-MM-DD HH:mm:ss"
                radius="md"
                size={'lg'}
                label={<p className={'text-brand-5 pb-2 text-lg'}>Expired at</p>}
                {...form.getInputProps('expiresAt')}
              />
            </Tooltip>
            <button type="submit" className={`${isCreateLoading ? 'is-loading' : ''} btn solid success`}>
              Create this key
            </button>
            <Footer />
          </form>
        </Modal>
      </div>
    ),
    [
      client,
      filteredKeys.length,
      form,
      indexes,
      isCreateKeyModalOpen,
      isCreateLoading,
      keyList,
      onClickCreate,
      onCreation,
      onScrollEnd,
    ]
  );
}

export default Keys;
