import { remove, toast } from './toast';

const RequestLoaderID = 'request-loader';
let RequestLoaderTimeoutId: NodeJS.Timeout[] = [];

export const showRequestLoader = () => {
  const tid = setTimeout(() => {
    // pull current tid from queue
    const arr = [...RequestLoaderTimeoutId];
    arr.splice(
      arr.findIndex((e) => e === tid),
      1
    );
    RequestLoaderTimeoutId = arr;
    toast.loading('Data fetching', {
      toastId: RequestLoaderID,
      closeButton: false,
      isLoading: true,
    });
    // just show loader for slow request
  }, 2000);
  RequestLoaderTimeoutId.push(tid);
};
export const hiddenRequestLoader = () => {
  remove(RequestLoaderID);
  clearTimeout(RequestLoaderTimeoutId[0]);
  const arr = [...RequestLoaderTimeoutId];
  arr.splice(0, 1);
  RequestLoaderTimeoutId = arr;
};

const ConnectionTestLoaderID = 'conn-test-loader';

export const showConnectionTestLoader = () => {
  toast.loading('Connection testing', {
    toastId: ConnectionTestLoaderID,
    closeButton: false,
    isLoading: true,
  });
};
export const hiddenConnectionTestLoader = () => {
  remove(ConnectionTestLoaderID);
};
