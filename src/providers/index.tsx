import type { FC, ReactNode } from 'react';

import { ErrorBoundaryProvider } from './error-boundary';
import { ReactQueryProvider } from './react-query';
import { ReactRouterProvider } from './react-router';
import { MantineUIProvider } from '@/src/providers/Mantine';

type Props = {
  children: ReactNode;
};

export const AppProvider: FC<Props> = ({ children }) => {
  return (
    <ErrorBoundaryProvider>
      <ReactQueryProvider>
        <ReactRouterProvider>
          <MantineUIProvider>{children}</MantineUIProvider>
        </ReactRouterProvider>
      </ReactQueryProvider>
    </ErrorBoundaryProvider>
  );
};
