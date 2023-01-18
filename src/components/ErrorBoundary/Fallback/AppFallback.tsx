import type { FC } from 'react';

import type { ErrorFallbackProps } from './ErrorFallbackProps';
import { Alert } from '@mantine/core';

const handleReload = () => {
  window.location.assign(window.location.origin);
};

export const AppFallback: FC<ErrorFallbackProps> = ({ error }) => {
  return (
    <div className={`full-page justify-center items-center w-fit`}>
      <Alert
        icon={<p className={'text-2xl'}>🚨</p>}
        title={<p className={`text-2xl`}>App Error</p>}
        color="red"
        radius="lg"
        variant="filled"
      >
        <div className={`text-xl`}>
          <p>{error.message}</p>
          <a onClick={handleReload}>Reload</a>
        </div>
      </Alert>
    </div>
  );
};
