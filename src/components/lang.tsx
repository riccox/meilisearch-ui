'use client';
import { FC, useEffect } from 'react';
import { locale2DayjsLocale, SUPPORTED_LANGUAGE, SUPPORTED_LANGUAGE_LOCALIZED } from '../utils/i18n';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

interface Props {
  className?: string;
}

export const LangSelector: FC<Props> = ({ className = '' }) => {
  const { i18n } = useTranslation();
  useEffect(() => {
    dayjs.locale(locale2DayjsLocale(i18n.resolvedLanguage as SUPPORTED_LANGUAGE));
  }, [i18n.resolvedLanguage]);
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
          {v}
        </option>
      ))}
    </select>
  );
};
