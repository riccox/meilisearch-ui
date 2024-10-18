'use client';
import { cn } from '@/lib/cn';
import { getTimeAgo, getTimeText } from '@/utils/text';
import dayjs from 'dayjs';
import { FC, useState } from 'react';
interface Props {
  className?: string;
  date?: Date;
}

export const TimeAgo: FC<Props> = ({ className = '', date }) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <div
      className={cn('w-fit h-fit', className)}
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
      }}
    >
      {date && dayjs(date).isValid() ? (isHover ? getTimeText(date) : getTimeAgo(date)) : '-'}
    </div>
  );
};
