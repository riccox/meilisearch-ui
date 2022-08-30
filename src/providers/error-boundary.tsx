import type { FC, ReactNode } from 'react';

import { ReactErrorBoundary } from '@/src/components/ErrorBoundary';
import { AppFallback } from '@/src/components/ErrorBoundary/Fallback';

type Props = {
  children: ReactNode;
};

export const ErrorBoundaryProvider: FC<Props> = ({ children }) => {
  return <ReactErrorBoundary FallbackComponent={AppFallback}>{children}</ReactErrorBoundary>;
};
