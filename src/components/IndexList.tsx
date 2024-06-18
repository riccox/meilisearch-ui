'use client';
import { useCurrentInstance } from '@/hooks/useCurrentInstance';
import { useInstanceStats } from '@/hooks/useInstanceStats';
import { Pagination, Tag, Tooltip } from '@douyinfe/semi-ui';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import _ from 'lodash';
import MeiliSearch from 'meilisearch';
import { FC, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useImmer } from 'use-immer';
import { CreateIndexButton } from './createIndex';

interface Props {
  className?: string;
  client: MeiliSearch;
}

export const IndexList: FC<Props> = ({ className = '', client }) => {
  const { t } = useTranslation('index');
  const currentInstance = useCurrentInstance();
  const host = currentInstance?.host;
  const stats = useInstanceStats(client);

  const [state, updateState] = useImmer({
    offset: 0,
    limit: 24,
  });

  const query = useQuery({
    queryKey: ['indexList', host, state],
    queryFn: async () => {
      return await client.getIndexes(state);
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (query.isSuccess) {
    }
  }, [query.data, query.isSuccess]);

  const listData = useMemo(() => {
    return query.data?.results.map((index) => {
      const uid = index.uid;
      const indexStats = stats?.indexes[index.uid];

      return {
        uid,
        numberOfDocuments: indexStats?.numberOfDocuments || 0,
        href: `/ins/${currentInstance.id}/index/${uid}`,
        isIndexing: indexStats?.isIndexing,
      };
    });
  }, [currentInstance.id, query.data?.results, stats?.indexes]);

  const pagination = useMemo(() => {
    return {
      currentPage: state.offset / state.limit + 1,
      totalPage: _.ceil((query.data?.total || 0) / state.limit),
    };
  }, [query.data?.total, state.limit, state.offset]);

  return useMemo(
    () => (
      <div className="flex flex-col gap-y-2 flex-1">
        <div className="flex justify-between">
          <div className="text-2xl font-bold">{t('common:indexes')}</div>
          <CreateIndexButton afterMutation={() => query.refetch()} />
        </div>
        <div className="grid grid-cols-6 gap-5 place-content-start place-items-start py-3">
          {listData?.map((item) => {
            return (
              <Card
                key={item.uid}
                as={Link}
                to={item.href}
                fullWidth
                shadow="sm"
                className=" group col-span-3 laptop:col-span-2 hover:no-underline h-fit hover:outline-primary-400/80 outline outline-2 outline-transparent"
              >
                <CardHeader>
                  <div className="text-xl px-1 group-hover:underline underline-primary underline-offset-3">
                    {item.uid}
                  </div>
                </CardHeader>
                <CardBody className="space-y-2">
                  <div className="flex">
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
                </CardBody>
              </Card>
            );
          })}
        </div>
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
    [listData, pagination.currentPage, query, state.limit, t, updateState]
  );
};
