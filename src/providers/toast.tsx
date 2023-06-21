import { FC, ReactNode } from 'react';
import { Toaster } from 'sonner';

export const ToastProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster richColors closeButton theme="light" position="bottom-right" />
    </>
  );
};
