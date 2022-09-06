import { Header } from '@/src/components/Header';
import { useMemo, useState } from 'react';
import { ActionIcon, Badge, Button } from '@mantine/core';
import { useIndexes } from '@/src/hooks/useIndexes';
import { useInstanceStats } from '@/src/hooks/useInstanceStats';
import { Link, Outlet } from 'react-router-dom';
import { Index } from 'meilisearch';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { IconSquarePlus } from '@tabler/icons';

function IndexesLayout() {
  const client = useMeiliClient();
  const stats = useInstanceStats(client);
  const [indexes, indexesQuery] = useIndexes(client);
  const [currentIndex, setCurrentIndex] = useState<Index>();

  const indexList = useMemo(() => {
    if (indexes && indexes.length > 0) {
      return indexes.map((index) => {
        const uid = index.uid;
        const indexStat = stats?.indexes[index.uid];
        return (
          <div
            key={index.uid}
            className={`cursor-pointer p-3 rounded-xl grid grid-cols-4 gap-y-2
           bg-brand-1 hover:bg-opacity-50 bg-opacity-20`}
            onClick={() => setCurrentIndex(index)}
          >
            <p className={`col-span-4 text-xl font-bold`}>{uid}</p>
            <div className={`col-span-4 flex justify-between items-center`}>
              <Badge size="lg" variant="outline">
                Count: {indexStat?.numberOfDocuments ?? 0}
              </Badge>
              <div>{}</div>
              {indexStat?.isIndexing && <div>indexing</div>}
            </div>
          </div>
        );
      });
    } else {
      return (
        <div className={`flex-1 flex justify-center items-center`}>
          <Button radius={'xl'} size={'xl'}>
            Create Index
          </Button>
        </div>
      );
    }
  }, [indexes, stats?.indexes]);

  return (
    <div className="bg-mount full-page items-stretch p-5 gap-4">
      <Header client={client} />
      <div className={`flex-1 flex gap-4`}>
        <div
          className={`flex-1 bg-background-light 
        flex flex-col justify-start items-stretch
        p-6 rounded-3xl gap-y-2`}
        >
          <div className={`flex justify-between items-center`}>
            <div className={`font-extrabold text-3xl`}>🦄 Indexes</div>
            <ActionIcon className={``} variant={'light'} component={Link} to="/index/create">
              <IconSquarePlus size={64} />
            </ActionIcon>
          </div>
          <div
            className={`flex-1
        flex flex-col justify-start items-stretch
        rounded-3xl gap-y-2`}
          >
            {indexList}
          </div>
        </div>
        <div
          className={`flex-[3] bg-background-light 
        flex 
        p-5 rounded-3xl`}
        >
          <Outlet context={{ currentIndex, refreshIndexes: () => indexesQuery.refetch() }} />
        </div>
      </div>
    </div>
  );
}

export default IndexesLayout;
