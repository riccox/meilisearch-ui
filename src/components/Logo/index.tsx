import type { FC } from 'react';

export const Logo: FC = () => {
  return (
    <div>
      <a href="https://meilisearch.com" target="_blank" rel="noreferrer">
        <img src={`/meili-logo.svg`} className={'logo h-20 p-3'} alt="Meili logo" />
      </a>
    </div>
  );
};
