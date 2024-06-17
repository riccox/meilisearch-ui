import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Statistic } from '@arco-design/web-react';
import { Descriptions, Tag } from '@douyinfe/semi-ui';
import { useMeiliClient } from '@/hooks/useMeiliClient';
import { Suspense, useMemo } from 'react';
import { Copyable } from '@/components/Copyable';
import { getTimeText } from '@/utils/text';
import { useCurrentIndex } from '@/hooks/useCurrentIndex';
import { Loader } from '@/components/Loader';
import { TitleWithUnderline } from '@/components/title';
import { useInstanceStats } from '@/hooks/useInstanceStats';

function IndexDash() {
  const { t } = useTranslation('index');
  const client = useMeiliClient();
  const currentIndex = useCurrentIndex(client);
  const stats = useInstanceStats(client);

  console.debug('index ready', currentIndex);

  return useMemo(() => {
    return (
      <Suspense fallback={<Loader />}>
        <main className="flex-1 grid grid-cols-4">
          <div className="p-4 laptop:col-start-2 laptop:col-end-4 col-start-1 col-end-5 flex flex-col gap-4">
            <TitleWithUnderline>{`${currentIndex.index?.uid}`}</TitleWithUnderline>
            <Descriptions
              className=""
              align="left"
              data={[
                {
                  key: 'UID',
                  value: <Copyable>{currentIndex.index?.uid || ''}</Copyable>,
                },
                {
                  key: t('common:updated_at'),
                  value: getTimeText(currentIndex.index?.updatedAt),
                },
                {
                  key: t('primaryKey'),
                  value: <Tag>{currentIndex.index?.primaryKey}</Tag>,
                },
                {
                  key: t('count'),
                  value: (
                    <Statistic
                      value={stats?.indexes[currentIndex.index.uid].numberOfDocuments}
                      countUp
                      loading={!stats?.indexes[currentIndex.index.uid].numberOfDocuments}
                      styleValue={{ color: 'green', fontSize: '0.9rem' }}
                      groupSeparator
                    />
                  ),
                },
              ]}
            />
          </div>
        </main>
      </Suspense>
    );
  }, [currentIndex.index?.primaryKey, currentIndex.index.uid, currentIndex.index?.updatedAt, stats?.indexes, t]);
}

export const Route = createFileRoute('/ins/$insID/_layout/index/$indexUID/')({
  component: IndexDash,
});
