import type { FC, ReactNode } from 'react';
import { MantineColorsTuple, MantineProvider } from '@mantine/core';
import theme from '@/style/theme.json';
import _ from 'lodash';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/core/styles.css';
import { NextUIProvider } from '@nextui-org/react';
import { LocaleProvider } from '@douyinfe/semi-ui';
import { lang2ArcoLocale, lang2SemiLocale, SUPPORTED_LANGUAGE } from '@/utils/i18n';
import { useTranslation } from 'react-i18next';
import { ConfigProvider } from '@arco-design/web-react';

type Props = {
  children: ReactNode;
};

export const UIProvider: FC<Props> = ({ children }) => {
  const { i18n } = useTranslation();
  return (
    <LocaleProvider locale={lang2SemiLocale(i18n.resolvedLanguage as SUPPORTED_LANGUAGE)}>
      <ConfigProvider locale={lang2ArcoLocale(i18n.resolvedLanguage as SUPPORTED_LANGUAGE)}>
        <MantineProvider
          theme={{
            colors: _.transform(_.pick(theme.colors, ['primary', 'secondary']), (result, value, key) => {
              result || (result = {});
              result[key] = Object.values(value) as unknown as MantineColorsTuple;
            }),
            primaryColor: 'primary',
          }}
        >
          <ModalsProvider
            modalProps={{
              centered: true,
              lockScroll: true,
              shadow: 'xl',
              radius: 'lg',
              padding: 'xl',
              overlayProps: {
                opacity: 0.3,
              },
            }}
          >
            <NextUIProvider>{children}</NextUIProvider>
          </ModalsProvider>
        </MantineProvider>
      </ConfigProvider>
    </LocaleProvider>
  );
};
