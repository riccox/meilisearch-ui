import type { FC } from 'react';
interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Loader: FC<Props> = ({ size = 'md' }) => {
  return (
    <div className={`${size} loader primary`}>
      <div className="bar-bounce" />
    </div>
  );
};
