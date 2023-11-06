import type { FC } from 'react';
import { LangSelector } from '../lang';

interface Props {
  className?: string;
}

export const Footer: FC<Props> = ({ className = '' }) => {
  return (
    <div className={`${className} gap-x-2 flex justify-center w-full text-neutral-400 text-xs`}>
      <LangSelector />
    </div>
  );
};
