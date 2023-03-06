import { toast as ReactToastify } from 'react-toastify';

export const toast = ReactToastify;

export const remove = (tid?: string | number) => ReactToastify.dismiss(tid);
export const isDisplaying = (tid: string | number): boolean => ReactToastify.isActive(tid);
