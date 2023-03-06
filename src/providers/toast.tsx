import { FC, ReactNode } from 'react';
import { Slide, ToastContainer, ToastOptions } from 'react-toastify';

const commonOptions: ToastOptions = {
  theme: 'light',
  position: 'bottom-right',
  hideProgressBar: true,
  closeOnClick: true,
  autoClose: 4000,
  pauseOnHover: true,
  pauseOnFocusLoss: true,
  draggable: true,
  delay: 0,
  transition: Slide,
  className: 'rounded-lg',
};

export const ToastProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer {...commonOptions} />
    </>
  );
};
