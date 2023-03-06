import type { FC, ReactNode } from 'react';

import { ErrorBoundaryProvider } from './error-boundary';
import { ReactQueryProvider } from './react-query';
import { ReactRouterProvider } from './react-router';
import { MantineUIProvider } from '@/src/providers/Mantine';
import { ToastProvider } from './toast';

type Props = {
  children: ReactNode;
};

export const AppProvider: FC<Props> = ({ children }) => {
  return (
    <ErrorBoundaryProvider>
      <ReactQueryProvider>
        <ReactRouterProvider>
          <MantineUIProvider>
            <ToastProvider>{children}</ToastProvider>
          </MantineUIProvider>
        </ReactRouterProvider>
      </ReactQueryProvider>
    </ErrorBoundaryProvider>
  );
};
