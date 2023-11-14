import type { FC } from 'react';

import type { ErrorFallbackProps } from './ErrorFallbackProps';
import { useTranslation } from 'react-i18next';

const handleReload = () => {
  window.location.assign(window.location.origin);
};

export const AppFallback: FC<ErrorFallbackProps> = ({ error }) => {
  const { t } = useTranslation('sys');
  return (
    <div className={`full-page justify-center items-center w-fit`}>
      <div className="prompt danger outline w-1/2 max-w-7xl">
        <div className="content">
          <div className="flex gap-2">
            <p className={'text-2xl'}>🚨</p>
            <p className={`text-2xl`}>{t('warning')}</p>
          </div>
          <div className={``}>
            <p>{error.message}</p>
            <p className="link inline-block" onClick={handleReload}>
              {t('reload')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
