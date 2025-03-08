import { publishExternalAppEvent } from '../../event-handler';

const updateUrlProcessor = (event: MessageEvent): void => {
  if (event?.data?.payload) {
    publishExternalAppEvent('update-active-url', event.data.payload);
  }
};

export default updateUrlProcessor;
