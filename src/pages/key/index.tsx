import './index.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActionIcon, CopyButton, Modal, MultiSelect, Table, TextInput, Tooltip } from '@mantine/core';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { Key } from 'meilisearch';
import { EmptyArea } from '@/src/components/EmptyArea';
import { useInfiniteQuery } from '@tanstack/react-query';
import Fuse from 'fuse.js';
import { Header } from '@/src/components/Header';
import { getTimeText } from '@/src/utils/text';
import _ from 'lodash';
import { useDebounceFn } from 'ahooks';
import { hiddenRequestLoader, showRequestLoader } from '@/src/utils/loader';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { Footer } from '@/src/components/Footer';
import { useForm } from '@mantine/form';
import { useIndexes } from '@/src/hooks/useIndexes';
import { modals } from '@mantine/modals';
import { toast } from '@/src/utils/toast';
import { useCurrentInstance } from '@/src/hooks/useCurrentInstance';
import { useTranslation } from 'react-i18next';

function Keys() {
  const { t } = useTranslation('key');
  const client = useMeiliClient();
  // list as many as possible
  const [indexes] = useIndexes(client, { limit: 1000 });

  const currentInstance = useCurrentInstance();
  const host = currentInstance?.host;
  const [isCreateKeyModalOpen, setIsCreateKeyModalOpen] = useState<boolean>(false);
  const [fuse] = useState<Fuse<Key>>(
    new Fuse([], {
      keys: ['uid', 'description', 'name', 'actions', 'indexes', 'createAt', 'updateAt', 'expiresAt'],
    })
  );
  const [filter, setFilter] = useState<{ query: string; actions?: string[] }>({ query: '' });

  const keysQuery = useInfiniteQuery({
    queryKey: ['keys', host],
    initialPageParam: {
      limit: 20,
      offset: 0,
    },
    queryFn: async ({ pageParam }) => {
      showRequestLoader();
      console.log(client.config);
      return await client.getKeys(pageParam);
    },
    getNextPageParam: (lastPage) => {
      const limit = lastPage.limit ?? 20;
      const offset = lastPage.offset ?? 0;
      return {
        limit,
        offset: offset + limit > lastPage.total ? 0 : offset + limit,
      };
    },
  });

  useEffect(() => {
    if (keysQuery.isError) {
      console.warn('get meilisearch keys error', keysQuery.error);
    }
    if (!keysQuery.isFetching) {
      hiddenRequestLoader();
    }
  }, [keysQuery.error, keysQuery.isError, keysQuery.isFetching]);

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
      const modalId = 'delKeyModal';
      modals.open({
        modalId,
        title: t('delete.title'),
        centered: true,
        children: (
          <div className="flex flex-col gap-6">
            <p>{t('delete.tip')}</p>
            <div className="flex gap-3">
              <button
                className="btn sm solid danger flex-1"
                onClick={() => {
                  client.deleteKey(key.uid).finally(() => {
                    refreshKeys();
                  });
                  modals.close(modalId);
                }}
              >
                {t('confirm')}
              </button>
              <button
                className="btn sm solid bw flex-1"
                onClick={() => {
                  modals.close(modalId);
                }}
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        ),
      });
    },
    [client, refreshKeys, t]
  );

  const keyList = useMemo(() => {
    return filteredKeys.map((key) => {
      return (
        <tr key={key.uid}>
          <td>{key.uid}</td>
          <td>{key.name || '-'}</td>
          <td className="hidden 2xl:table-cell">{key.description || '-'}</td>
          <td>
            <div className={`flex items-center`}>
              {/* desensitization */}
              <p>{key.key.replace(/^(.{8})(?:\S+)(.{6})$/, '$1****$2')}</p>
              <CopyButton value={key.key} timeout={200}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? t('copied') : t('copy')} withArrow position="right">
                    <ActionIcon color={copied ? 'teal' : 'gray'} variant="transparent" onClick={copy}>
                      {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </div>
          </td>
          <td>
            <div className={`flex gap-1 flex-wrap`}>
              {key.indexes.map((index) => (
                <span className="badge secondary light cornered" key={index}>
                  {index}
                </span>
              ))}
            </div>
          </td>
          <td>
            <div className={`flex gap-1 flex-wrap`}>
              {key.actions.map((action) => (
                <span className="badge secondary light cornered" key={action}>
                  {action}
                </span>
              ))}
            </div>
          </td>
          <td className="hidden 2xl:table-cell">{getTimeText(key.createdAt)}</td>
          {/* meilisearch package type typos */}
          {/* @ts-ignore */}
          <td>{getTimeText(key.updatedAt)}</td>
          <td>{getTimeText(key.expiresAt, { defaultText: t('forever') })}</td>
          <td>
            <div className={`flex gap-1`}>
              <button className={'btn sm solid danger'} onClick={() => onClickDelKey(key)}>
                {t('common:delete')}
              </button>
            </div>
          </td>
        </tr>
      );
    });
  }, [filteredKeys, onClickDelKey, t]);

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
        value ? (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(value) ? null : t('form.expireAt.invalid')) : null,
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
        toast.error(t('create.fail'));
        return;
      } else {
        setIsCreateKeyModalOpen(false);
        refreshKeys();
      }
    },
    [client, form, refreshKeys, t]
  );

  return useMemo(
    () => (
      <div className="bg-mount full-page items-stretch p-3 gap-3">
        <Header client={client} />
        <div
          className={`flex-1 overflow-hidden bg-background-light 
        flex flex-col justify-start items-stretch
        p-6 rounded-md gap-y-2`}
        >
          <div className={`flex justify-between items-center gap-x-6`}>
            <div className={`font-extrabold text-3xl`}>🗝️ {t('keys')}</div>
            <TextInput
              className={` flex-1`}
              placeholder={t('search.placeholder')}
              radius={'lg'}
              onChange={({ target: { value } }) => setFilter((filter) => ({ ...filter, query: value }))}
            ></TextInput>
            <button className={'btn solid info sm'} onClick={() => onClickCreate()}>
              {t('common:create')}
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
                    <th className=" text-left">UID</th>
                    <th className=" text-left">{t('name')}</th>
                    <th className="hidden 2xl:table-cell text-left">{t('description')}</th>
                    <th className=" text-left">{t('props.key')}</th>
                    <th className=" text-left">{t('props.indexes')}</th>
                    <th className=" text-left">{t('props.actions')}</th>
                    <th className="hidden 2xl:table-cell text-left">{t('created_at')}</th>
                    <th className=" text-left">{t('updated_at')}</th>
                    <th className=" text-left">{t('expired_at')}</th>
                    <th className=" text-left">{t('actions')}</th>
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
          radius="md"
          shadow="xl"
          padding="xl"
          opened={isCreateKeyModalOpen}
          onClose={() => setIsCreateKeyModalOpen(false)}
        >
          <p className={`text-center font-semibold text-lg`}>{t('create.title')}</p>
          <form className={`flex flex-col gap-y-6 w-full `} onSubmit={form.onSubmit(onCreation)}>
            <TextInput
              autoFocus
              radius="md"
              size={'md'}
              label={<p className={'text-brand-5 pb-2 text-lg'}>{t('name')}</p>}
              placeholder="Just name your key"
              {...form.getInputProps('name')}
            />
            <TextInput
              autoFocus
              radius="md"
              size={'md'}
              label={<p className={'text-brand-5 pb-2 text-lg'}>{t('description')}</p>}
              placeholder="Just describe your key"
              {...form.getInputProps('description')}
            />{' '}
            <Tooltip position={'bottom-start'} label={t('form.indexes.tip')}>
              <MultiSelect
                radius="md"
                size={'md'}
                label={<p className={'text-brand-5 pb-2 text-lg'}>{t('props.indexes')}</p>}
                placeholder={t('form.indexes.placeholder')}
                searchable
                data={indexes.map((i) => i.uid)}
                {...form.getInputProps('indexes')}
              />
            </Tooltip>
            <Tooltip position={'bottom-start'} label={t('form.actions.tip')}>
              <MultiSelect
                radius="md"
                size={'md'}
                label={<p className={'text-brand-5 pb-2 text-lg'}>{t('props.actions')}</p>}
                placeholder={t('form.actions.placeholder')}
                searchable
                rightSection={
                  <a
                    href="https://www.meilisearch.com/docs/reference/api/keys#actions"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-help-circle"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      stroke-width={2}
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                      <path d="M12 16v.01"></path>
                      <path d="M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483"></path>
                    </svg>
                  </a>
                }
                data={[
                  {
                    value: 'search',
                    label: 'search',
                  },
                  {
                    value: 'documents.add',
                    label: 'documents.add',
                  },
                  {
                    value: 'documents.get',
                    label: 'documents.get',
                  },
                  {
                    value: 'documents.delete',
                    label: 'documents.delete',
                  },
                  {
                    value: 'indexes.create',
                    label: 'indexes.create',
                  },
                  {
                    value: 'indexes.get',
                    label: 'indexes.get',
                  },
                  {
                    value: 'indexes.update',
                    label: 'indexes.update',
                  },
                  {
                    value: 'indexes.delete',
                    label: 'indexes.delete',
                  },
                  {
                    value: 'tasks.get',
                    label: 'tasks.get',
                  },
                  {
                    value: 'settings.get',
                    label: 'settings.get',
                  },
                  {
                    value: 'settings.update',
                    label: 'settings.update',
                  },
                  {
                    value: 'stats.get',
                    label: 'stats.get',
                  },
                  {
                    value: 'dumps.create',
                    label: 'dumps.create',
                  },
                  {
                    value: 'version',
                    label: 'version',
                  },
                  {
                    value: 'keys.get',
                    label: 'keys.get',
                  },
                  {
                    value: 'keys.create',
                    label: 'keys.create',
                  },
                  {
                    value: 'keys.update',
                    label: 'keys.update',
                  },
                  {
                    value: 'keys.delete',
                    label: 'keys.delete',
                  },
                ]}
                {...form.getInputProps('actions')}
              />
            </Tooltip>
            <Tooltip position={'bottom-start'} label={t('form.expiresAt.tip')}>
              <TextInput
                type={'datetime-local'}
                placeholder={t('form.expiresAt.placeholder')}
                radius="md"
                size={'md'}
                label={<p className={'text-brand-5 pb-2 text-lg'}>{t('expired_at')}</p>}
                {...form.getInputProps('expiresAt')}
              />
            </Tooltip>
            <button type="submit" className={`${isCreateLoading ? 'is-loading' : ''} btn solid success`}>
              {t('create.submit')}
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
      t,
    ]
  );
}

export default Keys;
