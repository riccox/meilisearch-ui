'use client';
import { FC } from 'react';
interface Props {
  className?: string;
  children: string;
}

export const TitleWithUnderline: FC<Props> = ({ className = '', children }) => {
  return (
    <div className="w-fit text-3xl font-bold relative z-10">
      {children}
      <div className="-z-10 absolute w-full h-[0.8rem] bg-primary-400/75 -bottom-[2px] rounded-lg"></div>
    </div>
  );
};
