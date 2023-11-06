import { useParams } from 'react-router-dom';
import { EmptyArea } from '@/src/components/EmptyArea';
import { Suspense, useMemo } from 'react';
import { SearchPage } from '@/src/components/Document/search';
import { useTranslation } from 'react-i18next';
import { Loader } from '@/src/components/Loader';

export const Documents = () => {
  const { t } = useTranslation('document');
  const { indexId } = useParams();
  const currentIndex = useMemo(() => indexId?.trim(), [indexId]);

  return useMemo(
    () => (
      <>
        {currentIndex ? (
          <Suspense fallback={<Loader size="md" />}>
            <SearchPage currentIndex={currentIndex} />
          </Suspense>
        ) : (
          <EmptyArea text={t('empty_area_tip')} />
        )}
      </>
    ),
    [currentIndex, t]
  );
};
