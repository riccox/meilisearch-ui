import { useCurrentIndex } from '@/hooks/useCurrentIndex';
import { useInstanceStats } from '@/hooks/useInstanceStats';
import { useMeiliClient } from '@/hooks/useMeiliClient';
import { createFileRoute } from '@tanstack/react-router';
import _ from 'lodash';
import { FieldDistribution } from 'meilisearch';
import { useTranslation } from 'react-i18next';
import ReactECharts from 'echarts-for-react';
import { Statistic } from '@arco-design/web-react';

const Page = () => {
  const { t } = useTranslation('index');
  const client = useMeiliClient();
  const currentIndex = useCurrentIndex(client);
  const stats = useInstanceStats(client);

  const fieldDistribution: FieldDistribution = stats?.indexes[currentIndex.index.uid].fieldDistribution ?? {};

  return (
    <div className="grid grid-cols-6 h-full overflow-scroll">
      <main className="p-4 laptop:col-start-2 laptop:-col-end-2 col-start-1 -col-end-1 flex flex-col gap-4">
        <div flex flex-col gap-4 px-1>
          <Statistic
            title={<div className="text-1rem text-black font-bold">{t('count')}</div>}
            value={stats?.indexes[currentIndex.index.uid].numberOfDocuments}
            countUp
            loading={!stats?.indexes[currentIndex.index.uid].numberOfDocuments}
            styleValue={{ color: 'green' }}
            groupSeparator
          />
        </div>
      </main>
    </div>
  );
};

export const Route = createFileRoute('/ins/$insID/_layout/index/$indexUID/_layout/setting')({
  component: Page,
});
