import type { FC, ReactNode } from 'react';
import { MantineColorsTuple, MantineProvider } from '@mantine/core';
import theme from '@/style/theme.json';
import _ from 'lodash';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/core/styles.css';
import { NextUIProvider } from '@nextui-org/react';

type Props = {
  children: ReactNode;
};

export const UIProvider: FC<Props> = ({ children }) => {
  return (
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
  );
};
