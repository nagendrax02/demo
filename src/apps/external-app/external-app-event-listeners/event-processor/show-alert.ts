import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { showNotification } from '@lsq/nextgen-preact/notification';

const showAlertProcessor = (event: MessageEvent): void => {
  if (event?.data?.payload) {
    const message = event.data.payload?.message as string;
    switch (event.data.payload.type) {
      case 'success':
        showNotification({ type: Type.SUCCESS, message });
        break;
      case 'error':
        showNotification({ type: Type.ERROR, message });
        break;
      case 'warning':
        showNotification({ type: Type.WARNING, message });
        break;
      case 'info':
        showNotification({ type: Type.INFO, message });
        break;
    }
  }
};

export default showAlertProcessor;
