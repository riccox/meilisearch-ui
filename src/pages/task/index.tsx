import './index.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Code, Modal, Select, TextInput } from '@mantine/core';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { Task, TasksResults } from 'meilisearch';
import { EmptyArea } from '@/src/components/EmptyArea';
import { useInfiniteQuery } from '@tanstack/react-query';
import Fuse from 'fuse.js';
import { Header } from '@/src/components/Header';
import { getTimeText, stringifyJsonPretty, TaskThemes } from '@/src/utils/text';
import _ from 'lodash';
import { useDebounceFn } from 'ahooks';
import { hiddenRequestLoader, showRequestLoader } from '@/src/utils/loader';
import { useCurrentInstance } from '@/src/hooks/useCurrentInstance';
import { useTranslation } from 'react-i18next';

function Tasks() {
  const client = useMeiliClient();
  const { t } = useTranslation('task');
  const currentInstance = useCurrentInstance();
  const host = currentInstance?.host;
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState<boolean>(false);
  const [taskDetailModalContent, setTaskDetailModalContent] = useState<Task>();
  const [fuse] = useState<Fuse<TasksResults['results'][0]>>(
    new Fuse([], {
      keys: ['uid', 'indexUid', 'status', 'type', 'error.code', 'error.code', 'error.message'],
    })
  );
  const [filter, setFilter] = useState<{ query: string; status?: string; type?: string }>({ query: '' });

  const tasksQuery = useInfiniteQuery({
    queryKey: ['tasks', host],
    initialPageParam: {},
    queryFn: async ({ pageParam }) => {
      showRequestLoader();
      return await client.getTasks(pageParam);
    },
    getNextPageParam: (lastPage, pages) => ({ from: lastPage.next }),
  });

  useEffect(() => {
    if (tasksQuery.isError) {
      console.warn('get meilisearch tasks error', tasksQuery.error);
    }
    if (!tasksQuery.isFetching) {
      console.log('fetched!');
      hiddenRequestLoader();
    }
  }, [tasksQuery.error, tasksQuery.isError, tasksQuery.isFetching]);

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
      return filteredTasks.map((task) => {
        const uid = task.uid;
        return (
          <div
            key={task.uid}
            className={`cursor-pointer overflow-hidden p-3 rounded-md flex flex-col justify-between gap-y-2
           bg-brand-1 hover:bg-opacity-30 hover:ring ring-brand-4 bg-opacity-20`}
            onClick={() => onClickDetail(task)}
          >
            <div className={`flex items-center gap-2`}>
              <p className={`text-2xl font-extrabold`}>{`#${uid}`}</p>
              <span className={`badge light ${TaskThemes[task.status]} uppercase `}>{t(`status.${task.status}`)}</span>
              <p className={`ml-auto text-xl font-semibold`}>{t(`type.${task.type}`)}</p>
            </div>
            <div className={`grid grid-cols-4 gap-2 task-card-options text-sm`}>
              <p>{t('duration')}: </p>
              <p>{task.duration}</p>
              <p>{t('enqueued_at')}: </p>
              <p>{getTimeText(task.enqueuedAt)}</p>
              <p>{t('started_at')}: </p>
              <p>{getTimeText(task.startedAt)}</p>
              <p>{t('finished_at')}: </p>
              <p>{getTimeText(task.finishedAt)}</p>
            </div>
          </div>
        );
      });
    }
  }, [filteredTasks, onClickDetail, t]);

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
      <div className="bg-mount full-page items-stretch p-3 gap-3">
        <Header client={client} />
        <div
          className={`flex-1 overflow-hidden bg-background-light 
        flex flex-col justify-start items-stretch
        p-6 rounded-md gap-y-2`}
        >
          <div className={`flex justify-between items-center gap-x-6`}>
            <div className={`font-extrabold text-3xl`}>✅ {t('tasks')}</div>
            <TextInput
              className={`flex-1`}
              placeholder={t('search.placeholder')}
              radius={'lg'}
              onChange={({ target: { value } }) => setFilter((filter) => ({ ...filter, query: value }))}
            ></TextInput>

            <Select
              placeholder={t('filter.type.placeholder')}
              radius={'lg'}
              data={_.entries(t('type', { returnObjects: true }) as Record<string, string>).map(([k, v]) => ({
                value: k,
                label: v,
              }))}
              onChange={(value) => setFilter((filter) => ({ ...filter, type: value ?? undefined }))}
            />
            <Select
              placeholder={t('filter.status.placeholder')}
              radius={'lg'}
              data={_.entries(t('status', { returnObjects: true }) as Record<string, string>).map(([k, v]) => ({
                value: k,
                label: v,
              }))}
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
          title={t('detail.title')}
          size={'xl'}
        >
          <div className="flex justify-center items-center">
            <Code block className="w-full">
              {stringifyJsonPretty(taskDetailModalContent)}
            </Code>
          </div>
        </Modal>
      </div>
    ),
    [client, filteredTasks.length, isTaskDetailModalOpen, onScrollEnd, taskDetailModalContent, t, taskList]
  );
}

export default Tasks;
