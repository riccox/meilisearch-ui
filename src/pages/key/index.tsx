import { useCallback, useMemo, useState } from 'react';
import { Modal, TextInput } from '@mantine/core';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { Key } from 'meilisearch';
import { EmptyArea } from '@/src/components/EmptyArea';
import { useQuery } from 'react-query';
import Fuse from 'fuse.js';
import { useAppStore } from '@/src/store';
import { Header } from '@/src/components/Header';
import { getTimeText } from '@/src/utils/text';
import _ from 'lodash';
import { useDebounceFn } from 'ahooks';

function Keys() {
  const client = useMeiliClient();
  const host = useAppStore((state) => state.currentInstance?.host);
  const [isCreateKeyModalOpen, setIsCreateKeyModalOpen] = useState<boolean>(false);
  const [keys, setKeys] = useState<Key[]>([]);
  const [fuse] = useState<Fuse<Key>>(
    new Fuse(keys ?? [], {
      keys: ['uid', 'description', 'name', 'actions', 'indexes'],
    })
  );
  const [queryParams, setQueryParams] = useState<{
    offset: number;
    limit: number;
  }>({ offset: 0, limit: 20 });
  const [filter, setFilter] = useState<{ query: string; actions?: string[] }>({ query: '' });

  const keysQuery = useQuery(
    ['keys', host],
    async () => {
      return await client.getKeys(queryParams);
    },
    {
      keepPreviousData: true,
      refetchOnMount: 'always',
      onSuccess: (res) => {
        setKeys((prev) => _.unionBy(prev.concat(res.results), 'uid'));
        setQueryParams((prev) => ({ ...prev, offset: prev.offset + prev.limit }));
      },
      onError: (err) => {
        console.warn('get meilisearch keys error', err);
      },
    }
  );

  const filteredKeys = useMemo(() => {
    if (keys.length > 0) {
      console.debug('[filteredKeys keys exists]', keys.length);
      fuse.setCollection(keys);
      let res: Key[] = keys;
      if (!_.isEmpty(filter.query)) {
        res = fuse.search(filter.query).map((e) => e.item);
        console.debug('[filteredKeys exec search]', res.length);
      }
      // TODO

      return res;
    } else {
      return keys ?? [];
    }
  }, [keys, filter]);

  const onClickCreate = useCallback((key: Key) => {
    setIsCreateKeyModalOpen(true);
  }, []);

  const keyList = useMemo(() => {
    if (filteredKeys.length > 0) {
      return filteredKeys.map((t) => {
        const uid = t.uid;
        return (
          <div
            key={t.uid}
            className={`cursor-pointer overflow-hidden p-3 rounded-xl flex flex-col justify-between gap-y-2
           bg-brand-1 hover:bg-opacity-30 hover:ring ring-brand-4 bg-opacity-20`}
            onClick={() => onClickCreate(t)}
          >
            <div className={`flex items-center gap-2`}>
              <p className={`text-2xl font-extrabold`}>{`#${uid}`}</p>
            </div>
            <div className={`grid grid-cols-4 gap-2`}>
              <p className={`col-span-1 text-neutral-600`}>CreatedAt: </p>
              <p className={`col-span-3 text-right`}>{getTimeText(t.createdAt)}</p>
              <p className={`col-span-1 text-neutral-600`}>updateAt: </p>
              <p className={`col-span-3 text-right`}>{getTimeText(t.updateAt)}</p>
              <p className={`col-span-1 text-neutral-600`}>ExpiresAt: </p>
              <p className={`col-span-3 text-right`}>{getTimeText(t.expiresAt)}</p>
            </div>
          </div>
        );
      });
    } else {
      return (
        <div className={`col-span-full`}>
          <EmptyArea />
        </div>
      );
    }
  }, [filteredKeys]);

  const { run: onScrollEnd } = useDebounceFn(
    () => {
      console.debug('[onScrollEnd]');
      keysQuery.refetch().then();
    },
    {
      wait: 500,
      leading: true,
    }
  );

  return (
    <div className="bg-mount full-page items-stretch p-5 gap-4">
      <Header client={client} />
      <div
        className={`flex-1 overflow-hidden bg-background-light 
        flex flex-col justify-start items-stretch
        p-6 rounded-3xl gap-y-2`}
      >
        <div className={`flex justify-between items-center gap-x-6`}>
          <div className={`font-extrabold text-3xl`}>🦄 Keys</div>
          <TextInput
            className={` flex-1`}
            placeholder={'Search keys'}
            radius={'lg'}
            onChange={({ target: { value } }) => value && setFilter((filter) => ({ ...filter, query: value }))}
          ></TextInput>
        </div>
        <div
          className={`flex-1 overflow-y-scroll remove-scroll-bar
        grid grid-cols-3 auto-rows-max gap-4 p-2`}
          onScroll={(element) => {
            const scrollLength = element.currentTarget.scrollHeight - element.currentTarget.clientHeight;
            const scrollAt = element.currentTarget.scrollTop;
            // console.debug('[scroll]', scrollLength, scrollAt);
            if (scrollLength === scrollAt) {
              onScrollEnd();
            }
          }}
        >
          {keyList}
        </div>
      </div>
      <Modal
        centered
        opened={isCreateKeyModalOpen}
        onClose={() => setIsCreateKeyModalOpen(false)}
        title="Key Detail"
      ></Modal>
    </div>
  );
}

export default Keys;
