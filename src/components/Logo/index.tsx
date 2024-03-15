import { cn } from '@/lib/cn';
import type { FC } from 'react';

export const Logo: FC<{
  className?: string;
  href?: string;
}> = ({ className, href }) => {
  return (
    <a
      className={cn(className, 'flex justify-center items-center')}
      href={href || 'https://meilisearch.com'}
      target="_blank"
      rel="noreferrer"
    >
      <img src={`/meili-logo.svg`} className={'logo flex-1'} alt="Meili logo" />
    </a>
  );
};
