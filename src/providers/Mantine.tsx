import type { FC, ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import theme from '@/src/style/theme.json';
import _ from 'lodash';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/core/styles.css';

type Props = {
  children: ReactNode;
};

export const MantineUIProvider: FC<Props> = ({ children }) => {
  return (
    <MantineProvider
      theme={{
        // @ts-ignore
        colors: _.pick(theme.colors, 'brand'),
        primaryColor: 'brand',
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
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
};
