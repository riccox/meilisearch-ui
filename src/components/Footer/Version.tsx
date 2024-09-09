import { FC } from 'react';
import { useTranslation } from 'react-i18next';

declare const __GIT_HASH__: string;

export const Version: FC = () => {
  const { t } = useTranslation();
  const gitHash = __GIT_HASH__ || 'unknown';

  return (
    <span>
      {t('common:version')}: {gitHash.slice(0, 7)}
    </span>
  );
};
