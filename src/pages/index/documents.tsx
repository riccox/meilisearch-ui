import { useParams } from '@tanstack/react-router';
import { EmptyArea } from '@/components/EmptyArea';
import { useMemo } from 'react';
import { SearchPage } from '@/components/Document/search';
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
