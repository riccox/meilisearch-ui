import type { FC } from 'react';
import undraw_web_search from '@/src/assets/undraw_web_search.svg';

interface Props {
  text?: string;
}

export const EmptyArea: FC<Props> = ({ text = '🥳 Beautiful & Fast ⚡' }) => {
  return (
    <div className={`fill flex flex-col gap-4 justify-center items-center`}>
      <img className={`w-1/4`} src={undraw_web_search} alt={'undraw_web_search'} />
      <p className={`font-extrabold text-xl`}>{text}</p>
    </div>
  );
};
