import type { FC } from 'react';
import { Copyright } from '@/src/components/Footer/Copyright';

interface Props {
  className?: string;
}

export const Footer: FC<Props> = ({ className = '' }) => {
  return (
    <div className={`${className} gap-x-2 flex justify-center w-full text-neutral-400 text-xs`}>
      <Copyright />-
      <a className={`hover:underline`} href={`//github.com/riccox/meilisearch-ui`} target="_blank" rel="noreferrer">
        Github
      </a>
    </div>
  );
};
