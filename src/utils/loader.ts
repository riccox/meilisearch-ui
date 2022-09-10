import { hideNotification, showNotification } from '@mantine/notifications';

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
    showNotification({
      id: RequestLoaderID,
      disallowClose: true,
      title: 'Loading',
      message: 'Data fetching',
      loading: true,
    });
    // just show loader for slow request
  }, 2000);
  RequestLoaderTimeoutId.push(tid);
  console.debug('[showRequestLoader]', tid, RequestLoaderTimeoutId);
};
export const hiddenRequestLoader = () => {
  hideNotification(RequestLoaderID);
  clearTimeout(RequestLoaderTimeoutId[0]);
  const arr = [...RequestLoaderTimeoutId];
  arr.splice(0, 1);
  RequestLoaderTimeoutId = arr;
  console.debug('[hiddenRequestLoader]', RequestLoaderTimeoutId);
};

const ConnectionTestLoaderID = 'conn-test-loader';

export const showConnectionTestLoader = () => {
  showNotification({
    id: ConnectionTestLoaderID,
    disallowClose: true,
    title: 'Testing',
    message: 'Connection testing',
    loading: true,
  });
};
export const hiddenConnectionTestLoader = () => {
  hideNotification(ConnectionTestLoaderID);
};
