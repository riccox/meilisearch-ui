import type { FC } from 'react';

import type { ErrorFallbackProps } from './ErrorFallbackProps';
import { Alert } from '@mantine/core';
import { useTranslation } from 'react-i18next';

const handleReload = () => {
  window.location.assign(window.location.origin);
};

export const AppFallback: FC<ErrorFallbackProps> = ({ error }) => {
  const { t } = useTranslation('sys');
  return (
    <div className={`full-page justify-center items-center w-fit`}>
      <Alert
        icon={<p className={'text-2xl'}>🚨</p>}
        title={<p className={`text-2xl`}>{t('warning')}</p>}
        color="red"
        radius="lg"
        variant="filled"
      >
        <div className={`text-xl`}>
          <p>{error.message}</p>
          <p className="link" onClick={handleReload}>
            {t('reload')}
          </p>
        </div>
      </Alert>
    </div>
  );
};
