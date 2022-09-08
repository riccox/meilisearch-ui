import { useSearchParams } from 'react-router-dom';
import { EmptyArea } from '@/src/components/EmptyArea';

export const Documents = () => {
  const [searchParams] = useSearchParams();
  return (
    <>
      {searchParams.get('index') ? <div></div> : <EmptyArea text={'Select or Create a index on the left to start'} />}
    </>
  );
};
