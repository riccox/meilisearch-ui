import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import type { ErrorFallbackProps } from './ErrorFallbackProps';
import { Alert } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export const LayoutFallback: FC<ErrorFallbackProps> = ({ error }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('sys');

  const handleGoBack = () => {
    navigate(-1);
  };

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
          <p className="link" onClick={handleGoBack}>
            {t('reload')}
          </p>
        </div>
      </Alert>
    </div>
  );
};
