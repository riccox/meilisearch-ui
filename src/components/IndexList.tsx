'use client';
import { useCurrentInstance } from '@/hooks/useCurrentInstance';
import { useInstanceStats } from '@/hooks/useInstanceStats';
import { Button, Pagination, Tag, Tooltip } from '@douyinfe/semi-ui';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import _ from 'lodash';
import MeiliSearch, { Index } from 'meilisearch';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useImmer } from 'use-immer';
import { CreateIndexButton } from './createIndex';
import { cn } from '@/lib/cn';
import Fuse from 'fuse.js';
import { Input } from '@arco-design/web-react';
import { EmptyArea } from './EmptyArea';
import { TimeAgo } from './timeago';

interface Props {
  className?: string;
  client: MeiliSearch;
}

const fuse = new Fuse<Index>([], {
  keys: ['uid', 'primaryKey'],
  includeMatches: false,
  includeScore: true,
  shouldSort: true,
});

export const IndexList: FC<Props> = ({ className = '', client }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('index');
  const currentInstance = useCurrentInstance();
  const host = currentInstance?.host;
  const stats = useInstanceStats(client);

  const [state, updateState] = useImmer({
    offset: 0,
    limit: 24,
    query: '',
  });

  const query = useQuery({
    queryKey: ['indexList', host, state],
    queryFn: async () => {
      const res = await client.getIndexes(_.pick(state, ['offset', 'limit']));
      fuse.setCollection(res.results || []);
      return res;
    },
    placeholderData: keepPreviousData,
  });

  const filteredData = useMemo(() => {
    // empty string cause fuse.search return empty array.
    if (state.query && state.query.trim().length > 0) {
      return fuse.search(state.query).map((d) => d.item) || [];
    }
    return query.data?.results || [];
  }, [query.data?.results, state.query]);

  const listData = useMemo(() => {
    return filteredData.map((index) => {
      const uid = index.uid;
      const indexStats = stats?.indexes[index.uid];

      return {
        uid,
        numberOfDocuments: indexStats?.numberOfDocuments || 0,
        href: `/ins/${currentInstance.id}/index/${uid}`,
        isIndexing: indexStats?.isIndexing,
        createdAt: index.createdAt,
        updatedAt: index.updatedAt,
        primaryKey: index.primaryKey,
      };
    });
  }, [currentInstance.id, filteredData, stats?.indexes]);

  const pagination = useMemo(() => {
    return {
      currentPage: state.offset / state.limit + 1,
      totalPage: _.ceil((query.data?.total || 0) / state.limit),
    };
  }, [query.data?.total, state.limit, state.offset]);

  return useMemo(
    () => (
      <div className={cn('flex flex-col gap-y-2 flex-1', className)}>
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-nowrap">{t('common:indexes')}</div>
          <Tooltip content={t('search.tip')}>
            <div className="ml-auto !w-60">
              <Input.Search
                placeholder={t('common:search')}
                defaultValue=""
                onChange={(v) =>
                  updateState((d) => {
                    d.query = v;
                  })
                }
              />
            </div>
          </Tooltip>
          <CreateIndexButton afterMutation={() => query.refetch()} />
        </div>
        {listData && listData.length > 0 ? (
          <div className="grid grid-cols-6 gap-5 place-content-start place-items-start py-3">
            {listData?.map((item) => {
              return (
                <Card
                  key={item.uid}
                  fullWidth
                  shadow="sm"
                  className="col-span-3 laptop:col-span-2 hover:no-underline h-fit hover:outline-primary-400/80 outline outline-2 outline-transparent"
                >
                  <CardHeader as={Link} to={item.href}>
                    <div className="text-xl px-1">{item.uid}</div>
                  </CardHeader>
                  <CardBody className="space-y-1">
                    <div className="flex justify-between items-center text-neutral-500 text-xs px-1">
                      {item.createdAt && (
                        <p className={`inline-flex gap-1`}>
                          {t('common:created_at')} <TimeAgo date={item.createdAt} />
                        </p>
                      )}
                      {item.updatedAt && (
                        <p className={`inline-flex gap-1`}>
                          {t('common:updated_at')} <TimeAgo date={item.updatedAt} />
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Tag size="small" color="cyan" className={`mr-auto`}>
                          {t('count')}: {item.numberOfDocuments ?? 0}
                        </Tag>
                        {item.isIndexing && (
                          <Tooltip content={t('indexing_tip')}>
                            <Tag color="amber" size="small" className={`flex flex-nowrap`}>
                              <IconAlertTriangle size={'1em'} />
                              <div>{t('indexing')}...</div>
                            </Tag>
                          </Tooltip>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Tooltip content={t('settings')}>
                          <Button
                            theme="light"
                            type="warning"
                            icon={<div className="i-lucide:settings w-1em h-1em"></div>}
                            size="small"
                            onClick={() => navigate({ to: `index/${item.uid}/setting`, from: '/ins/$insID' })}
                          />
                        </Tooltip>
                        <Tooltip content={t('tasks')}>
                          <Button
                            theme="light"
                            type="primary"
                            icon={<div className="i-lucide:workflow w-1em h-1em"></div>}
                            size="small"
                            onClick={() =>
                              navigate({ to: `tasks`, search: { indexUids: [item.uid] }, from: '/ins/$insID' })
                            }
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyArea />
        )}
        <div className="flex justify-center">
          <Pagination
            pageSize={state.limit}
            total={query.data?.total}
            currentPage={pagination.currentPage}
            onPageChange={(c) => {
              updateState((d) => {
                d.offset = (c - 1) * state.limit;
              });
              query.refetch();
            }}
          />
        </div>
      </div>
    ),
    [className, listData, navigate, pagination.currentPage, query, state.limit, t, updateState]
  );
};
