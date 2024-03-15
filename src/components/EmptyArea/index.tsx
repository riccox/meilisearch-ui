import type { FC } from 'react';
import undraw_web_search from '@/assets/undraw_web_search.svg';
import { useTranslation } from 'react-i18next';

interface Props {
  text?: string;
}

export const EmptyArea: FC<Props> = ({ text }) => {
  const { t } = useTranslation();
  return (
    <div className={`fill flex flex-col gap-4 justify-center items-center`}>
      <img className={`w-1/4`} src={undraw_web_search} alt={'undraw_web_search'} />
      <p className={`font-extrabold text-xl`}>{text ?? t('common:empty')}</p>
    </div>
  );
};
