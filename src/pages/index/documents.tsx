import { useParams } from 'react-router-dom';
import { EmptyArea } from '@/src/components/EmptyArea';
import { useMemo } from 'react';
import { SearchPage } from '@/src/components/Document/search';
import { useTranslation } from 'react-i18next';

export const Documents = () => {
  const { t } = useTranslation('document');
  const { indexId } = useParams();
  const currentIndex = useMemo(() => indexId?.trim(), [indexId]);

  return useMemo(
    () => <>{currentIndex ? <SearchPage currentIndex={currentIndex} /> : <EmptyArea text={t('empty_area_tip')} />}</>,
    [currentIndex, t]
  );
};
