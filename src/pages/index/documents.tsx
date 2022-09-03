import { useOutletContext } from 'react-router-dom';
import { Index } from 'meilisearch';
import { EmptyArea } from '@/src/components/EmptyArea';

export const Documents = () => {
  const context = useOutletContext<{
    currentIndex?: Index;
  }>();
  return <>{context?.currentIndex ? <div></div> : <EmptyArea />}</>;
};
