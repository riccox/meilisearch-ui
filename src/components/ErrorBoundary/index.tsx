import type { FC, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { LayoutFallback } from './Fallback';
import type { ErrorFallbackProps } from './Fallback/ErrorFallbackProps';

type ErrorBoundaryProps = {
  children: ReactNode;
  onReset?: () => void;
  FallbackComponent?: FC<ErrorFallbackProps>;
};

export const ReactErrorBoundary: FC<ErrorBoundaryProps> = ({ children, onReset, FallbackComponent }) => {
  return (
    /* eslint-disable react/jsx-handler-names */
    <ErrorBoundary FallbackComponent={FallbackComponent || LayoutFallback} onReset={onReset}>
      {children}
    </ErrorBoundary>
  );
};
