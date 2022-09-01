import undraw_web_search from '@/src/assets/undraw_web_search.svg';
import { useOutletContext } from 'react-router-dom';
import { Index } from 'meilisearch';

export const Documents = () => {
  const context = useOutletContext<{
    currentIndex?: Index;
  }>();
  return (
    <>
      {context?.currentIndex ? (
        <div></div>
      ) : (
        <div className={`flex-1 flex flex-col gap-4 justify-center items-center`}>
          <img className={`w-1/4`} src={undraw_web_search} alt={'undraw_web_search'} />
          <p className={`font-extrabold text-xl`}>🥳 Beautiful & Fast ⚡</p>
        </div>
      )}
    </>
  );
};
