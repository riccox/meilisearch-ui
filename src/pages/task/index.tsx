import './index.css';
import { useCallback, useMemo, useState } from 'react';
import { Code, Modal, Select, TextInput } from '@mantine/core';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { Task, TasksResults } from 'meilisearch';
import { EmptyArea } from '@/src/components/EmptyArea';
import { useInfiniteQuery } from '@tanstack/react-query';
import Fuse from 'fuse.js';
import { useAppStore } from '@/src/store';
import { Header } from '@/src/components/Header';
import { getTimeText, stringifyJsonPretty, TaskThemes } from '@/src/utils/text';
import _ from 'lodash';
import { TaskTypes } from 'meilisearch/src/types/types';
import { useDebounceFn } from 'ahooks';
import { hiddenRequestLoader, showRequestLoader } from '@/src/utils/loader';

function Tasks() {
  const client = useMeiliClient();
  const host = useAppStore((state) => state.currentInstance?.host);
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState<boolean>(false);
  const [taskDetailModalContent, setTaskDetailModalContent] = useState<Task>();
  const [fuse] = useState<Fuse<TasksResults['results'][0]>>(
    new Fuse([], {
      keys: ['uid', 'indexUid', 'status', 'type', 'error.code', 'error.code', 'error.message'],
    })
  );
  const [filter, setFilter] = useState<{ query: string; status?: string; type?: string }>({ query: '' });

  const tasksQuery = useInfiniteQuery(
    ['tasks', host],
    async ({ pageParam }) => {
      showRequestLoader();
      return await client.getTasks(pageParam);
    },
    {
      keepPreviousData: true,
      refetchOnMount: 'always',
      getNextPageParam: (lastPage, pages) => ({ from: lastPage.next }),
      onError: (err) => {
        console.warn('get meilisearch tasks error', err);
      },
      onSettled: () => {
        hiddenRequestLoader();
      },
    }
  );

  const filteredTasks = useMemo(() => {
    const tasks: Task[] = [];
    tasksQuery.data?.pages.forEach((page) => {
      tasks.push(...page.results);
    });

    if (tasks.length > 0) {
      console.debug('[filteredTasks tasks exists]', tasks.length);
      fuse.setCollection(tasks);
      let res: Task[] = tasks;
      if (!_.isEmpty(filter.query)) {
        res = fuse.search(filter.query).map((e) => e.item);
        console.debug('[filteredTasks exec search]', res.length);
      }
      if (!_.isEmpty(filter.type)) {
        res = res.filter((v) => v.type === filter.type);
        console.debug('[filteredTasks exec type]', res.length);
      }
      if (!_.isEmpty(filter.status)) {
        res = res.filter((v) => v.status === filter.status);
        console.debug('[filteredTasks exec status]', res.length);
      }

      return _.unionBy(res, 'uid');
    } else {
      return tasks;
    }
  }, [filter.query, filter.status, filter.type, fuse, tasksQuery.data?.pages]);

  const onClickDetail = useCallback((task: Task) => {
    setTaskDetailModalContent(task);
    setIsTaskDetailModalOpen(true);
  }, []);

  const taskList = useMemo(() => {
    if (filteredTasks.length > 0) {
      return filteredTasks.map((t) => {
        const uid = t.uid;
        return (
          <div
            key={t.uid}
            className={`cursor-pointer overflow-hidden p-3 rounded-xl flex flex-col justify-between gap-y-2
           bg-brand-1 hover:bg-opacity-30 hover:ring ring-brand-4 bg-opacity-20`}
            onClick={() => onClickDetail(t)}
          >
            <div className={`flex items-center gap-2`}>
              <p className={`text-2xl font-extrabold`}>{`#${uid}`}</p>
              <span className={`badge light ${TaskThemes[t.status]} uppercase `}>{t.status}</span>
              <p className={`ml-auto text-xl font-semibold`}>{t.type}</p>
            </div>
            <div className={`grid grid-cols-4 gap-2 task-card-options text-sm`}>
              <p>Duration: </p>
              <p>{t.duration}</p>
              <p>EnqueuedAt: </p>
              <p>{getTimeText(t.enqueuedAt)}</p>
              <p>StartedAt: </p>
              <p>{getTimeText(t.startedAt)}</p>
              <p>FinishedAt: </p>
              <p>{getTimeText(t.finishedAt)}</p>
            </div>
          </div>
        );
      });
    }
  }, [filteredTasks, onClickDetail]);

  const { run: onScrollEnd } = useDebounceFn(
    () => {
      console.debug('[onScrollEnd]');
      tasksQuery.fetchNextPage().then();
    },
    {
      wait: 500,
      leading: true,
      trailing: false,
    }
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
            <div className={`font-extrabold text-3xl`}>✅ Tasks</div>
            <TextInput
              className={`flex-1`}
              placeholder={'Search tasks'}
              radius={'lg'}
              onChange={({ target: { value } }) => setFilter((filter) => ({ ...filter, query: value }))}
            ></TextInput>

            <Select
              placeholder="Filter Task Type"
              clearable
              radius={'lg'}
              data={[
                { value: TaskTypes.DOCUMENT_DELETION, label: 'DOCUMENT_DELETION' },
                { value: TaskTypes.DOCUMENTS_ADDITION_OR_UPDATE, label: 'DOCUMENTS_ADDITION_OR_UPDATE' },
                { value: TaskTypes.INDEX_DELETION, label: 'INDEX_DELETION' },
                { value: TaskTypes.INDEX_UPDATE, label: 'INDEX_UPDATE' },
                { value: TaskTypes.INDEX_CREATION, label: 'INDEX_CREATION' },
                { value: TaskTypes.SETTINGS_UPDATE, label: 'SETTINGS_UPDATE' },
              ]}
              onChange={(value) => setFilter((filter) => ({ ...filter, type: value ?? undefined }))}
            />
            <Select
              placeholder="Filter Task Status"
              clearable
              radius={'lg'}
              data={[
                { value: 'succeeded', label: 'Succeeded ✅' },
                { value: 'processing', label: 'Processing ⚡' },
                { value: 'failed', label: 'Failed ❌' },
                { value: 'enqueued', label: 'Enqueued 🔀' },
              ]}
              onChange={(value) => setFilter((filter) => ({ ...filter, status: value ?? undefined }))}
            />
          </div>
          {filteredTasks.length > 0 ? (
            <div
              className={`flex-1 overflow-scroll
        grid grid-cols-3 auto-rows-max gap-4 p-2`}
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
              {taskList}
            </div>
          ) : (
            <div className={`col-span-full h-full`}>
              <EmptyArea />
            </div>
          )}
        </div>
        <Modal
          centered
          opened={isTaskDetailModalOpen}
          onClose={() => setIsTaskDetailModalOpen(false)}
          title="Task Detail"
        >
          <div className="flex justify-center items-center">
            <Code block className="w-96">
              {stringifyJsonPretty(taskDetailModalContent)}
            </Code>
          </div>
        </Modal>
      </div>
    ),
    [client, filteredTasks.length, isTaskDetailModalOpen, onScrollEnd, taskDetailModalContent, taskList]
  );
}

export default Tasks;
