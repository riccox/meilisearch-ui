import { hideNotification, showNotification } from '@mantine/notifications';

const RequestLoaderID = 'request-loader';

export const showRequestLoader = () => {
  showNotification({
    id: RequestLoaderID,
    disallowClose: true,
    title: 'Loading',
    message: 'Data fetching',
    loading: true,
  });
};
export const hiddenRequestLoader = () => {
  hideNotification(RequestLoaderID);
};
