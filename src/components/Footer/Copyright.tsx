import type { FC } from 'react';

export const Copyright: FC = () => {
  return (
    <div className={``}>
      <p>
        Powered by{' '}
        <a className={`hover:underline`} href={`https://ricco.riccox.com`} target="_blank" rel="noreferrer">
          Ricco Xie
        </a>
      </p>
    </div>
  );
};
