import { KeyForm } from '@/components/keyForm';
import { LoaderPage } from '@/components/loader';
import { TimeAgo } from '@/components/timeago';
import { useCurrentInstance } from '@/hooks/useCurrentInstance';
import { useMeiliClient } from '@/hooks/useMeiliClient';
import { hiddenRequestLoader, showRequestLoader } from '@/utils/loader';
import { getTimeText } from '@/utils/text';
import { Modal, TagGroup, Table, Descriptions, Pagination } from '@douyinfe/semi-ui';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { ActionIcon, CopyButton } from '@mantine/core';
import { Button, Tooltip } from '@nextui-org/react';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Key } from 'meilisearch';
import { useCallback, useEffect, useReducer } from 'react';
import { useTranslation } from 'react-i18next';

type KeyFormState = { visible: boolean; editing?: Key; type: 'create' | 'edit' };
type PaginationState = { pageSize: number; currentPage: number };

const Page = () => {
  const { t } = useTranslation('key');
  const client = useMeiliClient();
  const currentInstance = useCurrentInstance();

  const host = currentInstance?.host;

  const [formState, updateFormState] = useReducer(
    (prev: KeyFormState, next: Partial<KeyFormState>) => {
      return { ...prev, ...next };
    },
    { visible: false, type: 'create' } as KeyFormState
  );

  const [pagination, updatePagination] = useReducer(
    (prev: PaginationState, next: Partial<PaginationState>) => {
      return { ...prev, ...next };
    },
    { pageSize: 20, currentPage: 1 } as PaginationState
  );

  const keysQuery = useQuery({
    queryKey: ['keys', host, pagination],
    queryFn: async () => {
      showRequestLoader();
      console.debug(client.config, pagination);
      return await client.getKeys({
        limit: pagination.pageSize,
        offset: (pagination.currentPage - 1) * pagination.pageSize,
      });
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

  const refreshKeys = useCallback(() => {
    // wait for create key task complete
    setTimeout(() => {
      keysQuery.refetch().then();
    }, 1000);
  }, [keysQuery]);

  const onClickDelKey = useCallback(
    (key: Key) => {
      Modal.confirm({
        title: t('delete.title'),
        centered: true,
        content: <p>{t('delete.tip')}</p>,
        onOk: async () => {
          client.deleteKey(key.uid).finally(() => {
            refreshKeys();
          });
        },
        okText: t('confirm'),
        cancelText: t('cancel'),
      });
    },
    [client, refreshKeys, t]
  );

  const columns: ColumnProps<Key>[] = [
    {
      title: t('name'),
      dataIndex: 'name',
      width: 200,
    },
    {
      title: t('props.key'),
      dataIndex: 'key',
      width: 120,
      render: (text) => {
        return (
          <div className={`flex items-center`}>
            {/* desensitization */}
            <p>{text.replace(/^(.{8})(?:\S+)(.{6})$/, '$1****$2')}</p>
            <CopyButton value={text} timeout={200}>
              {({ copied, copy }) => (
                <Tooltip content={copied ? t('copied') : t('copy')} placement="right">
                  <ActionIcon color={copied ? 'teal' : 'gray'} variant="transparent" onClick={copy}>
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </div>
        );
      },
    },
    {
      title: t('props.indexes'),
      dataIndex: 'indexes',
      width: 170,
      render: (_, item) => {
        return <TagGroup maxTagCount={3} tagList={item.indexes.map((i) => ({ children: i }))} showPopover />;
      },
    },
    {
      title: t('props.actions'),
      dataIndex: 'actions',
      width: 180,
      render: (_, item) => {
        return <TagGroup maxTagCount={3} tagList={item.actions.map((i) => ({ children: i }))} showPopover />;
      },
    },
    {
      title: t('expired_at'),
      dataIndex: 'expiresAt',
      width: 200,
      render: (_, item) => {
        return getTimeText(item.expiresAt, { defaultText: t('forever') });
      },
    },
    {
      title: t('actions'),
      dataIndex: 'operate',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              Modal.info({
                title: t('common:detail'),
                centered: true,
                footer: null,
                content: (
                  <Descriptions className="pb-3">
                    <Descriptions.Item itemKey="UID">{record.uid}</Descriptions.Item>
                    <Descriptions.Item itemKey={t('description')}>{record.description}</Descriptions.Item>
                    <Descriptions.Item itemKey={t('created_at')}>
                      <TimeAgo date={record.createdAt} />
                    </Descriptions.Item>
                    <Descriptions.Item itemKey={t('updated_at')}>
                      <TimeAgo date={record.updatedAt} />
                    </Descriptions.Item>
                  </Descriptions>
                ),
              });
            }}
            variant="flat"
          >
            {t('common:detail')}
          </Button>
          <Button
            size="sm"
            variant="flat"
            onClick={() => {
              updateFormState({ visible: true, type: 'edit', editing: record });
            }}
          >
            {t('common:edit')}
          </Button>
          <Button
            color="warning"
            size="sm"
            onClick={() => {
              onClickDelKey(record);
            }}
            variant="flat"
          >
            {t('common:delete')}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 overflow-scroll max-h-fit">
      <main className="p-4 flex flex-col gap-4">
        <div className={`flex justify-between items-center gap-4`}>
          <Button
            variant="solid"
            color="primary"
            size="sm"
            onClick={() => {
              updateFormState({ visible: true, type: 'create' });
            }}
          >
            {t('common:create')}
          </Button>
          <Pagination
            size="small"
            pageSize={pagination.pageSize}
            total={keysQuery.data?.total}
            currentPage={pagination.currentPage}
            onPageChange={(curr) => {
              updatePagination({ currentPage: curr });
              keysQuery.refetch();
            }}
          />
        </div>

        <Table columns={columns} dataSource={keysQuery.data?.results} pagination={false} empty={t('empty')} />

        <Modal
          visible={formState.visible}
          onCancel={() => {
            updateFormState({ visible: false });
          }}
          closable={false}
          footer={false}
        >
          <KeyForm
            afterSubmit={() => {
              refreshKeys();
              updateFormState({ visible: false });
            }}
            data={formState.editing ? { ...formState.editing, name: formState.editing.name ?? '' } : undefined}
            type={formState.type}
          />
        </Modal>
      </main>
    </div>
  );
};

export const Route = createFileRoute('/ins/$insID/_layout/keys')({
  component: Page,
  pendingComponent: LoaderPage,
});
