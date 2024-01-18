'use client';
import { FC, ReactNode, Suspense } from 'react';
import clsx from 'clsx';
import { Loader } from './Loader';
interface Props {
  className?: string;
  children: ReactNode;
}

export const Lazy: FC<Props> = ({ className = '', children }) => {
  return (
    <Suspense
      fallback={
        <div className={clsx(`flex-1 flex justify-center items-center`, className)}>
          <Loader size={'md'} />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};
