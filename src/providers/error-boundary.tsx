import type { FC, ReactNode } from 'react';

import { ReactErrorBoundary } from '@/components/ErrorBoundary';
import { AppFallback } from '@/components/ErrorBoundary/Fallback';

type Props = {
  children: ReactNode;
};

export const ErrorBoundaryProvider: FC<Props> = ({ children }) => {
  return <ReactErrorBoundary FallbackComponent={AppFallback}>{children}</ReactErrorBoundary>;
};
