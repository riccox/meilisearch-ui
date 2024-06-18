import { Link, createFileRoute } from '@tanstack/react-router';
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
import { Button, Tooltip } from '@nextui-org/react';

function IndexDash() {
  const { t } = useTranslation('index');
  const client = useMeiliClient();
  const currentIndex = useCurrentIndex(client);
  const stats = useInstanceStats(client);

  console.debug('index ready', currentIndex);

  return useMemo(() => {
    return (
      <Suspense fallback={<Loader />}>
        <div className="flex-1 grid grid-cols-4">
          <main className="p-4 laptop:col-start-2 laptop:col-end-4 col-start-1 col-end-5 flex flex-col gap-4">
            <TitleWithUnderline>{`${currentIndex.index?.uid}`}</TitleWithUnderline>
            <div className="flex">
              <Descriptions
                className="flex-1"
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
              <div flex flex-col gap-3 items-start>
                <Link to="documents" from="/ins/$insID/index/$indexUID">
                  <Button color="success" variant="light" size="sm">
                    <div className="i-lucide:book-text w-1em h-1em"></div> {t('documents')}
                  </Button>
                </Link>
                <Link to="fieldDistribution" from="/ins/$insID/index/$indexUID">
                  <Tooltip
                    content={
                      <a
                        href="https://www.meilisearch.com/docs/reference/api/stats"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex gap-1 items-center"
                      >
                        <div className="i-lucide:link w-1em h-1em"></div> {t('fieldDistribution.subtitle')}
                      </a>
                    }
                    placement="left"
                  >
                    <Button color="primary" variant="light" size="sm">
                      <div className="i-lucide:align-horizontal-distribute-start w-1em h-1em"></div>
                      {t('fieldDistribution.label')}
                    </Button>
                  </Tooltip>
                </Link>
                <Link to="setting" from="/ins/$insID/index/$indexUID">
                  <Button color="secondary" variant="light" size="sm">
                    <div className="i-lucide:settings w-1em h-1em"></div>
                    {t('settings')}
                  </Button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </Suspense>
    );
  }, [currentIndex.index?.primaryKey, currentIndex.index.uid, currentIndex.index?.updatedAt, stats?.indexes, t]);
}

export const Route = createFileRoute('/ins/$insID/_layout/index/$indexUID/')({
  component: IndexDash,
});
