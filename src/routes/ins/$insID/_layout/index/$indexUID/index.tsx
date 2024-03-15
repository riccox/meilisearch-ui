import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Descriptions, Tag, Typography } from '@douyinfe/semi-ui';
import { useMeiliClient } from '@/hooks/useMeiliClient';
import { Suspense, useMemo } from 'react';
import { Copyable } from '@/components/Copyable';
import { getTimeText } from '@/utils/text';
import { useCurrentIndex } from '@/hooks/useCurrentIndex';
import { Loader } from '@/components/Loader';

function IndexDash() {
  const { t } = useTranslation('index');
  const client = useMeiliClient();
  const currentIndex = useCurrentIndex(client);

  console.debug('index ready', currentIndex);

  return useMemo(() => {
    return (
      <Suspense fallback={<Loader />}>
        <main className="flex-1 grid grid-cols-4">
          <div className="p-4 laptop:col-start-2 laptop:col-end-4 col-start-1 col-end-5 flex flex-col gap-4">
            <Typography.Title heading={1} className="text-bold">{`${currentIndex.index?.uid}`}</Typography.Title>
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
              ]}
            />
          </div>
        </main>
      </Suspense>
    );
  }, [currentIndex.index?.primaryKey, currentIndex.index?.uid, currentIndex.index?.updatedAt, t]);
}

export const Route = createFileRoute('/ins/$insID/_layout/index/$indexUID/')({
  component: IndexDash,
});
