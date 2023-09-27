import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const Copyright: FC = () => {
  const { t } = useTranslation('footer');
  return (
    <div className={``}>
      <p>
        {t('powered_by') + ' '}
        <a className={`hover:underline`} href={`https://ricco.riccox.com`} target="_blank" rel="noreferrer">
          Ricco Xie
        </a>
      </p>
    </div>
  );
};
