import { useCallback, useMemo, useState } from 'react';
import { Badge, Code, Modal, Select, TextInput } from '@mantine/core';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { Task, TasksResults } from 'meilisearch';
import { EmptyArea } from '@/src/components/EmptyArea';
import { useQuery } from 'react-query';
import Fuse from 'fuse.js';
import { useAppStore } from '@/src/store';
import { Header } from '@/src/components/Header';
import { getTimeText, stringifyJsonPretty, TaskColors } from '@/src/utils/text';
import _ from 'lodash';

function Tasks() {
  const client = useMeiliClient();
  const host = useAppStore((state) => state.currentInstance?.host);
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState<boolean>(false);
  const [taskDetailModalContent, setTaskDetailModalContent] = useState<Task>();
  const [tasks, setTasks] = useState<TasksResults>();
  const [filter, setFilter] = useState<{ query: string; status?: string; type?: string }>({ query: '' });

  useQuery(
    ['tasks', host],
    async () => {
      return await client.getTasks();
    },
    {
      refetchOnMount: 'always',
      onSuccess: (res) => setTasks(res),
      onError: (err) => {
        console.warn('get meilisearch tasks error', err);
      },
    }
  );

  const filteredTasks = useMemo(() => {
    if (tasks?.results && tasks.results.length > 0) {
      const fuse = new Fuse(tasks.results, {
        keys: ['uid', 'indexUid', 'status', 'type', 'error.code', 'error.code', 'error.message'],
      });
      let res: Task[] = [];
      if (!_.isEmpty(filter.query)) {
        res = fuse.search(filter.query).map((e) => e.item);
      }
      // TODO

      return res;
    } else {
      return [];
    }
  }, [tasks?.results, filter]);

  const onClickDetail = useCallback((task: Task) => {
    setTaskDetailModalContent(task);
    setIsTaskDetailModalOpen(true);
  }, []);

  const taskList = useMemo(() => {
    if (tasks?.results && tasks.results.length > 0) {
      return tasks.results.map((t) => {
        const uid = t.uid;
        return (
          <div
            key={t.uid}
            className={`cursor-pointer p-3 rounded-xl flex flex-col justify-between gap-y-2
           bg-brand-1 hover:bg-opacity-30 hover:ring ring-brand-4 bg-opacity-20`}
            onClick={() => onClickDetail(t)}
          >
            <div className={`flex items-center gap-2`}>
              <p className={`text-2xl font-extrabold`}>{`#${uid}`}</p>
              <Badge color={TaskColors[t.status]} size={'lg'}>
                {t.status}
              </Badge>
              <p className={`ml-auto text-lg`}>{t.type}</p>
            </div>
            <div className={`grid grid-cols-4 gap-2`}>
              <p className={`col-span-1 text-neutral-600`}>Duration: </p>
              <p className={`col-span-3 text-right`}>{t.duration}</p>
              <p className={`col-span-1 text-neutral-600`}>EnqueuedAt: </p>
              <p className={`col-span-3 text-right`}>{getTimeText(t.enqueuedAt)}</p>
              <p className={`col-span-1 text-neutral-600`}>StartedAt: </p>
              <p className={`col-span-3 text-right`}>{getTimeText(t.startedAt)}</p>
              <p className={`col-span-1 text-neutral-600`}>FinishedAt: </p>
              <p className={`col-span-3 text-right`}>{getTimeText(t.finishedAt)}</p>
            </div>
          </div>
        );
      });
    } else {
      return (
        <div className={`flex-1`}>
          <EmptyArea />
        </div>
      );
    }
  }, [tasks?.results]);

  return (
    <div className="bg-mount full-page items-stretch p-5 gap-4">
      <Header client={client} />
      <div
        className={`flex-1 overflow-hidden bg-background-light 
        flex flex-col justify-start items-stretch
        p-6 rounded-3xl gap-y-2`}
      >
        <div className={`flex justify-between items-center gap-x-6`}>
          <div className={`font-extrabold text-3xl`}>🦄 Tasks</div>
          <TextInput className={` flex-1`} placeholder={'Search tasks'} radius={'lg'}></TextInput>

          <Select
            placeholder="Filter Task Type"
            clearable
            radius={'lg'}
            data={[
              { value: 'react', label: 'React' },
              { value: 'ng', label: 'Angular' },
              { value: 'svelte', label: 'Svelte' },
              { value: 'vue', label: 'Vue' },
            ]}
            onChange={(value) => value && setFilter((filter) => ({ ...filter, type: value }))}
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
            onChange={(value) => value && setFilter((filter) => ({ ...filter, status: value }))}
          />
        </div>
        <div
          className={`flex-1 overflow-y-scroll remove-scroll-bar
        grid grid-cols-3 gap-4 p-2`}
        >
          {taskList}
        </div>
      </div>
      <Modal
        centered
        opened={isTaskDetailModalOpen}
        onClose={() => setIsTaskDetailModalOpen(false)}
        title="Task Detail"
      >
        <Code block>{stringifyJsonPretty(taskDetailModalContent)}</Code>
      </Modal>
    </div>
  );
}

export default Tasks;
