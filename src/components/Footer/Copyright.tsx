import type { FC } from 'react';

export const Copyright: FC = () => {
  return (
    <div className={``}>
      <p>
        Powered by{' '}
        <a className={`hover:underline`} href={`https://www.lrvinye.me`} target="_blank" rel="noreferrer">
          Kyrie Lrvinye
        </a>
      </p>
    </div>
  );
};
