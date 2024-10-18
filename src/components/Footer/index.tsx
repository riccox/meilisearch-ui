import type { FC } from 'react';
import { Copyright } from '@/components/Footer/Copyright';
import { LangSelector } from '../lang';
import { Version } from './Version';
import { Singleton } from './Singleton';
import { cn } from '@/lib/cn';

interface Props {
  className?: string;
}

export const Footer: FC<Props> = ({ className = '' }) => {
  return (
    <div className={cn(`gap-4 flex justify-center items-center w-full text-neutral-400 text-xs`, className)}>
      <Copyright />
      <Version />
      <a className={`hover:underline`} href={`//github.com/riccox/meilisearch-ui`} target="_blank" rel="noreferrer">
        Github
      </a>
      <LangSelector />
      <Singleton />
    </div>
  );
};
