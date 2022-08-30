import type { FC } from 'react';
import { Copyright } from '@/src/components/Footer/Copyright';

export const Footer: FC = () => {
  return (
    <div className={`gap-x-2 flex justify-center w-full text-neutral-400 text-xs`}>
      <Copyright />-
      <a className={`hover:underline`} href={`//github.com/lrvinye/meilisearch-ui`} target="_blank">
        Github
      </a>
    </div>
  );
};
