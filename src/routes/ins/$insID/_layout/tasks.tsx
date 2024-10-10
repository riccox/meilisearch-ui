import { LoaderPage } from '@/components/loader';
import { useCurrentInstance } from '@/hooks/useCurrentInstance';
import { useMeiliClient } from '@/hooks/useMeiliClient';
import { hiddenRequestLoader, showRequestLoader } from '@/utils/loader';
import { getTimeText } from '@/utils/text';
import { DatePicker, Modal, Select, Table, TagInput } from '@douyinfe/semi-ui';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { Button } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import _ from 'lodash';
import { TasksQuery, Task, TaskTypes, TaskStatus } from 'meilisearch';
import { useEffect, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import ReactJson from 'react-json-view';

type State = TasksQuery & Required<Pick<TasksQuery, 'limit' | 'from'>>;

const Page = () => {
  const { t } = useTranslation('task');
  const client = useMeiliClient();
  const currentInstance = useCurrentInstance();

  const host = currentInstance?.host;

  const [state, updateState] = useReducer(
    (prev: State, next: Partial<State>) => {
      return { ...prev, ...next };
    },
    { limit: 20, from: 0 } as State
  );

  const query = useQuery({
    queryKey: ['tasks', host, state],
    queryFn: async () => {
      showRequestLoader();
      console.debug(client.config, state);
      return await client.getTasks({
        ..._.omitBy(state, _.isEmpty),
      });
    },
  });

  useEffect(() => {
    if (query.isError) {
      console.warn('get meilisearch tasks error', query.error);
    }
    if (!query.isFetching) {
      hiddenRequestLoader();
    }
  }, [query.error, query.isError, query.isFetching]);

  const columns: ColumnProps<Task>[] = [
    {
      title: 'UID',
      dataIndex: 'uid',
      width: 100,
    },
    {
      title: t('indexes'),
      dataIndex: 'indexUid',
      width: 120,
      render: (_) => _ || '-',
    },
    {
      title: t('common:type'),
      dataIndex: 'type',
      width: 120,
      render: (_) => t(`type.${_}`),
    },
    {
      title: t('common:status'),
      dataIndex: 'status',
      width: 120,
      render: (_) => t(`status.${_}`),
    },
    {
      title: t('duration'),
      dataIndex: 'duration',
      width: 120,
    },
    {
      title: t('enqueued_at'),
      dataIndex: 'enqueuedAt',
      width: 220,
      render: (_, item) => {
        return getTimeText(item.enqueuedAt);
      },
    },
    {
      title: t('started_at'),
      dataIndex: 'startedAt',
      width: 220,
      render: (_, item) => {
        return getTimeText(item.startedAt);
      },
    },
    {
      title: t('finished_at'),
      dataIndex: 'finishedAt',
      width: 220,
      render: (_, item) => {
        return getTimeText(item.finishedAt);
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
                  <div className="flex justify-center items-center p-4 pb-6">
                    <ReactJson
                      name={false}
                      displayDataTypes={false}
                      displayObjectSize={false}
                      enableClipboard={false}
                      src={record}
                      collapsed={3}
                      collapseStringsAfterLength={50}
                    />
                  </div>
                ),
              });
            }}
            variant="flat"
          >
            {t('common:detail')}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 overflow-scroll max-h-fit">
      <main className="p-4 flex flex-col gap-4">
        <div className={`flex justify-end items-center gap-4`}>
          <TagInput
            className="flex-1"
            placeholder={t('filter.index.placeholder')}
            onChange={(value) => {
              updateState({ indexUids: value });
            }}
          />
          <div className="flex items-center gap-2">
            <label className="text-sm text-nowrap">{t('filter.enqueuedAt.label')}</label>
            <DatePicker
              type="dateTimeRange"
              onChange={(value) => {
                if (value) {
                  updateState({ beforeEnqueuedAt: (value as Date[])[1], afterEnqueuedAt: (value as Date[])[1] });
                }
              }}
            />
          </div>
          <Select
            placeholder={t('filter.type.placeholder')}
            optionList={_.entries(t('type', { returnObjects: true }) as Record<string, string>).map(([k, v]) => ({
              value: k,
              label: v,
            }))}
            multiple
            onChange={(value) => {
              updateState({ types: (value as TaskTypes[]) || undefined });
            }}
          />
          <Select
            placeholder={t('filter.status.placeholder')}
            optionList={_.entries(t('status', { returnObjects: true }) as Record<string, string>).map(([k, v]) => ({
              value: k,
              label: v,
            }))}
            multiple
            onChange={(value) => {
              updateState({ statuses: (value as TaskStatus[]) || undefined });
            }}
          />
        </div>

        <Table columns={columns} dataSource={query.data?.results} pagination={false} empty={t('empty')} />
      </main>
    </div>
  );
};

export const Route = createFileRoute('/ins/$insID/_layout/tasks')({
  component: Page,
  pendingComponent: LoaderPage,
});
