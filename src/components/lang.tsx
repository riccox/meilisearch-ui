'use client';
import { FC } from 'react';
import { SUPPORTED_LANGUAGE, SUPPORTED_LANGUAGE_LOCALIZED, lang2Locale } from '../utils/i18n';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';

interface Props {
  className?: string;
}

export const LangSelector: FC<Props> = ({ className = '' }) => {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.resolvedLanguage}
      className={cn(className, 'w-fit outline-none bg-transparent')}
      onChange={(ev) => {
        const l = ev.target.value as SUPPORTED_LANGUAGE;
        i18n.changeLanguage(l);
      }}
    >
      {_.entries(SUPPORTED_LANGUAGE_LOCALIZED).map(([k, v]) => (
        <option value={k} key={v}>
          {lang2Locale(k as SUPPORTED_LANGUAGE)}
          {v}
        </option>
      ))}
    </select>
  );
};
