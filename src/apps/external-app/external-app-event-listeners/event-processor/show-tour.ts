import { publishExternalAppEvent } from '../../event-handler';

const showTourProcessor = (event: MessageEvent): void => {
  if (event?.data?.payload) {
    publishExternalAppEvent('lsq-marvin-trigger-tour', event.data.payload);
  }
};

export default showTourProcessor;
