import { Header } from '@/src/components/Header';
import { useMemo, useState } from 'react';
import { Select, TextInput } from '@mantine/core';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { TasksResults } from 'meilisearch';
import { EmptyArea } from '@/src/components/EmptyArea';
import { useQuery } from 'react-query';
import { useAppStore } from '@/src/store';

function Tasks() {
  const client = useMeiliClient();
  const host = useAppStore((state) => state.currentInstance?.host);
  const [tasks, setTasks] = useState<TasksResults>();
  const [filter, setFilter] = useState<{ query: string; status?: string; type?: string }>({ query: '' });

  useQuery(
    ['task', host],
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

  const taskList = useMemo(() => {
    if (tasks?.results && tasks.results.length > 0) {
      return tasks.results.map((index) => {
        const uid = index.uid;
        return (
          <div
            key={index.uid}
            className={`cursor-pointer p-3 rounded-xl grid grid-cols-4 gap-y-2
           bg-brand-1 hover:bg-opacity-50 bg-opacity-20`}
          >
            <p className={`col-span-4 text-xl font-bold`}>{uid}</p>
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
    <div className="bg-mount fill overflow-hidden flex flex-col justify-start items-stretch p-5 gap-4">
      <Header client={client} />
      <div
        className={`flex-1 bg-background-light 
        flex flex-col justify-start items-stretch
        p-6 rounded-3xl gap-y-2`}
      >
        <div className={`flex justify-between items-center gap-x-6`}>
          <div className={`font-extrabold text-3xl`}>🦄 Tasks</div>
          <TextInput className={` flex-1`} placeholder={'Search tasks'} radius={'lg'}></TextInput>

          <Select
            placeholder="Filter Task Type"
            clearable
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
          className={` overflow-y-scroll remove-scroll-bar
        flex flex-col items-stretch gap-y-2`}
        >
          {taskList}
        </div>
      </div>
    </div>
  );
}

export default Tasks;
