import { useIndexes } from '@/src/hooks/useIndexes';
import { useInstanceStats } from '@/src/hooks/useInstanceStats';
import { Logo } from '@/src/components/Logo';

function Dashboard() {
  const stats = useInstanceStats();
  const indexes = useIndexes();

  return (
    <div className="bg-mount fill grid grid-cols-12 grid-rows-6 p-5 gap-4">
      <div
        className={`bg-background-light col-span-3 row-span-2
        flex flex-col justify-center items-center gap-2
        p-5 rounded-3xl drop-shadow-2xl`}
      >
        <Logo />
        <h1 className={`text-zinc-700 font-extrabold`}>Meilisearch UI</h1>
        <div className={`flex flex-wrap justify-center gap-2`}>
          <img alt={'github stars'} src={'//badgen.net//github/stars/lrvinye/meilisearch-ui'} />
          <img alt={'github issues'} src={'//badgen.net//github/issues/lrvinye/meilisearch-ui'} />
          <img alt={'github forks'} src={'//badgen.net//github/forks/lrvinye/meilisearch-ui'} />
          <img alt={'github contributors'} src={'//badgen.net//github/contributors/lrvinye/meilisearch-ui'} />
          <img alt={'github last-commit'} src={'//badgen.net/github/last-commit/lrvinye/meilisearch-ui'} />
          <img alt={'github commits'} src={'//badgen.net/github/commits/lrvinye/meilisearch-ui'} />
          <img alt={'license'} src={'//badgen.net/github/license/lrvinye/meilisearch-ui'} />
          <img alt={'url'} src={'//badgen.net/https/meilisearch-ui.vercel.app'} />
        </div>
      </div>
      <div
        className={`bg-background-light col-span-3 row-span-2
        flex justify-center items-center
        p-5 rounded-3xl drop-shadow-2xl`}
      >
        Database Size: {stats?.databaseSize} Bytes
      </div>
    </div>
  );
}

export default Dashboard;
