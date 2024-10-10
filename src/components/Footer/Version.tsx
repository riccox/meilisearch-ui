import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import packageJson from '../../../package.json';
const appVersion = packageJson.version;

declare const __GIT_HASH__: string;

export const Version: FC = () => {
  const { t } = useTranslation();
  const gitHash = __GIT_HASH__ || 'unknown';

  return (
    <span className="text-nowrap">
      {t('common:version')}: {appVersion}
      {`[${gitHash.slice(0, 7)}]`}
    </span>
  );
};
