import { useParams } from 'react-router-dom';
import { EmptyArea } from '@/src/components/EmptyArea';
import { useMemo } from 'react';
import { SearchPage } from '@/src/components/Document/search';

export const Documents = () => {
  const { indexId } = useParams();
  const currentIndex = useMemo(() => indexId?.trim(), [indexId]);

  return useMemo(
    () => (
      <>
        {currentIndex ? (
          <SearchPage currentIndex={currentIndex} />
        ) : (
          <EmptyArea text={'Select or Create a index on the left to start'} />
        )}
      </>
    ),
    [currentIndex]
  );
};
