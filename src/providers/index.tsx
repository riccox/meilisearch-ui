import type { FC, ReactNode } from 'react';

import { ErrorBoundaryProvider } from './error-boundary';
import { UIProvider } from '@/providers/ui';
import { ToastProvider } from './toast';

type Props = {
  children: ReactNode;
};

export const AppProvider: FC<Props> = ({ children }) => {
  return (
    <ErrorBoundaryProvider>
      <UIProvider>
        <ToastProvider>{children}</ToastProvider>
      </UIProvider>
    </ErrorBoundaryProvider>
  );
};
