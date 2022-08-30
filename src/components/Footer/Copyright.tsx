import type { FC } from 'react';

export const Copyright: FC = () => {
  return (
    <div className={``}>
      <p>
        Powered by{' '}
        <a className={`hover:underline`} href={`//lrvinye.cn`} target="_blank">
          Kyrie Lrvinye
        </a>
      </p>
    </div>
  );
};
